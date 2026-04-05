"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Preload } from "@react-three/drei";
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
  const progressRef = useRef(0);
  const startPosRef = useRef(new THREE.Vector3());
  const startFovRef = useRef(50);
  const enteredRef  = useRef(false);
  const lookAtRef   = useRef(new THREE.Vector3(0, 0.2, 0));

  // 줌 시작 시 현재 카메라 상태 저장
  useEffect(() => {
    if (zooming && targetPos) {
      startPosRef.current.copy(camera.position);
      startFovRef.current = (camera as THREE.PerspectiveCamera).fov;
      progressRef.current = 0;
      enteredRef.current  = false;
    }
  }, [zooming, targetPos, camera]);

  useFrame((_, delta) => {
    if (!zooming || !targetPos) return;

    // ease-in quart: 처음엔 느리게, 끝으로 갈수록 급격히 가속
    progressRef.current = Math.min(1, progressRef.current + delta / 2.2);
    const t = progressRef.current;
    const ease = t * t * t * t; // quartic ease-in

    // 카메라 위치
    camera.position.lerpVectors(startPosRef.current, targetPos, ease);

    // FOV 좁히기: 50 → 8 (망원 렌즈 효과)
    const cam = camera as THREE.PerspectiveCamera;
    cam.fov = THREE.MathUtils.lerp(startFovRef.current, 8, ease);
    cam.updateProjectionMatrix();

    // lookAt: 화면 중심을 향해
    lookAtRef.current.lerp(targetPos, ease * 0.5);
    camera.lookAt(lookAtRef.current);

    if (t >= 1 && !enteredRef.current) {
      enteredRef.current = true;
      onEntered();
    }
  });

  return null;
}

// ── 메인 씬 내부 ──
function Scene({
  screenRef,
  onMacBookClick,
  zooming,
  zoomTarget,
  onEntered,
}: {
  screenRef: React.RefObject<THREE.Mesh | null>;
  onMacBookClick: () => void;
  zooming: boolean;
  zoomTarget: THREE.Vector3 | null;
  onEntered: () => void;
}) {
  return (
    <>
      {/* 배경색 */}
      <color attach="background" args={["#F5F5F7"]} />

      {/* 조명 — 제품 사진 스튜디오 느낌 */}
      <ambientLight intensity={0.7} />
      <directionalLight
        position={[4, 8, 5]}
        intensity={1.4}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight position={[-4, 3, -3]} intensity={0.35} color="#E8F0FF" />
      <directionalLight position={[0, -5, 3]}  intensity={0.2}  color="#FFF8F0" />

      {/* HDR 환경광 */}
      <Environment preset="studio" />

      {/* 오브젝트 */}
      <MacBookModel
        screenRef={screenRef}
        onClick={onMacBookClick}
        zooming={zooming}
      />
      <IPodModel />

      {/* 카메라 리그 */}
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
  const screenRef = useRef<THREE.Mesh>(null);
  const [zooming,    setZooming]    = useState(false);
  const [showMacOS,  setShowMacOS]  = useState(false);
  const [zoomTarget, setZoomTarget] = useState<THREE.Vector3 | null>(null);

  const handleMacBookClick = useCallback(() => {
    if (zooming || showMacOS) return;

    if (screenRef.current) {
      const worldPos = new THREE.Vector3();
      screenRef.current.getWorldPosition(worldPos);

      // 화면 약간 앞에서 멈추기 (너무 깊이 들어가면 검게 됨)
      const target = worldPos.clone();
      target.z += 0.4;  // 화면 앞면 기준 약간 안쪽
      target.y += 0.05;

      setZoomTarget(target);
      setZooming(true);
    }
  }, [zooming, showMacOS]);

  const handleEntered = useCallback(() => {
    setShowMacOS(true);
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {/* Three.js 캔버스 */}
      <Canvas
        camera={{ position: [0, 0.8, 5.5], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
        style={{ background: "#F5F5F7" }}
      >
        <Scene
          screenRef={screenRef}
          onMacBookClick={handleMacBookClick}
          zooming={zooming}
          zoomTarget={zoomTarget}
          onEntered={handleEntered}
        />
        <Preload all />
      </Canvas>

      {/* 줌인 중 화이트 플래시 오버레이 */}
      <AnimatePresence>
        {zooming && !showMacOS && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0, 0.4, 1] }}
            transition={{ duration: 2.2, times: [0, 0.5, 0.8, 1] }}
            style={{ background: "#fff" }}
          />
        )}
      </AnimatePresence>

      {/* macOS 데스크탑 오버레이 */}
      <AnimatePresence>
        {showMacOS && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <MacOSDesktop visible />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 클릭 힌트 */}
      <AnimatePresence>
        {!zooming && !showMacOS && (
          <motion.p
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            style={{
              color: "rgba(0,0,0,0.28)",
              fontSize: 11,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              pointerEvents: "none",
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
