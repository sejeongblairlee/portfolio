"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import MacBook from "./MacBook";
import IPodNano from "./IPodNano";
import MacOSDesktop from "./MacOSDesktop";

export default function ScrollJourney() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const macbookOpenProgress = useTransform(scrollYProgress, [0.05, 0.72], [0, 1]);

  // 데스크 씬 페이드 아웃
  const deskOpacity = useTransform(scrollYProgress, [0.74, 0.86], [1, 0]);

  // macOS 등장
  const macosOpacity = useTransform(scrollYProgress, [0.76, 0.92], [0, 1]);
  const macosScale   = useTransform(scrollYProgress, [0.76, 0.96], [1.05, 1]);

  // 스크롤 힌트 사라짐
  const hintOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  return (
    <div ref={containerRef} className="relative h-[400vh]">
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* ══════════════════════════════════════════
            데스크 씬 (3D 공간감)
        ══════════════════════════════════════════ */}
        <motion.div className="absolute inset-0" style={{ opacity: deskOpacity }}>

          {/* 흰 벽 배경 */}
          <div
            className="absolute inset-0"
            style={{ background: "#f8f8f6" }}
          />

          {/* 벽/책상 경계 몰딩 라인 */}
          <div
            className="absolute left-0 right-0"
            style={{
              top: "48%",
              height: 3,
              background:
                "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.06) 20%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.06) 80%, transparent 100%)",
              zIndex: 2,
            }}
          />

          {/* ── 3D 원근 컨테이너 ──
              perspectiveOrigin을 위쪽에 두어 '위에서 내려다보는' 카메라 시점 연출 */}
          <div
            className="absolute inset-0"
            style={{
              perspective: "900px",
              perspectiveOrigin: "50% -15%",
            }}
          >
            {/* 책상 면: rotateX로 뒤로 기울여서 수평면처럼 보이게 */}
            <div
              className="absolute left-0 right-0 bottom-0"
              style={{
                top: "46%",
                transformStyle: "preserve-3d",
                transform: "rotateX(26deg)",
                transformOrigin: "top center",
              }}
            >
              {/* 책상 표면 색상 */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, #1a1a1a 0%, #101010 40%, #080808 100%)",
                }}
              />

              {/* 책상 앞면 두께 (edge) */}
              <div
                className="absolute left-0 right-0"
                style={{
                  top: 0,
                  height: 18,
                  background:
                    "linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%)",
                  transform: "rotateX(-90deg)",
                  transformOrigin: "top center",
                }}
              />

              {/* 책상 표면 하이라이트 (앞쪽 엣지에 빛) */}
              <div
                className="absolute left-0 right-0"
                style={{
                  top: 0,
                  height: 1,
                  background:
                    "linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.18) 50%, transparent 95%)",
                }}
              />

              {/* 책상 위 반사광 */}
              <div
                className="absolute"
                style={{
                  top: "2%",
                  left: "20%",
                  right: "20%",
                  height: "35%",
                  background:
                    "radial-gradient(ellipse, rgba(255,255,255,0.04) 0%, transparent 70%)",
                  filter: "blur(12px)",
                }}
              />

              {/* ── 오브젝트들 (책상 평면 위, translateZ로 살짝 띄움) ── */}
              <div
                className="absolute inset-0 flex items-start justify-center"
                style={{
                  paddingTop: "6%",
                  gap: 72,
                  alignItems: "flex-start",
                  // preserve-3d 유지해야 자식들의 translateZ가 작동
                  transformStyle: "preserve-3d",
                }}
              >
                {/* iPod — 책상 면보다 살짝 앞(z+)에 위치 */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.35 }}
                  style={{
                    transform: "translateZ(4px)",
                    alignSelf: "flex-start",
                    marginTop: 18,
                    // 책상 면이 rotateX(26deg)로 기울었으니
                    // 오브젝트는 반대로 세워줘야 화면 기준 수직으로 보임
                    // (책상 평면 좌표계에서 '서있는' 물체 = rotateX(-26deg) 보정은 하지 않음:
                    //  iPod은 책상에 누운 상태로 자연스러운 perspective 효과를 그대로 활용)
                  }}
                >
                  <IPodNano />
                </motion.div>

                {/* 맥북 — iPod보다 높은 z 값 */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.1 }}
                  style={{
                    transform: "translateZ(8px)",
                  }}
                >
                  <MacBook openProgress={macbookOpenProgress} />
                </motion.div>

                {/* 오른쪽 균형용 여백 */}
                <div style={{ width: 148, flexShrink: 0 }} />
              </div>

              {/* 맥북 그림자 (책상 표면에 투영) */}
              <div
                className="absolute"
                style={{
                  top: "5%",
                  left: "40%",
                  width: 340,
                  height: 120,
                  background:
                    "radial-gradient(ellipse, rgba(0,0,0,0.55) 0%, transparent 70%)",
                  filter: "blur(22px)",
                  transform: "translateZ(-2px)",
                }}
              />

              {/* iPod 그림자 */}
              <div
                className="absolute"
                style={{
                  top: "8%",
                  left: "24%",
                  width: 120,
                  height: 60,
                  background:
                    "radial-gradient(ellipse, rgba(0,0,0,0.4) 0%, transparent 70%)",
                  filter: "blur(14px)",
                  transform: "translateZ(-2px)",
                }}
              />
            </div>
          </div>

          {/* ── 스크롤 힌트 ── */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center pointer-events-none"
            style={{ opacity: hintOpacity }}
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <p
              style={{
                color: "rgba(0,0,0,0.3)",
                fontSize: 10,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              Scroll to open
            </p>
            <div
              style={{
                marginTop: 8,
                marginInline: "auto",
                width: 1,
                height: 28,
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, transparent 100%)",
              }}
            />
          </motion.div>
        </motion.div>

        {/* ══════════════════════════════════════════
            macOS Sequoia 전체 화면
        ══════════════════════════════════════════ */}
        <motion.div
          className="absolute inset-0"
          style={{ opacity: macosOpacity, scale: macosScale }}
        >
          <MacOSDesktop visible />
        </motion.div>

        {/* 개발용 스크롤 바 */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-black/10 z-[100]"
          style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
        />
      </div>
    </div>
  );
}
