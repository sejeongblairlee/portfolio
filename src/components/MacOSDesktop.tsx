"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Folder, Wifi, Battery, Search } from "lucide-react";
import FinderWindow from "./FinderWindow";
import IPodNano from "./IPodNano";

function MenuBar() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }));
      setDate(now.toLocaleDateString("ko-KR", { month: "short", day: "numeric", weekday: "short" }));
    };
    update();
    const id = setInterval(update, 10000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="absolute top-0 left-0 right-0 h-7 flex items-center justify-between px-4 z-50"
      style={{
        background: "rgba(255,255,255,0.14)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <div className="flex items-center gap-5">
        <span className="text-white text-sm font-medium"></span>
        <span className="text-white/90 text-xs font-semibold">Finder</span>
        {["File", "Edit", "View", "Go", "Window", "Help"].map((m) => (
          <span key={m} className="text-white/60 text-xs">{m}</span>
        ))}
      </div>
      <div className="flex items-center gap-3 text-white/80">
        <Battery size={14} />
        <Wifi size={14} />
        <Search size={13} />
        <span className="text-xs">{date}</span>
        <span className="text-xs font-medium">{time}</span>
      </div>
    </div>
  );
}

function DesktopIcon({ label, onClick }: { label: string; onClick?: () => void }) {
  const [selected, setSelected] = useState(false);

  return (
    <motion.div
      className="flex flex-col items-center gap-1 cursor-pointer select-none w-20"
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.95 }}
      onTap={() => {
        setSelected(!selected);
        onClick?.();
      }}
    >
      <div className={`p-3 rounded-xl transition-colors ${selected ? "bg-white/20" : "hover:bg-white/10"}`}>
        <Folder size={48} className="text-[#5ac8fa] drop-shadow-lg" fill="#5ac8fa" />
      </div>
      <span
        className="text-white text-xs text-center leading-tight px-1.5 py-0.5 rounded"
        style={{
          textShadow: "0 1px 4px rgba(0,0,0,0.9)",
          background: selected ? "rgba(30,100,220,0.55)" : "transparent",
        }}
      >
        {label}
      </span>
    </motion.div>
  );
}

function Dock() {
  const apps = [
    { icon: "🔍", label: "Finder" },
    { icon: "🌐", label: "Safari" },
    { icon: "📝", label: "Notes" },
    { icon: "🎵", label: "Music" },
    { icon: "⚙️", label: "Settings" },
  ];

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div
        className="flex items-end gap-2 px-4 py-2 rounded-2xl"
        style={{
          background: "rgba(255,255,255,0.16)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          border: "1px solid rgba(255,255,255,0.28)",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.35)",
        }}
      >
        {apps.map((app) => (
          <motion.div
            key={app.label}
            className="flex flex-col items-center cursor-pointer"
            whileHover={{ scale: 1.35, y: -10 }}
            transition={{ type: "spring", stiffness: 420, damping: 22 }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-white/10 shadow-inner">
              {app.icon}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

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
          transition={{ duration: 0.6 }}
        >
          {/* ── 배경 월페이퍼 (macOS Sonoma — 서울 새벽빛 테마) ── */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(160deg, #070b14 0%, #0b1e3a 20%, #0f2d52 40%, #1a1040 65%, #2a0a35 85%, #0d0510 100%)",
            }}
          />
          {/* 산 능선 실루엣 */}
          <svg
            className="absolute bottom-0 left-0 right-0 w-full opacity-30"
            viewBox="0 0 1440 300"
            preserveAspectRatio="none"
            style={{ height: "38%" }}
          >
            <path
              d="M0,300 L0,200 Q120,100 240,160 Q360,220 480,120 Q600,20 720,80 Q840,140 960,60 Q1080,-20 1200,80 Q1320,180 1440,120 L1440,300 Z"
              fill="rgba(20,35,60,0.8)"
            />
            <path
              d="M0,300 L0,240 Q180,160 360,200 Q540,240 720,160 Q900,80 1080,140 Q1260,200 1440,160 L1440,300 Z"
              fill="rgba(15,25,45,0.9)"
            />
          </svg>
          {/* 빛 번짐 */}
          <div className="absolute top-[15%] left-[20%] w-[600px] h-[400px] rounded-full bg-blue-500/12 blur-[140px]" />
          <div className="absolute top-[10%] right-[15%] w-[400px] h-[300px] rounded-full bg-purple-500/10 blur-[120px]" />
          <div className="absolute bottom-[20%] left-[40%] w-[500px] h-[250px] rounded-full bg-cyan-400/06 blur-[100px]" />
          {/* 별빛 */}
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: Math.random() * 1.5 + 0.5,
                height: Math.random() * 1.5 + 0.5,
                top: `${Math.random() * 55}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}

          {/* 메뉴바 */}
          <MenuBar />

          {/* 데스크탑 아이콘 (우측 상단) */}
          <div className="absolute top-10 right-6 flex flex-col gap-2 pt-2">
            <DesktopIcon label="blair" onClick={() => setFinderOpen(true)} />
          </div>

          {/* iPod Nano (좌측 하단 — Dock 위) */}
          <div className="absolute bottom-24 left-8 z-40">
            <IPodNano />
          </div>

          {/* Finder 창 */}
          <AnimatePresence>
            {finderOpen && (
              <FinderWindow onClose={() => setFinderOpen(false)} />
            )}
          </AnimatePresence>

          {/* Dock */}
          <Dock />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
