"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

export default function ScrollJourney() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Phase 1 (건물 외관): 0 ~ 0.5 구간에서 서서히 사라짐
  const phase1Opacity = useTransform(scrollYProgress, [0, 0.4, 0.5], [1, 1, 0]);
  const phase1Scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.08]);

  // Phase 2 (책상 + 맥북): 0.4 ~ 0.7 구간에서 나타남
  const phase2Opacity = useTransform(scrollYProgress, [0.4, 0.6], [0, 1]);
  const phase2Scale = useTransform(scrollYProgress, [0.4, 0.7], [0.95, 1]);

  // 화면 이동 효과 (건물에서 내부로 줌인하는 느낌)
  const phase1Y = useTransform(scrollYProgress, [0, 0.5], ["0%", "-5%"]);
  const phase2Y = useTransform(scrollYProgress, [0.4, 0.7], ["3%", "0%"]);

  return (
    // 스크롤 트리거를 위한 긴 컨테이너 (300vh)
    <div ref={containerRef} className="relative h-[300vh]">
      {/* sticky 영역: 실제 화면에 고정되어 스크롤에 반응 */}
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* ── Phase 1: 북촌 건물 외관 ── */}
        <motion.div
          className="absolute inset-0"
          style={{ opacity: phase1Opacity, scale: phase1Scale, y: phase1Y }}
        >
          <Image
            src="https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1920&q=80"
            alt="북촌 거리 플레이스홀더"
            fill
            priority
            className="object-cover"
          />
          {/* 오버레이 */}
          <div className="absolute inset-0 bg-black/10" />

          {/* 안내 텍스트 */}
          <motion.div
            className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <p className="text-white/70 text-sm tracking-widest uppercase">
              Scroll to enter
            </p>
            <div className="mt-2 mx-auto w-px h-10 bg-white/40" />
          </motion.div>
        </motion.div>

        {/* ── Phase 2: 자작나무 책상 + 맥북 ── */}
        <motion.div
          className="absolute inset-0"
          style={{ opacity: phase2Opacity, scale: phase2Scale, y: phase2Y }}
        >
          <Image
            src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1920&q=80"
            alt="맥북 책상 플레이스홀더"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />

          {/* Phase 2 레이블 */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-white/50 text-xs tracking-[0.3em] uppercase mb-3">
              Phase 2
            </p>
            <h2 className="text-white text-3xl font-light tracking-tight">
              자작나무 책상
            </h2>
          </motion.div>
        </motion.div>

        {/* ── 스크롤 진행률 디버그 바 (개발 중에만) ── */}
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-white/60"
          style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
        />
      </div>
    </div>
  );
}
