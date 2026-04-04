"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import MacOSDesktop from "./MacOSDesktop";

interface MacBookProps {
  openProgress: MotionValue<number>;
}

export default function MacBook({ openProgress }: MacBookProps) {
  // 뚜껑: 0(완전 닫힘) → -108deg(완전 열림)
  const lidRotateX    = useTransform(openProgress, [0, 1], [0, -108]);
  const screenOpacity = useTransform(openProgress, [0.2, 0.65], [0, 1]);
  const lidShadow     = useTransform(
    openProgress,
    [0, 0.5, 1],
    [
      "0px 0px 0px rgba(0,0,0,0)",
      "0px 24px 48px rgba(0,0,0,0.55)",
      "0px 32px 64px rgba(0,0,0,0.4)",
    ]
  );

  const W = 560; // 맥북 너비
  const H = 352; // 뚜껑 높이
  const BASE_H = 16; // 바텀 케이스 높이

  return (
    // 이 컨테이너 자체에 perspective + 약간의 rotateX를 줘서
    // '위에서 살짝 내려다보는' 카메라 느낌 추가
    <div
      style={{
        position: "relative",
        width: W,
        transformStyle: "preserve-3d",
      }}
    >
      {/* ── 뚜껑 ── */}
      <motion.div
        style={{
          rotateX: lidRotateX,
          transformOrigin: "bottom center",
          transformStyle: "preserve-3d",
          position: "relative",
          zIndex: 2,
          boxShadow: lidShadow,
        }}
      >
        {/* 뚜껑 앞면 (안쪽 — 화면이 있는 면) */}
        <div
          style={{
            width: W,
            height: H,
            borderRadius: "13px 13px 0 0",
            background:
              "linear-gradient(170deg, #1c1c1e 0%, #141414 55%, #0d0d0d 100%)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* 금속 미세 광택 */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.045) 0%, transparent 38%)",
              pointerEvents: "none",
            }}
          />

          {/* 화면 베젤 */}
          <div
            style={{
              position: "absolute",
              top: 13,
              left: 15,
              right: 15,
              bottom: 0,
              borderRadius: "7px 7px 0 0",
              background: "#000",
              overflow: "hidden",
            }}
          >
            {/* macOS 화면 */}
            <motion.div className="absolute inset-0" style={{ opacity: screenOpacity }}>
              <MacOSDesktop visible />
            </motion.div>

            {/* 꺼진 화면 (닫힌 상태) */}
            <motion.div
              className="absolute inset-0"
              style={{ opacity: useTransform(openProgress, [0, 0.2], [1, 0]) }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "#050505",
                }}
              >
                {/* 미세 반사 */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.015) 0%, transparent 55%)",
                  }}
                />
              </div>
            </motion.div>
          </div>

          {/* 카메라 */}
          <div
            style={{
              position: "absolute",
              top: 5,
              left: "50%",
              transform: "translateX(-50%)",
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#151515",
              boxShadow: "0 0 0 1.5px rgba(255,255,255,0.05)",
            }}
          />
        </div>

        {/* 뚜껑 뒷면 (3D backface) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "13px 13px 0 0",
            background:
              "linear-gradient(170deg, #1f1f21 0%, #161616 60%, #0e0e0e 100%)",
            transform: "rotateX(180deg)",
            backfaceVisibility: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* 애플 로고 (뒷면) */}
          <span style={{ fontSize: 52, opacity: 0.12, color: "#fff" }}></span>
        </div>

        {/* 뚜껑 하단 힌지 엣지 */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            background:
              "linear-gradient(90deg, #0a0a0a 0%, #222 50%, #0a0a0a 100%)",
            transform: "rotateX(90deg)",
            transformOrigin: "bottom center",
          }}
        />
      </motion.div>

      {/* ── 바텀 케이스 (키보드/트랙패드) ── */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: W,
          transformStyle: "preserve-3d",
        }}
      >
        {/* 윗면 (키보드 면) */}
        <div
          style={{
            width: W,
            height: BASE_H,
            borderRadius: "0 0 9px 9px",
            background:
              "linear-gradient(180deg, #161616 0%, #0f0f0f 70%, #090909 100%)",
            position: "relative",
            boxShadow:
              "0 12px 56px rgba(0,0,0,0.75), 0 4px 12px rgba(0,0,0,0.5)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 1,
              background:
                "linear-gradient(90deg, transparent 3%, rgba(255,255,255,0.07) 50%, transparent 97%)",
            }}
          />
          {/* 트랙패드 */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 140,
              height: 9,
              borderRadius: 3,
              background: "rgba(255,255,255,0.035)",
              border: "1px solid rgba(255,255,255,0.055)",
            }}
          />
        </div>

        {/* 앞면 두께 (3D 엣지 — 뷰어를 향한 면) */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: BASE_H,
            background:
              "linear-gradient(180deg, #202020 0%, #141414 100%)",
            transform: "rotateX(-90deg)",
            transformOrigin: "bottom center",
            transformStyle: "preserve-3d",
          }}
        />

        {/* 바닥면 반사 */}
        <div
          style={{
            position: "absolute",
            bottom: -BASE_H - 2,
            left: 24,
            right: 24,
            height: BASE_H + 4,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 100%)",
            filter: "blur(4px)",
            borderRadius: "0 0 6px 6px",
          }}
        />
      </div>

      {/* 전체 바닥 그림자 */}
      <div
        style={{
          position: "absolute",
          bottom: -(BASE_H + 12),
          left: "10%",
          right: "10%",
          height: 28,
          background: "rgba(0,0,0,0.6)",
          filter: "blur(20px)",
          borderRadius: "50%",
        }}
      />
    </div>
  );
}
