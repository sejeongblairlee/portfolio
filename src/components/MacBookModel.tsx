"use client";

/**
 * MacBookModel — 개별 드래그 회전 + 부유 애니메이션
 * GLB 교체: MODEL_URL = "/models/macbook.glb"
 */

import { useRef, RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

const MODEL_URL: string | null = null;

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
  reflectivity: 0.9,
});
const bezelMat = new THREE.MeshPhysicalMaterial({
  color: "#0A0A0A",
  metalness: 0.3,
  roughness: 0.08,
});

function ProceduralMacBook({ screenRef }: { screenRef: RefObject<THREE.Mesh | null> }) {
  return (
    <>
      <RoundedBox args={[3.2, 0.14, 2.15]} radius={0.045} smoothness={5}>
        <primitive object={metalBlack} attach="material" />
      </RoundedBox>
      <group position={[0, 0.07, -1.075]} rotation={[-1.9, 0, 0]}>
        <RoundedBox args={[3.2, 2.1, 0.1]} position={[0, 1.05, 0]} radius={0.045} smoothness={5}>
          <primitive object={metalBlack} attach="material" />
        </RoundedBox>
        <mesh position={[0, 1.05, 0.052]}>
          <boxGeometry args={[2.92, 1.88, 0.005]} />
          <primitive object={bezelMat} attach="material" />
        </mesh>
        {/* 화면 — zoom 타겟 */}
        <mesh ref={screenRef} position={[0, 1.05, 0.059]}>
          <planeGeometry args={[2.62, 1.64]} />
          <primitive object={screenMat} attach="material" />
        </mesh>
        <mesh position={[0, 2.06, 0.056]}>
          <cylinderGeometry args={[0.018, 0.018, 0.008, 16]} />
          <meshStandardMaterial color="#111" metalness={0.4} roughness={0.6} />
        </mesh>
      </group>
    </>
  );
}

interface Props {
  screenRef: RefObject<THREE.Mesh | null>;
  onClick: () => void;
  zooming: boolean;
}

export default function MacBookModel({ screenRef, onClick, zooming }: Props) {
  const { gl } = useThree();
  const groupRef = useRef<THREE.Group>(null!);

  // 드래그 상태
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

  // 누적 회전값 (드래그 + 부유 합산)
  const rotY   = useRef(0);
  const rotX   = useRef(0);
  const floatAmp = useRef(1); // 드래그 시 부유 억제

  useFrame((state, delta) => {
    if (!groupRef.current || zooming) return;
    const t = state.clock.elapsedTime;
    const d = drag.current;

    if (!d.active) {
      // 관성 감쇠 (프레임 독립적)
      const decay = Math.pow(0.88, delta * 60);
      d.velX *= decay;
      d.velY *= decay;
      rotY.current += d.velX;
      rotX.current += d.velY;

      // X 회전 스프링 복귀 (속도가 낮아지면 수직으로 돌아옴)
      if (Math.abs(d.velY) < 0.002) {
        rotX.current = THREE.MathUtils.lerp(rotX.current, 0, delta * 1.8);
      }

      // 부유 진폭 복귀
      floatAmp.current = THREE.MathUtils.lerp(floatAmp.current, 1, delta * 2.5);

      const fa = floatAmp.current;
      groupRef.current.position.y = Math.sin(t * 0.55) * 0.13 * fa;
      groupRef.current.rotation.z = Math.sin(t * 0.38) * 0.014 * fa;
      groupRef.current.rotation.y = rotY.current + Math.sin(t * 0.27) * 0.055 * fa;
      groupRef.current.rotation.x = rotX.current;
    } else {
      // 드래그 중: 부유 억제
      floatAmp.current = THREE.MathUtils.lerp(floatAmp.current, 0, delta * 8);
      groupRef.current.rotation.y = rotY.current;
      groupRef.current.rotation.x = rotX.current;
    }
  });

  return (
    <group
      ref={groupRef}
      position={[0.7, 0.1, 0]}
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
      {MODEL_URL ? null /* GLBMacBook here */ : <ProceduralMacBook screenRef={screenRef} />}

      {/* 바닥 그림자 */}
      <mesh position={[0, -0.16, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.4, 0.9, 1]}>
        <circleGeometry args={[1, 32]} />
        <meshBasicMaterial color="#000" transparent opacity={0.1} />
      </mesh>
    </group>
  );
}
