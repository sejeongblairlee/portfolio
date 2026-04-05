"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

const SILVER = {
  color: "#E0E0E4",
  metalness: 0.72,
  roughness: 0.18,
};

export default function IPodModel() {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (!groupRef.current) return;
    // MacBook과 다른 위상(phase)으로 자연스러운 비동기 부유
    const t = state.clock.elapsedTime + 1.4;
    groupRef.current.position.y = Math.sin(t * 0.48) * 0.11;
    groupRef.current.rotation.y = Math.sin(t * 0.22) * 0.07;
    groupRef.current.rotation.x = Math.sin(t * 0.33) * 0.02;
  });

  return (
    <group ref={groupRef} position={[-1.9, 0, 0.3]}>
      {/* ── 바디 ── */}
      <RoundedBox args={[0.58, 1.14, 0.075]} radius={0.06} smoothness={6}>
        <meshStandardMaterial {...SILVER} />
      </RoundedBox>

      {/* 화면 */}
      <mesh position={[0, 0.28, 0.039]}>
        <boxGeometry args={[0.38, 0.44, 0.005]} />
        <meshStandardMaterial
          color="#050810"
          roughness={0.04}
          emissive={new THREE.Color("#1A2D50")}
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* 화면 베젤 */}
      <mesh position={[0, 0.28, 0.038]}>
        <boxGeometry args={[0.42, 0.48, 0.004]} />
        <meshStandardMaterial color="#C8C8CC" metalness={0.5} roughness={0.2} />
      </mesh>

      {/* 클릭 휠 — 바깥 링 */}
      <mesh position={[0, -0.24, 0.039]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.012, 48, 1, true]} />
        <meshStandardMaterial
          color="#D0D0D4"
          metalness={0.65}
          roughness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 클릭 휠 — 안쪽 채움 */}
      <mesh position={[0, -0.24, 0.033]}>
        <circleGeometry args={[0.22, 48]} />
        <meshStandardMaterial color="#C8C8CC" metalness={0.55} roughness={0.25} />
      </mesh>

      {/* 가운데 버튼 */}
      <mesh position={[0, -0.24, 0.042]}>
        <circleGeometry args={[0.075, 32]} />
        <meshStandardMaterial color="#D4D4D8" metalness={0.6} roughness={0.18} />
      </mesh>

      {/* 커넥터 (하단) */}
      <mesh position={[0, -0.598, 0.0]}>
        <boxGeometry args={[0.12, 0.018, 0.04]} />
        <meshStandardMaterial color="#B0B0B4" metalness={0.8} roughness={0.15} />
      </mesh>

      {/* 바닥 그림자 */}
      <mesh position={[0, -0.72, 0.0]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.28, 0.18, 1]}>
        <circleGeometry args={[1, 32]} />
        <meshBasicMaterial color="#000" transparent opacity={0.12} />
      </mesh>
    </group>
  );
}
