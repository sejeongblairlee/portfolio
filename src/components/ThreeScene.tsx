"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

import MacBookModel from "./MacBookModel";
import IPodModel from "./IPodModel";
import MacOSDesktop from "./MacOSDesktop";

// ── 카메라 줌인 리그 ──
interface RigProps {
  zooming: boolean;
  targetPos: THREE.Vector3 | null;
  onEntered: () => void;
}

function CameraRig({ zooming, targetPos, onEntered }: RigProps) {
  const { camera } = useThree();
  const progressRef  = useRef(0);
  const startPosRef  = useRef(new THREE.Vector3());
  const startFovRef  = useRef(50);
  const enteredRef   = useRef(false);
  const lookAtTarget = useRef(new THREE.Vector3(0.5, 0.3, 0));
  const initialized  = useRef(false);

  useEffect(() => {
    if (zooming && targetPos) {
      startPosRef.current.copy(camera.position);
      startFovRef.current = (camera as THREE.PerspectiveCamera).fov;
      progressRef.current = 0;
      enteredRef.current  = false;
      initialized.current = true;
    }
  }, [zooming, targetPos]); // eslint-disable-line

  useFrame((_, delta) => {
    if (!zooming || !targetPos || !initialized.current) return;

    // quartic ease-in: 처음엔 느리게, 끝으로 갈수록 급격히 가속
    progressRef.current = Math.min(1, progressRef.current + delta / 2.2);
    const t    = progressRef.current;
    const ease = t * t * t * t;

    // 카메라 위치 보간
    camera.position.lerpVectors(startPosRef.current, targetPos, ease);

    // FOV 좁히기: 50 → 8 (망원 렌즈로 빨려 들어가는 느낌)
    const cam = camera as THREE.PerspectiveCamera;
    cam.fov   = THREE.MathUtils.lerp(startFovRef.current, 8, ease);
    cam.updateProjectionMatrix();

    // lookAt
    lookAtTarget.current.lerp(targetPos, ease * 0.6);
    camera.lookAt(lookAtTarget.current);

    if (t >= 1 && !enteredRef.current) {
      enteredRef.current = true;
      onEntered();
    }
  });

  return null;
}

// ── 씬 내부 컴포넌트 ──
function SceneContents({
  screenRef,
  onMacBookClick,
  zooming,
  zoomTarget,
  onEntered,
}: {
  screenRef: React.MutableRefObject<THREE.Mesh | null>;
  onMacBookClick: () => void;
  zooming: boolean;
  zoomTarget: THREE.Vector3 | null;
  onEntered: () => void;
}) {
  return (
    <>
      <color attach="background" args={["#F5F5F7"]} />

      {/* 조명 — 외부 HDR 없이 순수 조명만 사용 */}
      <ambientLight intensity={1.1} />
      <directionalLight position={[5, 10, 6]}  intensity={1.6} />
      <directionalLight position={[-4, 4, -4]} intensity={0.4} color="#ddeeff" />
      <directionalLight position={[0, -4, 4]}  intensity={0.25} color="#fff8ee" />
      <hemisphereLight args={["#f0f4ff", "#e8e8e8", 0.5]} />

      <MacBookModel
        screenRef={screenRef}
        onClick={onMacBookClick}
        zooming={zooming}
      />
      <IPodModel />

      <CameraRig
        zooming={zooming}
        targetPos={zoomTarget}
        onEntered={onEntered}
      />
    </>
  );
}

// ── 최상위 컴포넌트 ──
export default function ThreeScene() {
  const screenRef  = useRef<THREE.Mesh | null>(null);
  const [zooming,    setZooming]    = useState(false);
  const [showMacOS,  setShowMacOS]  = useState(false);
  const [zoomTarget, setZoomTarget] = useState<THREE.Vector3 | null>(null);

  const handleMacBookClick = useCallback(() => {
    if (zooming || showMacOS) return;
    if (!screenRef.current) return;

    const worldPos = new THREE.Vector3();
    screenRef.current.getWorldPosition(worldPos);

    // 화면 조금 앞까지만 이동
    const target = worldPos.clone();
    target.z += 0.35;
    target.y += 0.05;

    setZoomTarget(target);
    setZooming(true);
  }, [zooming, showMacOS]);

  const handleEntered = useCallback(() => {
    setShowMacOS(true);
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Canvas
        camera={{ position: [0, 0.8, 5.5], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <SceneContents
          screenRef={screenRef}
          onMacBookClick={handleMacBookClick}
          zooming={zooming}
          zoomTarget={zoomTarget}
          onEntered={handleEntered}
        />
      </Canvas>

      {/* 줌인 시 화이트 플래시 */}
      <AnimatePresence>
        {zooming && !showMacOS && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0, 0.5, 1] }}
            transition={{ duration: 2.2, times: [0, 0.45, 0.78, 1] }}
            style={{ background: "#fff" }}
          />
        )}
      </AnimatePresence>

      {/* macOS 데스크탑 */}
      <AnimatePresence>
        {showMacOS && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45 }}
          >
            <MacOSDesktop visible />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 클릭 힌트 */}
      <AnimatePresence>
        {!zooming && !showMacOS && (
          <motion.p
            className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-none"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.0, duration: 0.7 }}
            style={{
              color: "rgba(0,0,0,0.26)",
              fontSize: 11,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              fontFamily: "Pretendard, sans-serif",
            }}
          >
            Click the MacBook
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
