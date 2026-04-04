"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import MacOSDesktop from "./MacOSDesktop";

interface MacBookProps {
  openProgress: MotionValue<number>;
}

export default function MacBook({ openProgress }: MacBookProps) {
  const lidRotateX = useTransform(openProgress, [0, 1], [0, -112]);
  const screenOpacity = useTransform(openProgress, [0.25, 0.7], [0, 1]);
  const screenGlow = useTransform(openProgress, [0.4, 0.9], [0, 1]);

  return (
    <div
      className="relative flex flex-col items-center"
      style={{ perspective: "1400px", perspectiveOrigin: "50% 80%" }}
    >
      {/* ── 뚜껑 ── */}
      <motion.div
        style={{
          rotateX: lidRotateX,
          transformOrigin: "bottom center",
          transformStyle: "preserve-3d",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* 뚜껑 외부 (Space Black) */}
        <div
          style={{
            width: 580,
            height: 365,
            borderRadius: "14px 14px 0 0",
            background: "linear-gradient(175deg, #1c1c1e 0%, #141414 60%, #0a0a0a 100%)",
            boxShadow:
              "0 -1px 0 rgba(255,255,255,0.07), inset 0 1px 0 rgba(255,255,255,0.05), 0 -4px 20px rgba(0,0,0,0.4)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* 금속 광택 */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 40%)",
              pointerEvents: "none",
            }}
          />

          {/* 화면 베젤 */}
          <div
            style={{
              position: "absolute",
              top: 14,
              left: 16,
              right: 16,
              bottom: 0,
              borderRadius: "8px 8px 0 0",
              background: "#000",
              overflow: "hidden",
            }}
          >
            {/* macOS 화면 */}
            <motion.div
              className="absolute inset-0"
              style={{ opacity: screenOpacity }}
            >
              <MacOSDesktop visible />
            </motion.div>

            {/* 화면 꺼진 상태 */}
            <motion.div
              className="absolute inset-0"
              style={{
                opacity: useTransform(openProgress, [0, 0.25], [1, 0]),
                background: "#050505",
              }}
            >
              {/* 미세한 반사 */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 60%)",
                }}
              />
            </motion.div>

            {/* 화면 글로우 */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                opacity: screenGlow,
                boxShadow: "inset 0 0 60px rgba(255,255,255,0.03)",
              }}
            />
          </div>

          {/* 카메라 */}
          <div
            style={{
              position: "absolute",
              top: 6,
              left: "50%",
              transform: "translateX(-50%)",
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#1a1a1a",
              boxShadow: "0 0 0 1px rgba(255,255,255,0.06)",
            }}
          />
        </div>
      </motion.div>

      {/* ── 바텀 케이스 ── */}
      <div
        style={{
          width: 580,
          height: 14,
          borderRadius: "0 0 10px 10px",
          background: "linear-gradient(180deg, #111111 0%, #0a0a0a 100%)",
          boxShadow:
            "0 8px 48px rgba(0,0,0,0.7), 0 2px 6px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* 트랙패드 힌트 */}
        <div
          style={{
            position: "absolute",
            top: 3,
            left: "50%",
            transform: "translateX(-50%)",
            width: 130,
            height: 7,
            borderRadius: 4,
            background: "rgba(255,255,255,0.04)",
          }}
        />
      </div>

      {/* 테이블 반사 */}
      <div
        style={{
          position: "absolute",
          bottom: -8,
          left: 30,
          right: 30,
          height: 12,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)",
          filter: "blur(6px)",
        }}
      />
    </div>
  );
}
