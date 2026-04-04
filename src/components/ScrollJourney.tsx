"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import MacBook from "./MacBook";
import MacOSDesktop from "./MacOSDesktop";

export default function ScrollJourney() {
  const containerRef = useRef<HTMLDivElement>(null);

  // 전체 스크롤 진행률 (0 → 1), 컨테이너 500vh 기준
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // ── Phase 1: 북촌 건물 외관 (0 ~ 0.35) ──
  const phase1Opacity = useTransform(scrollYProgress, [0, 0.28, 0.35], [1, 1, 0]);
  const phase1Scale  = useTransform(scrollYProgress, [0, 0.35], [1, 1.1]);
  const phase1Y      = useTransform(scrollYProgress, [0, 0.35], ["0%", "-5%"]);

  // ── Phase 2: 책상 + 맥북 닫힌 상태 (0.28 ~ 0.65) ──
  const phase2Opacity = useTransform(scrollYProgress, [0.28, 0.42, 0.62, 0.68], [0, 1, 1, 0]);
  const phase2Scale   = useTransform(scrollYProgress, [0.28, 0.5], [0.96, 1]);
  const phase2Y       = useTransform(scrollYProgress, [0.28, 0.5], ["4%", "0%"]);

  // ── Phase 3a: 맥북 열리는 애니메이션 (0.62 ~ 0.82) ──
  const macbookSceneOpacity = useTransform(scrollYProgress, [0.62, 0.72, 0.92, 0.96], [0, 1, 1, 0]);
  // MacBook 컴포넌트에 넘겨줄 열림 진행률 (0=닫힘, 1=완전 열림)
  const macbookOpenProgress = useTransform(scrollYProgress, [0.65, 0.88], [0, 1]);

  // ── Phase 3b: macOS 전체 화면 (0.9 ~ 1.0) ──
  const macosFullOpacity = useTransform(scrollYProgress, [0.92, 0.97], [0, 1]);
  const macosFullScale   = useTransform(scrollYProgress, [0.92, 1.0], [1.04, 1]);
  const macosVisible     = useTransform(scrollYProgress, (v) => v > 0.91);

  return (
    // 500vh — 스크롤 트리거 전체 높이
    <div ref={containerRef} className="relative h-[500vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-black">

        {/* ══════════════════════════════════════════
            Phase 1 — 북촌 건물 외관
        ══════════════════════════════════════════ */}
        <motion.div
          className="absolute inset-0"
          style={{ opacity: phase1Opacity, scale: phase1Scale, y: phase1Y }}
        >
          <Image
            src="https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1920&q=80"
            alt="북촌 거리"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/15" />

          {/* Scroll to enter 안내 */}
          <motion.div
            className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <p className="text-white/60 text-xs tracking-[0.3em] uppercase">
              Scroll to enter
            </p>
            <div className="mt-3 mx-auto w-px h-10 bg-gradient-to-b from-white/40 to-transparent" />
          </motion.div>
        </motion.div>

        {/* ══════════════════════════════════════════
            Phase 2 — 자작나무 책상 + 맥북 (닫힌 상태)
        ══════════════════════════════════════════ */}
        <motion.div
          className="absolute inset-0"
          style={{ opacity: phase2Opacity, scale: phase2Scale, y: phase2Y }}
        >
          <Image
            src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1920&q=80"
            alt="자작나무 책상 위 맥북"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/25" />
        </motion.div>

        {/* ══════════════════════════════════════════
            Phase 3a — 맥북 뚜껑이 열리는 씬
        ══════════════════════════════════════════ */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            opacity: macbookSceneOpacity,
            background: "radial-gradient(ellipse at center, #1a1208 0%, #0a0a0a 70%)",
          }}
        >
          {/* 책상 표면 힌트 */}
          <div
            className="absolute bottom-0 left-0 right-0 h-2/5"
            style={{
              background:
                "linear-gradient(to top, rgba(185,148,95,0.12) 0%, transparent 100%)",
            }}
          />
          <MacBook openProgress={macbookOpenProgress} />
        </motion.div>

        {/* ══════════════════════════════════════════
            Phase 3b — macOS 전체 화면
        ══════════════════════════════════════════ */}
        <motion.div
          className="absolute inset-0"
          style={{ opacity: macosFullOpacity, scale: macosFullScale }}
        >
          <MacOSDesktop visible={true} />
        </motion.div>

        {/* ── 개발용 스크롤 진행 바 ── */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-white/40 z-[100]"
          style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
        />
      </div>
    </div>
  );
}
