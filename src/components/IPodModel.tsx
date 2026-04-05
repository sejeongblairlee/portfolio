"use client";

/**
 * IPodModel — 개별 드래그 회전 + 부유 애니메이션
 * GLB 교체: MODEL_URL = "/models/ipod.glb"
 */

import { useRef, RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

const MODEL_URL: string | null = null;

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

function ProceduralIPod({ screenRef }: { screenRef: RefObject<THREE.Mesh | null> }) {
  return (
    <>
      <RoundedBox args={[0.58, 1.14, 0.078]} radius={0.062} smoothness={6}>
        <primitive object={silverMat} attach="material" />
      </RoundedBox>
      <mesh position={[0, 0.28, 0.04]}>
        <boxGeometry args={[0.42, 0.48, 0.004]} />
        <meshPhysicalMaterial color="#C8C8CC" metalness={0.5} roughness={0.15} />
      </mesh>
      {/* 화면 — zoom 타겟 */}
      <mesh ref={screenRef} position={[0, 0.28, 0.043]}>
        <boxGeometry args={[0.38, 0.44, 0.003]} />
        <primitive object={screenMatIPod} attach="material" />
      </mesh>
      <mesh position={[0, -0.24, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.165, 0.055, 16, 48]} />
        <primitive object={wheelMat} attach="material" />
      </mesh>
      <mesh position={[0, -0.24, 0.034]}>
        <circleGeometry args={[0.11, 40]} />
        <primitive object={wheelMat} attach="material" />
      </mesh>
      <mesh position={[0, -0.24, 0.044]}>
        <circleGeometry args={[0.072, 32]} />
        <meshPhysicalMaterial color="#D8D8DC" metalness={0.6} roughness={0.12} clearcoat={0.5} />
      </mesh>
      <mesh position={[0, -0.596, 0]}>
        <boxGeometry args={[0.12, 0.018, 0.04]} />
        <meshPhysicalMaterial color="#B0B0B4" metalness={0.8} roughness={0.15} />
      </mesh>
    </>
  );
}

interface Props {
  screenRef: RefObject<THREE.Mesh | null>;
  onClick: () => void;
  zooming: boolean;
}

export default function IPodModel({ screenRef, onClick, zooming }: Props) {
  const { gl } = useThree();
  const groupRef = useRef<THREE.Group>(null!);

  const drag = useRef({
    active:  false,
    lastX:   0,
    lastY:   0,
    startX:  0,
    startY:  0,
    startMs: 0,
    velX:    0,
    velY:    0,
  });

  const rotY     = useRef(0);
  const rotX     = useRef(0);
  const floatAmp = useRef(1);

  useFrame((state, delta) => {
    if (!groupRef.current || zooming) return;
    const t = state.clock.elapsedTime + 1.4; // MacBook과 위상 차이
    const d = drag.current;

    if (!d.active) {
      const decay = Math.pow(0.88, delta * 60);
      d.velX *= decay;
      d.velY *= decay;
      rotY.current += d.velX;
      rotX.current += d.velY;

      if (Math.abs(d.velY) < 0.002) {
        rotX.current = THREE.MathUtils.lerp(rotX.current, 0, delta * 1.8);
      }

      floatAmp.current = THREE.MathUtils.lerp(floatAmp.current, 1, delta * 2.5);
      const fa = floatAmp.current;

      groupRef.current.position.y = Math.sin(t * 0.48) * 0.11 * fa;
      groupRef.current.rotation.z = Math.sin(t * 0.31) * 0.018 * fa;
      groupRef.current.rotation.y = rotY.current + Math.sin(t * 0.22) * 0.07 * fa;
      groupRef.current.rotation.x = rotX.current;
    } else {
      floatAmp.current = THREE.MathUtils.lerp(floatAmp.current, 0, delta * 8);
      groupRef.current.rotation.y = rotY.current;
      groupRef.current.rotation.x = rotX.current;
    }
  });

  return (
    <group
      ref={groupRef}
      position={[-1.9, 0, 0.3]}
      onPointerDown={(e) => {
        e.stopPropagation();
        gl.domElement.setPointerCapture(e.pointerId);
        document.body.style.cursor = "grabbing";
        drag.current = {
          active:  true,
          lastX:   e.clientX,
          lastY:   e.clientY,
          startX:  e.clientX,
          startY:  e.clientY,
          startMs: Date.now(),
          velX:    0,
          velY:    0,
        };
      }}
      onPointerMove={(e) => {
        if (!drag.current.active) return;
        const dx = e.clientX - drag.current.lastX;
        const dy = e.clientY - drag.current.lastY;

        drag.current.velX = dx * 0.009;
        drag.current.velY = dy * 0.005;
        rotY.current += drag.current.velX;
        rotX.current += drag.current.velY;
        rotX.current = THREE.MathUtils.clamp(rotX.current, -0.7, 0.7);

        drag.current.lastX = e.clientX;
        drag.current.lastY = e.clientY;
      }}
      onPointerUp={(e) => {
        gl.domElement.releasePointerCapture(e.pointerId);
        drag.current.active = false;
        document.body.style.cursor = "pointer";

        const dx   = e.clientX - drag.current.startX;
        const dy   = e.clientY - drag.current.startY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const ms   = Date.now() - drag.current.startMs;
        if (dist < 6 && ms < 300) onClick();
      }}
      onPointerOver={() => { if (!zooming && !drag.current.active) document.body.style.cursor = "grab"; }}
      onPointerOut={() => { if (!drag.current.active) document.body.style.cursor = "default"; }}
    >
      {MODEL_URL ? null : <ProceduralIPod screenRef={screenRef} />}

      {/* 바닥 그림자 */}
      <mesh position={[0, -0.72, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.28, 0.18, 1]}>
        <circleGeometry args={[1, 32]} />
        <meshBasicMaterial color="#000" transparent opacity={0.1} />
      </mesh>
    </group>
  );
}
