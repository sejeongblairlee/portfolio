"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, Battery, Search, ChevronUp } from "lucide-react";
import FinderWindow from "./FinderWindow";
import IPodNano from "./IPodNano";

// ── 메뉴바 ──
function MenuBar() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
      setDate(
        now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
      );
    };
    update();
    const id = setInterval(update, 10000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="absolute top-0 left-0 right-0 h-7 flex items-center justify-between px-3 z-50"
      style={{
        background: "rgba(0,0,0,0.35)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="flex items-center gap-4">
        <span className="text-white text-sm"></span>
        <span className="text-white/90 text-[11px] font-semibold">Finder</span>
        {["File", "Edit", "View", "Go", "Window", "Help"].map((m) => (
          <span key={m} className="text-white/70 text-[11px]">{m}</span>
        ))}
      </div>
      <div className="flex items-center gap-2.5 text-white/80">
        <ChevronUp size={12} />
        <Wifi size={13} />
        <Battery size={14} />
        <Search size={12} />
        <span className="text-[11px]">{date}</span>
        <span className="text-[11px] font-medium">{time}</span>
      </div>
    </div>
  );
}

// ── 데스크탑 아이콘 ──
function DesktopIcon({ label, onClick }: { label: string; onClick?: () => void }) {
  const [selected, setSelected] = useState(false);

  return (
    <motion.div
      className="flex flex-col items-center gap-1 cursor-pointer select-none w-20"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onTap={() => { setSelected(!selected); onClick?.(); }}
    >
      <div className={`p-2 rounded-xl ${selected ? "bg-white/20" : "hover:bg-white/10"}`}>
        {/* macOS Sequoia 스타일 폴더 */}
        <svg width="52" height="44" viewBox="0 0 52 44" fill="none">
          <path
            d="M2 10 C2 7 4 6 7 6 L18 6 C20 6 21 7 22 8 L24 11 L46 11 C49 11 50 12.5 50 15 L50 38 C50 41 48 42 46 42 L6 42 C4 42 2 41 2 38 Z"
            fill="#4DA6FF"
          />
          <path
            d="M2 14 L2 38 C2 41 4 42 6 42 L46 42 C48 42 50 41 50 38 L50 15 C50 12.5 49 11 46 11 L2 11 Z"
            fill="#5BB8FF"
          />
          <path
            d="M2 14 L50 14 L50 15 C50 12.5 49 11 46 11 L2 11 Z"
            fill="rgba(255,255,255,0.15)"
          />
        </svg>
      </div>
      <span
        className="text-white text-[11px] font-medium text-center leading-tight px-1.5 py-0.5 rounded"
        style={{
          textShadow: "0 1px 4px rgba(0,0,0,0.8)",
          background: selected ? "rgba(30,90,220,0.6)" : "transparent",
        }}
      >
        {label}
      </span>
    </motion.div>
  );
}

// ── Dock ──
function Dock() {
  const apps = [
    { emoji: "🗂️", label: "Finder" },
    { emoji: "🌐", label: "Safari" },
    { emoji: "📬", label: "Mail" },
    { emoji: "📝", label: "Notes" },
    { emoji: "🎵", label: "Music" },
    { emoji: "📷", label: "Photos" },
    { emoji: "⚙️", label: "Settings" },
  ];

  return (
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-50">
      <div
        className="flex items-end gap-1.5 px-3 py-2 rounded-2xl"
        style={{
          background: "rgba(255,255,255,0.14)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          border: "1px solid rgba(255,255,255,0.22)",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.3)",
        }}
      >
        {apps.map((app) => (
          <motion.div
            key={app.label}
            className="flex flex-col items-center cursor-pointer"
            whileHover={{ scale: 1.4, y: -10 }}
            transition={{ type: "spring", stiffness: 450, damping: 22 }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
              style={{
                background: "rgba(255,255,255,0.12)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)",
              }}
            >
              {app.emoji}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── Sequoia 배경 ──
function SequoiaWallpaper() {
  return (
    <div className="absolute inset-0">
      {/* 하늘 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #0a0e1a 0%, #0d1a2e 15%, #1a2d4a 30%, #2a4a6e 45%, #3d6b8a 55%, #5a8fa8 65%, #7ab0c4 75%, #9dcbda 82%, #c4e0e8 88%, #e8f4f8 93%, #f5f0e8 100%)",
        }}
      />

      {/* 태양 */}
      <div
        className="absolute"
        style={{
          top: "38%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 90,
          height: 90,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, #fff8e0 0%, #ffe566 30%, #ffb800 60%, transparent 100%)",
          filter: "blur(4px)",
          opacity: 0.9,
        }}
      />
      <div
        className="absolute"
        style={{
          top: "36%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 200,
          height: 200,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,220,80,0.3) 0%, rgba(255,180,0,0.1) 50%, transparent 100%)",
          filter: "blur(20px)",
        }}
      />

      {/* 산 실루엣 (원경) */}
      <svg
        className="absolute w-full"
        style={{ bottom: "28%", opacity: 0.7 }}
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
      >
        <path
          d="M0,200 L0,140 Q100,80 200,110 Q300,140 400,70 Q500,0 600,50 Q700,100 800,40 Q900,-20 1000,60 Q1100,140 1200,90 Q1300,40 1440,80 L1440,200 Z"
          fill="#1a2d3a"
          opacity="0.6"
        />
        <path
          d="M0,200 L0,155 Q150,110 280,130 Q420,150 540,100 Q660,50 760,90 Q860,130 960,80 Q1080,30 1200,100 Q1320,170 1440,130 L1440,200 Z"
          fill="#1f3545"
          opacity="0.7"
        />
      </svg>

      {/* 세쿼이아 나무 실루엣 */}
      <svg
        className="absolute"
        style={{ bottom: "18%", left: "50%", transform: "translateX(-50%)" }}
        width="320"
        height="260"
        viewBox="0 0 320 260"
      >
        {/* 중앙 큰 나무 */}
        <rect x="152" y="80" width="16" height="180" fill="#1a2a18" opacity="0.9" />
        <ellipse cx="160" cy="70" rx="32" ry="60" fill="#1e3a1a" opacity="0.85" />
        <ellipse cx="160" cy="40" rx="22" ry="42" fill="#1a3016" opacity="0.9" />
        {/* 왼쪽 나무 */}
        <rect x="54" y="110" width="10" height="150" fill="#192818" opacity="0.8" />
        <ellipse cx="59" cy="100" rx="22" ry="44" fill="#1c3419" opacity="0.8" />
        {/* 오른쪽 나무 */}
        <rect x="254" y="120" width="10" height="140" fill="#192818" opacity="0.8" />
        <ellipse cx="259" cy="110" rx="20" ry="40" fill="#1c3419" opacity="0.8" />
        {/* 작은 나무들 */}
        <rect x="100" y="130" width="7" height="130" fill="#182618" opacity="0.7" />
        <ellipse cx="103" cy="122" rx="16" ry="32" fill="#1a3018" opacity="0.75" />
        <rect x="208" y="135" width="7" height="125" fill="#182618" opacity="0.7" />
        <ellipse cx="211" cy="127" rx="16" ry="30" fill="#1a3018" opacity="0.75" />
      </svg>

      {/* 숲 (전경) */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "28%",
          background:
            "linear-gradient(180deg, transparent 0%, #0e1f0e 40%, #0a180a 100%)",
        }}
      />

      {/* 빛 산란 */}
      <div
        className="absolute"
        style={{
          top: "35%",
          left: "35%",
          right: "35%",
          height: "45%",
          background:
            "linear-gradient(180deg, rgba(255,200,60,0.12) 0%, rgba(255,150,20,0.06) 50%, transparent 100%)",
          filter: "blur(30px)",
        }}
      />
    </div>
  );
}

// ── 메인 컴포넌트 ──
export default function MacOSDesktop({ visible }: { visible: boolean }) {
  const [finderOpen, setFinderOpen] = useState(false);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute inset-0 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Sequoia 배경 */}
          <SequoiaWallpaper />

          {/* 메뉴바 */}
          <MenuBar />

          {/* 바탕화면 아이콘 */}
          <div className="absolute top-10 right-5 pt-2 flex flex-col gap-2">
            <DesktopIcon label="blair" onClick={() => setFinderOpen(true)} />
          </div>

          {/* iPod (macOS 안에서는 숨김 — 바깥 배치) */}

          {/* Finder */}
          <AnimatePresence>
            {finderOpen && <FinderWindow onClose={() => setFinderOpen(false)} />}
          </AnimatePresence>

          {/* Dock */}
          <Dock />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
