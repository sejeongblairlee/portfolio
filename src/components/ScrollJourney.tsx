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

  // 맥북 열림 진행률 (스크롤 0 → 70%)
  const macbookOpenProgress = useTransform(scrollYProgress, [0.05, 0.7], [0, 1]);

  // 데스크 씬: 스크롤 80% 이후 서서히 사라짐
  const deskOpacity = useTransform(scrollYProgress, [0.72, 0.85], [1, 0]);

  // macOS 전체 화면: 스크롤 75% 이후 등장
  const macosOpacity = useTransform(scrollYProgress, [0.75, 0.9], [0, 1]);
  const macosScale   = useTransform(scrollYProgress, [0.75, 0.95], [1.06, 1]);
  const macosVisible = useTransform(scrollYProgress, (v) => v > 0.74);

  return (
    <div ref={containerRef} className="relative h-[400vh]">
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* ══════════════════════════════
            기본 화면 — 흰 배경 + 검은 책상
        ══════════════════════════════ */}
        <motion.div
          className="absolute inset-0 flex flex-col"
          style={{ opacity: deskOpacity }}
        >
          {/* 상단: 흰 배경 */}
          <div
            className="flex-1"
            style={{
              background: "#ffffff",
              minHeight: "45%",
            }}
          />

          {/* 하단: 검은 책상 */}
          <div
            style={{
              height: "55%",
              background: "linear-gradient(180deg, #111111 0%, #0a0a0a 50%, #050505 100%)",
              position: "relative",
            }}
          >
            {/* 책상 표면 하이라이트 */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 1,
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)",
              }}
            />
            {/* 반사 */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "15%",
                right: "15%",
                height: "30%",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%)",
                filter: "blur(8px)",
              }}
            />
          </div>

          {/* ── 책상 위 오브젝트들 ──
              흰 배경 / 검은 책상 경계선에 배치 */}
          <div
            className="absolute left-0 right-0 flex items-end justify-center gap-16"
            style={{ bottom: "calc(55% - 40px)" }}
          >
            {/* iPod Nano (왼쪽) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              style={{ marginBottom: 0 }}
            >
              <IPodNano />
            </motion.div>

            {/* 맥북 (중앙) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <MacBook openProgress={macbookOpenProgress} />
            </motion.div>

            {/* 오른쪽 여백 균형용 빈 공간 */}
            <div style={{ width: 148 }} />
          </div>

          {/* 스크롤 안내 */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
          >
            <p
              style={{
                color: "rgba(0,0,0,0.35)",
                fontSize: 11,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
              }}
            >
              Scroll to open
            </p>
            <div
              style={{
                marginTop: 8,
                marginLeft: "auto",
                marginRight: "auto",
                width: 1,
                height: 32,
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 100%)",
              }}
            />
          </motion.div>
        </motion.div>

        {/* ══════════════════════════════
            macOS Sequoia 전체 화면
        ══════════════════════════════ */}
        <motion.div
          className="absolute inset-0"
          style={{ opacity: macosOpacity, scale: macosScale }}
        >
          <MacOSDesktop visible={true} />
        </motion.div>

        {/* 스크롤 진행 바 (개발용) */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 z-[100]"
          style={{
            scaleX: scrollYProgress,
            transformOrigin: "left",
            background: "rgba(0,0,0,0.2)",
          }}
        />
      </div>
    </div>
  );
}
