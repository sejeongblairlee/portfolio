"use client";

import { useRef, RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

interface Props {
  screenRef: RefObject<THREE.Mesh | null>;
  onClick: () => void;
  zooming: boolean;
}

const SPACE_BLACK = {
  color: "#1C1C1E",
  metalness: 0.88,
  roughness: 0.14,
};

export default function MacBookModel({ screenRef, onClick, zooming }: Props) {
  const groupRef = useRef<THREE.Group>(null!);
  const [hovered, setHovered] = [useRef(false), null];

  useFrame((state) => {
    if (zooming || !groupRef.current) return;
    const t = state.clock.elapsedTime;
    // 부드러운 부유 + 미세한 회전
    groupRef.current.position.y = Math.sin(t * 0.55) * 0.13;
    groupRef.current.rotation.y = Math.sin(t * 0.27) * 0.055;
    groupRef.current.rotation.z = Math.sin(t * 0.38) * 0.014;
  });

  return (
    <group
      ref={groupRef}
      position={[0.7, 0.1, 0]}
      onClick={onClick}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "default")}
    >
      {/* ── 바텀 케이스 ── */}
      <RoundedBox args={[3.2, 0.14, 2.15]} radius={0.045} smoothness={4}>
        <meshStandardMaterial {...SPACE_BLACK} />
      </RoundedBox>

      {/* ── 뚜껑 그룹 (힌지 피벗: 베이스 뒤쪽 모서리 상단) ──
          rotation.x = -1.9 rad ≈ -109°  → 화면이 뷰어 방향을 향함 */}
      <group position={[0, 0.07, -1.075]} rotation={[-1.9, 0, 0]}>
        {/* 뚜껑 바디 */}
        <RoundedBox
          args={[3.2, 2.1, 0.1]}
          position={[0, 1.05, 0]}
          radius={0.045}
          smoothness={4}
        >
          <meshStandardMaterial {...SPACE_BLACK} />
        </RoundedBox>

        {/* 베젤 (화면 테두리) */}
        <mesh position={[0, 1.05, 0.051]}>
          <boxGeometry args={[2.92, 1.88, 0.005]} />
          <meshStandardMaterial color="#0A0A0A" roughness={0.1} metalness={0.2} />
        </mesh>

        {/* 화면 — zoom 타겟 */}
        <mesh ref={screenRef} position={[0, 1.05, 0.058]}>
          <planeGeometry args={[2.62, 1.64]} />
          <meshStandardMaterial
            color="#050810"
            roughness={0.04}
            emissive={new THREE.Color("#0D1F3C")}
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* 카메라 */}
        <mesh position={[0, 2.06, 0.056]}>
          <cylinderGeometry args={[0.018, 0.018, 0.008, 16]} />
          <meshStandardMaterial color="#111" metalness={0.4} roughness={0.6} />
        </mesh>

        {/* 애플 로고 (뒷면) */}
        <mesh position={[0, 1.05, -0.052]}>
          <planeGeometry args={[0.42, 0.5]} />
          <meshStandardMaterial
            color="#2A2A2C"
            roughness={0.4}
            metalness={0.6}
          />
        </mesh>
      </group>

      {/* 바닥 그림자 */}
      <mesh position={[0, -0.16, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.4, 0.9, 1]}>
        <circleGeometry args={[1, 32]} />
        <meshBasicMaterial color="#000" transparent opacity={0.18} />
      </mesh>
    </group>
  );
}
