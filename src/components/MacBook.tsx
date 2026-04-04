"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import MacOSDesktop from "./MacOSDesktop";

interface MacBookProps {
  /** scrollYProgress를 받아서 뚜껑 열림 각도 계산 */
  openProgress: MotionValue<number>;
}

export default function MacBook({ openProgress }: MacBookProps) {
  // 0 = 닫힘(0°), 1 = 완전히 열림(-105°)
  const lidRotateX = useTransform(openProgress, [0, 1], [0, -105]);
  const screenOpacity = useTransform(openProgress, [0.3, 0.8], [0, 1]);
  const desktopVisible = useTransform(openProgress, (v) => v > 0.75);

  return (
    <div
      className="relative flex flex-col items-center justify-center w-full h-full"
      style={{ perspective: "1200px" }}
    >
      <div className="relative" style={{ width: 560, transformStyle: "preserve-3d" }}>

        {/* ── 뚜껑 (디스플레이 파트) ── */}
        <motion.div
          style={{
            rotateX: lidRotateX,
            transformOrigin: "bottom center",
            transformStyle: "preserve-3d",
          }}
          className="relative"
        >
          {/* 뚜껑 외부 (Space Gray) */}
          <div
            className="relative rounded-t-2xl overflow-hidden"
            style={{
              width: 560,
              height: 350,
              background: "linear-gradient(180deg, #3a3a3c 0%, #2c2c2e 100%)",
              boxShadow: "0 -2px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            {/* 화면 베젤 */}
            <div
              className="absolute inset-3 rounded-xl overflow-hidden"
              style={{ background: "#000" }}
            >
              {/* 화면 글로우 */}
              <motion.div
                className="absolute inset-0"
                style={{ opacity: screenOpacity }}
              >
                <MacOSDesktop visible={true} />
              </motion.div>

              {/* 화면이 꺼진 상태 (반사광) */}
              <motion.div
                className="absolute inset-0 rounded-xl"
                style={{
                  opacity: useTransform(openProgress, [0, 0.3], [1, 0]),
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 60%)",
                }}
              />
            </div>

            {/* 카메라 노치 */}
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-black/60" />

            {/* 애플 로고 (뚜껑 뒷면 — 3D 뒤집기로 표현) */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              <span className="text-white/20 text-5xl"></span>
            </div>
          </div>
        </motion.div>

        {/* ── 바텀 케이스 (키보드 파트) ── */}
        <div
          className="relative rounded-b-xl"
          style={{
            width: 560,
            height: 20,
            background: "linear-gradient(180deg, #2c2c2e 0%, #1c1c1e 100%)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.4)",
          }}
        >
          {/* 트랙패드 */}
          <div
            className="absolute top-2 left-1/2 -translate-x-1/2 rounded-md"
            style={{
              width: 120,
              height: 10,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          />
        </div>

        {/* 테이블 반사 */}
        <div
          className="absolute -bottom-3 left-4 right-4 rounded-b-xl blur-md opacity-30"
          style={{
            height: 10,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
          }}
        />
      </div>
    </div>
  );
}
