"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Folder, Wifi, Battery, Search } from "lucide-react";

function MenuBar() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateStr = now.toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
    weekday: "short",
  });

  return (
    <div
      className="absolute top-0 left-0 right-0 h-7 flex items-center justify-between px-4 z-50"
      style={{
        background: "rgba(255,255,255,0.18)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(255,255,255,0.15)",
      }}
    >
      {/* 왼쪽: 애플 로고 + 앱 메뉴 */}
      <div className="flex items-center gap-5">
        <span className="text-white text-sm font-medium"></span>
        <span className="text-white/90 text-xs font-semibold">Finder</span>
        <span className="text-white/70 text-xs">File</span>
        <span className="text-white/70 text-xs">Edit</span>
        <span className="text-white/70 text-xs">View</span>
        <span className="text-white/70 text-xs">Go</span>
        <span className="text-white/70 text-xs">Window</span>
        <span className="text-white/70 text-xs">Help</span>
      </div>

      {/* 오른쪽: 상태 아이콘 + 시계 */}
      <div className="flex items-center gap-3 text-white/90">
        <Battery size={14} />
        <Wifi size={14} />
        <Search size={13} />
        <span className="text-xs">{dateStr}</span>
        <span className="text-xs font-medium">{timeStr}</span>
      </div>
    </div>
  );
}

function DesktopIcon({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) {
  const [selected, setSelected] = useState(false);

  return (
    <motion.div
      className="flex flex-col items-center gap-1 cursor-pointer select-none w-20"
      whileHover={{ scale: 1.05 }}
      onTap={() => {
        setSelected(!selected);
        onClick?.();
      }}
    >
      <div
        className={`p-3 rounded-xl transition-colors ${
          selected ? "bg-white/25" : "bg-transparent hover:bg-white/10"
        }`}
      >
        <Folder size={48} className="text-[#5ac8fa] drop-shadow-lg" fill="#5ac8fa" />
      </div>
      <span
        className="text-white text-xs text-center leading-tight px-1 py-0.5 rounded"
        style={{
          textShadow: "0 1px 3px rgba(0,0,0,0.8)",
          background: selected ? "rgba(30,100,220,0.6)" : "transparent",
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
          background: "rgba(255,255,255,0.18)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          border: "1px solid rgba(255,255,255,0.3)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.4)",
        }}
      >
        {apps.map((app) => (
          <motion.div
            key={app.label}
            className="flex flex-col items-center gap-1 cursor-pointer"
            whileHover={{ scale: 1.35, y: -8 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-white/10">
              {app.icon}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function MacOSDesktop({ visible }: { visible: boolean }) {
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
          {/* 배경 월페이퍼 */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, #1a1a2e 0%, #16213e 30%, #0f3460 60%, #533483 100%)",
            }}
          />

          {/* 배경 블러 원형 장식 */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-500/20 blur-[80px]" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-blue-400/20 blur-[60px]" />

          {/* 메뉴바 */}
          <MenuBar />

          {/* 데스크탑 아이콘 영역 */}
          <div className="absolute top-12 right-6 flex flex-col gap-2">
            <DesktopIcon label="blair" />
          </div>

          {/* Dock */}
          <Dock />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
