"use client";

/**
 * IPodModel
 * ─────────────────────────────────────────
 * GLB 교체 방법:
 *   1. public/models/ipod.glb 배치
 *   2. MODEL_URL = "/models/ipod.glb" 로 변경
 */

import { useRef, RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const MODEL_URL: string | null = null; // → "/models/ipod.glb"

const silverMat = new THREE.MeshPhysicalMaterial({
  color: "#E2E2E6",
  metalness: 0.82,
  roughness: 0.12,
  reflectivity: 1,
  clearcoat: 0.4,
  clearcoatRoughness: 0.1,
});

const screenMatIPod = new THREE.MeshPhysicalMaterial({
  color: "#040810",
  emissive: new THREE.Color("#1A3060"),
  emissiveIntensity: 0.6,
  roughness: 0.02,
  metalness: 0,
  reflectivity: 0.85,
});

const wheelMat = new THREE.MeshPhysicalMaterial({
  color: "#D0D0D4",
  metalness: 0.75,
  roughness: 0.14,
  clearcoat: 0.3,
});

function ProceduralIPod({
  screenRef,
}: {
  screenRef: RefObject<THREE.Mesh | null>;
}) {
  return (
    <>
      {/* 바디 */}
      <RoundedBox args={[0.58, 1.14, 0.078]} radius={0.062} smoothness={6}>
        <primitive object={silverMat} attach="material" />
      </RoundedBox>

      {/* 화면 베젤 */}
      <mesh position={[0, 0.28, 0.04]}>
        <boxGeometry args={[0.42, 0.48, 0.004]} />
        <meshPhysicalMaterial color="#C8C8CC" metalness={0.5} roughness={0.15} />
      </mesh>

      {/* 화면 — 줌 타겟 */}
      <mesh ref={screenRef} position={[0, 0.28, 0.043]}>
        <boxGeometry args={[0.38, 0.44, 0.003]} />
        <primitive object={screenMatIPod} attach="material" />
      </mesh>

      {/* 클릭 휠 바깥 링 */}
      <mesh position={[0, -0.24, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.165, 0.055, 16, 48]} />
        <primitive object={wheelMat} attach="material" />
      </mesh>

      {/* 클릭 휠 채움 */}
      <mesh position={[0, -0.24, 0.034]}>
        <circleGeometry args={[0.11, 40]} />
        <primitive object={wheelMat} attach="material" />
      </mesh>

      {/* 가운데 버튼 */}
      <mesh position={[0, -0.24, 0.044]}>
        <circleGeometry args={[0.072, 32]} />
        <meshPhysicalMaterial color="#D8D8DC" metalness={0.6} roughness={0.12} clearcoat={0.5} />
      </mesh>

      {/* 커넥터 */}
      <mesh position={[0, -0.596, 0]}>
        <boxGeometry args={[0.12, 0.018, 0.04]} />
        <meshPhysicalMaterial color="#B0B0B4" metalness={0.8} roughness={0.15} />
      </mesh>
    </>
  );
}

function GLBIPod({
  url,
  screenRef,
}: {
  url: string;
  screenRef: RefObject<THREE.Mesh | null>;
}) {
  const { scene } = useGLTF(url);
  return (
    <>
      <primitive object={scene} />
      <mesh ref={screenRef} position={[0, 0.28, 0.043]} visible={false}>
        <boxGeometry args={[0.38, 0.44, 0.003]} />
        <meshBasicMaterial />
      </mesh>
    </>
  );
}

interface Props {
  screenRef: RefObject<THREE.Mesh | null>;
  onClick: () => void;
  isInteracting: boolean;
  zooming: boolean;
}

export default function IPodModel({
  screenRef,
  onClick,
  isInteracting,
  zooming,
}: Props) {
  const groupRef       = useRef<THREE.Group>(null!);
  const ampRef         = useRef(1);
  const pointerDownPos = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const target = isInteracting || zooming ? 0 : 1;
    ampRef.current = THREE.MathUtils.lerp(ampRef.current, target, delta * 3);

    const t   = state.clock.elapsedTime + 1.4; // MacBook과 위상 차이
    const amp = ampRef.current;
    groupRef.current.position.y = Math.sin(t * 0.48) * 0.11 * amp;
    groupRef.current.rotation.y = Math.sin(t * 0.22) * 0.07 * amp;
    groupRef.current.rotation.x = Math.sin(t * 0.33) * 0.02 * amp;
  });

  return (
    <group
      ref={groupRef}
      position={[-1.9, 0, 0.3]}
      onPointerDown={(e) => {
        pointerDownPos.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerUp={(e) => {
        const dx   = e.clientX - pointerDownPos.current.x;
        const dy   = e.clientY - pointerDownPos.current.y;
        if (Math.sqrt(dx * dx + dy * dy) < 6) onClick();
      }}
      onPointerOver={() => { if (!zooming) document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { document.body.style.cursor = "default"; }}
    >
      {MODEL_URL ? (
        <GLBIPod url={MODEL_URL} screenRef={screenRef} />
      ) : (
        <ProceduralIPod screenRef={screenRef} />
      )}

      {/* 바닥 그림자 */}
      <mesh position={[0, -0.72, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.28, 0.18, 1]}>
        <circleGeometry args={[1, 32]} />
        <meshBasicMaterial color="#000" transparent opacity={0.1} />
      </mesh>
    </group>
  );
}
