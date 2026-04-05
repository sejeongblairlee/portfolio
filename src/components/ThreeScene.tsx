"use client";

import { useRef, useState, useCallback, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

import MacBookModel from "./MacBookModel";
import IPodModel    from "./IPodModel";
import MacOSDesktop from "./MacOSDesktop";
import MusicPlayer  from "./MusicPlayer";

type Mode = "idle" | "diving-macbook" | "diving-ipod" | "macos" | "music" | "returning";

const INITIAL_POS = new THREE.Vector3(0, 0.8, 5.5);
const INITIAL_FOV = 50;

// ─────────────────────────────────────────
// 카메라 애니메이션 (dive-in / 복귀)
// ─────────────────────────────────────────
interface CamAnim {
  active:     boolean;
  progress:   number;
  duration:   number;
  startPos:   THREE.Vector3;
  endPos:     THREE.Vector3;
  startFov:   number;
  endFov:     number;
  onComplete: (() => void) | null;
}

function CameraController({
  mode,
  macbookScreenRef,
  ipodScreenRef,
  onModeChange,
}: {
  mode:              Mode;
  macbookScreenRef:  React.MutableRefObject<THREE.Mesh | null>;
  ipodScreenRef:     React.MutableRefObject<THREE.Mesh | null>;
  onModeChange:      (m: Mode) => void;
}) {
  const { camera } = useThree();
  const anim     = useRef<CamAnim>({
    active: false, progress: 0, duration: 2.4,
    startPos: INITIAL_POS.clone(), endPos: INITIAL_POS.clone(),
    startFov: INITIAL_FOV, endFov: INITIAL_FOV,
    onComplete: null,
  });
  const prevMode = useRef<Mode>("idle");

  // 모드 변경 시 애니메이션 트리거
  if (mode !== prevMode.current) {
    prevMode.current = mode;
    const cam = camera as THREE.PerspectiveCamera;

    if (mode === "diving-macbook" && macbookScreenRef.current) {
      const target = new THREE.Vector3();
      macbookScreenRef.current.getWorldPosition(target);
      target.z += 0.3;
      target.y += 0.04;
      anim.current = {
        active: true, progress: 0, duration: 2.4,
        startPos: camera.position.clone(), endPos: target,
        startFov: cam.fov, endFov: 7,
        onComplete: () => onModeChange("macos"),
      };
    }

    if (mode === "diving-ipod" && ipodScreenRef.current) {
      const target = new THREE.Vector3();
      ipodScreenRef.current.getWorldPosition(target);
      target.z += 0.25;
      target.y += 0.02;
      anim.current = {
        active: true, progress: 0, duration: 2.0,
        startPos: camera.position.clone(), endPos: target,
        startFov: cam.fov, endFov: 9,
        onComplete: () => onModeChange("music"),
      };
    }

    if (mode === "returning") {
      anim.current = {
        active: true, progress: 0, duration: 1.6,
        startPos: camera.position.clone(), endPos: INITIAL_POS.clone(),
        startFov: (camera as THREE.PerspectiveCamera).fov, endFov: INITIAL_FOV,
        onComplete: () => onModeChange("idle"),
      };
    }
  }

  useFrame((_, delta) => {
    const a = anim.current;

    // 아이들 상태: 카메라가 중심을 바라보도록 유지
    if (!a.active && mode === "idle") {
      camera.lookAt(0, 0.1, 0);
      return;
    }
    if (!a.active) return;

    a.progress = Math.min(1, a.progress + delta / a.duration);
    const t = a.progress;

    // dive: quartic ease-in (급가속)
    // return: cubic ease-out (부드럽게 감속)
    const isDiving = mode === "diving-macbook" || mode === "diving-ipod";
    const ease     = isDiving ? t * t * t * t : 1 - Math.pow(1 - t, 3);

    camera.position.lerpVectors(a.startPos, a.endPos, ease);
    const cam = camera as THREE.PerspectiveCamera;
    cam.fov   = THREE.MathUtils.lerp(a.startFov, a.endFov, ease);
    cam.updateProjectionMatrix();

    if (isDiving) camera.lookAt(a.endPos.x, a.endPos.y, 0);

    if (a.progress >= 1) {
      a.active = false;
      a.onComplete?.();
    }
  });

  return null;
}

// ─────────────────────────────────────────
// 씬 컨텐츠
// ─────────────────────────────────────────
function SceneContents({
  mode,
  macbookScreenRef,
  ipodScreenRef,
  onModeChange,
}: {
  mode:             Mode;
  macbookScreenRef: React.MutableRefObject<THREE.Mesh | null>;
  ipodScreenRef:    React.MutableRefObject<THREE.Mesh | null>;
  onModeChange:     (m: Mode) => void;
}) {
  const isDiving  = mode === "diving-macbook" || mode === "diving-ipod";
  const isOverlay = mode === "macos" || mode === "music";

  return (
    <>
      <color attach="background" args={["#F5F5F7"]} />

      {/* 조명 */}
      <ambientLight intensity={0.9} />
      <directionalLight position={[-4, 8, 5]}  intensity={1.5} castShadow />
      <directionalLight position={[5, 3, -4]}  intensity={0.4} color="#d8eaff" />
      <directionalLight position={[0, -3, 4]}  intensity={0.2} color="#fff6ee" />

      {/* Environment Map — 반사 품질 향상 */}
      <Suspense fallback={null}>
        <Environment preset="studio" background={false} />
      </Suspense>

      {/* 오브젝트 (오버레이 중에는 숨김) */}
      {!isOverlay && (
        <>
          <MacBookModel
            screenRef={macbookScreenRef}
            onClick={() => { if (mode === "idle") onModeChange("diving-macbook"); }}
            zooming={isDiving}
          />
          <IPodModel
            screenRef={ipodScreenRef}
            onClick={() => { if (mode === "idle") onModeChange("diving-ipod"); }}
            zooming={isDiving}
          />
        </>
      )}

      <CameraController
        mode={mode}
        macbookScreenRef={macbookScreenRef}
        ipodScreenRef={ipodScreenRef}
        onModeChange={onModeChange}
      />
    </>
  );
}

// ─────────────────────────────────────────
// 최상위
// ─────────────────────────────────────────
export default function ThreeScene() {
  const macbookScreenRef = useRef<THREE.Mesh | null>(null);
  const ipodScreenRef    = useRef<THREE.Mesh | null>(null);
  const [mode, setMode]  = useState<Mode>("idle");

  const handleModeChange = useCallback((m: Mode) => setMode(m), []);
  const handleBack       = useCallback(() => setMode("returning"), []);

  const isDiving  = mode === "diving-macbook" || mode === "diving-ipod";
  const showMacOS = mode === "macos";
  const showMusic = mode === "music";

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {/* 3D 캔버스 */}
      <Canvas
        camera={{ position: [0, 0.8, 5.5], fov: INITIAL_FOV }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
        shadows
      >
        <SceneContents
          mode={mode}
          macbookScreenRef={macbookScreenRef}
          ipodScreenRef={ipodScreenRef}
          onModeChange={handleModeChange}
        />
      </Canvas>

      {/* 다이브 시 화이트 플래시 */}
      <AnimatePresence>
        {isDiving && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0, 0.5, 1] }}
            transition={{ duration: 2.4, times: [0, 0.42, 0.75, 1] }}
            style={{ background: "#fff" }}
          />
        )}
      </AnimatePresence>

      {/* macOS 데스크탑 */}
      <AnimatePresence>
        {showMacOS && (
          <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <MacOSDesktop visible />
            <motion.button
              className="absolute top-9 left-8"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              onClick={handleBack}
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: 12,
                letterSpacing: "0.06em",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "Pretendard, sans-serif",
                zIndex: 200,
              }}
            >
              ← Back
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 뮤직 플레이어 */}
      <AnimatePresence>
        {showMusic && (
          <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <MusicPlayer onBack={handleBack} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 힌트 */}
      <AnimatePresence>
        {mode === "idle" && (
          <motion.p
            className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-none text-center"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.2, duration: 0.7 }}
            style={{
              color: "rgba(0,0,0,0.22)",
              fontSize: 11,
              letterSpacing: "0.26em",
              textTransform: "uppercase",
              fontFamily: "Pretendard, sans-serif",
              lineHeight: 2,
            }}
          >
            Drag to rotate · Click to enter
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
