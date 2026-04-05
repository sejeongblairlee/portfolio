"use client";

/**
 * MacBookModel
 * ─────────────────────────────────────────
 * GLB 교체 방법:
 *   1. public/models/macbook.glb 배치
 *   2. MODEL_URL = "/models/macbook.glb" 로 변경
 *   3. ProceduralMacBook 대신 GLBMacBook 컴포넌트가 렌더됨
 */

import { useRef, RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, useGLTF } from "@react-three/drei";
import * as THREE from "three";

// ── GLB URL 설정 (null = 프로시저럴 지오메트리 사용) ──
const MODEL_URL: string | null = null; // → "/models/macbook.glb"

// ── 재질 ──
const metalBlack = new THREE.MeshPhysicalMaterial({
  color: "#1C1C1E",
  metalness: 0.92,
  roughness: 0.08,
  reflectivity: 1,
  clearcoat: 0.6,
  clearcoatRoughness: 0.08,
});

const screenMat = new THREE.MeshPhysicalMaterial({
  color: "#040810",
  emissive: new THREE.Color("#0D2A5C"),
  emissiveIntensity: 0.55,
  roughness: 0.02,
  metalness: 0.0,
  reflectivity: 0.9,
});

const bezelMat = new THREE.MeshPhysicalMaterial({
  color: "#0A0A0A",
  metalness: 0.3,
  roughness: 0.08,
});

// ── 프로시저럴 맥북 ──
function ProceduralMacBook({
  screenRef,
}: {
  screenRef: RefObject<THREE.Mesh | null>;
}) {
  return (
    <>
      {/* 베이스 */}
      <RoundedBox args={[3.2, 0.14, 2.15]} radius={0.045} smoothness={5}>
        <primitive object={metalBlack} attach="material" />
      </RoundedBox>

      {/* 뚜껑 그룹 (힌지 pivot = 베이스 상단 뒤쪽) */}
      <group position={[0, 0.07, -1.075]} rotation={[-1.9, 0, 0]}>
        {/* 뚜껑 바디 */}
        <RoundedBox args={[3.2, 2.1, 0.1]} position={[0, 1.05, 0]} radius={0.045} smoothness={5}>
          <primitive object={metalBlack} attach="material" />
        </RoundedBox>

        {/* 베젤 */}
        <mesh position={[0, 1.05, 0.052]}>
          <boxGeometry args={[2.92, 1.88, 0.005]} />
          <primitive object={bezelMat} attach="material" />
        </mesh>

        {/* 화면 — 줌 타겟 */}
        <mesh ref={screenRef} position={[0, 1.05, 0.059]}>
          <planeGeometry args={[2.62, 1.64]} />
          <primitive object={screenMat} attach="material" />
        </mesh>

        {/* 카메라 */}
        <mesh position={[0, 2.06, 0.056]}>
          <cylinderGeometry args={[0.018, 0.018, 0.008, 16]} />
          <meshStandardMaterial color="#111" metalness={0.4} roughness={0.6} />
        </mesh>
      </group>
    </>
  );
}

// ── GLB 맥북 (MODEL_URL 설정 시 사용) ──
function GLBMacBook({
  url,
  screenRef,
}: {
  url: string;
  screenRef: RefObject<THREE.Mesh | null>;
}) {
  const { scene } = useGLTF(url);
  // GLB 로드 후 화면 mesh를 screenRef에 연결하려면
  // scene.getObjectByName("Screen") 같은 방식으로 연결 필요
  return (
    <>
      <primitive object={scene} />
      {/* 투명 hit-target (GLB의 screen 위치에 맞게 조정) */}
      <mesh ref={screenRef} position={[0, 1.0, 0]} visible={false}>
        <planeGeometry args={[2.62, 1.64]} />
        <meshBasicMaterial />
      </mesh>
    </>
  );
}

// ── 메인 ──
interface Props {
  screenRef: RefObject<THREE.Mesh | null>;
  onClick: () => void;
  isInteracting: boolean;
  zooming: boolean;
}

export default function MacBookModel({
  screenRef,
  onClick,
  isInteracting,
  zooming,
}: Props) {
  const groupRef  = useRef<THREE.Group>(null!);
  const ampRef    = useRef(1);
  const pointerDownPos = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // 인터랙션 중에는 부유 진폭 0으로 수렴
    const target = isInteracting || zooming ? 0 : 1;
    ampRef.current = THREE.MathUtils.lerp(ampRef.current, target, delta * 3);

    const t   = state.clock.elapsedTime;
    const amp = ampRef.current;
    groupRef.current.position.y   = Math.sin(t * 0.55) * 0.13 * amp;
    groupRef.current.rotation.y   = Math.sin(t * 0.27) * 0.055 * amp;
    groupRef.current.rotation.z   = Math.sin(t * 0.38) * 0.014 * amp;
  });

  return (
    <group
      ref={groupRef}
      position={[0.7, 0.1, 0]}
      onPointerDown={(e) => {
        pointerDownPos.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerUp={(e) => {
        const dx   = e.clientX - pointerDownPos.current.x;
        const dy   = e.clientY - pointerDownPos.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 6) onClick(); // drag가 아닌 실제 클릭
      }}
      onPointerOver={() => { if (!zooming) document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { document.body.style.cursor = "default"; }}
    >
      {MODEL_URL ? (
        <GLBMacBook url={MODEL_URL} screenRef={screenRef} />
      ) : (
        <ProceduralMacBook screenRef={screenRef} />
      )}

      {/* 바닥 그림자 */}
      <mesh position={[0, -0.16, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.4, 0.9, 1]}>
        <circleGeometry args={[1, 32]} />
        <meshBasicMaterial color="#000" transparent opacity={0.12} />
      </mesh>
    </group>
  );
}
