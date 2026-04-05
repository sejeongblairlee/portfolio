"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, ArrowLeft, Volume2 } from "lucide-react";

const TRACKS = [
  { title: "Seoul Morning", artist: "Blair Lee", duration: 194 },
  { title: "Bukchon Rain",  artist: "Blair Lee", duration: 221 },
  { title: "Late Night",    artist: "Blair Lee", duration: 247 },
];

function fmt(s: number) {
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

export default function MusicPlayer({ onBack }: { onBack: () => void }) {
  const [trackIdx, setTrackIdx] = useState(0);
  const [playing,  setPlaying]  = useState(true);
  const [elapsed,  setElapsed]  = useState(0);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);
  const track = TRACKS[trackIdx];

  useEffect(() => {
    if (playing) {
      interval.current = setInterval(() => {
        setElapsed((e) => {
          if (e + 1 >= track.duration) {
            setTrackIdx((i) => (i + 1) % TRACKS.length);
            return 0;
          }
          return e + 1;
        });
      }, 1000);
    } else {
      if (interval.current) clearInterval(interval.current);
    }
    return () => { if (interval.current) clearInterval(interval.current); };
  }, [playing, trackIdx, track.duration]);

  const prev = () => { setTrackIdx((i) => (i - 1 + TRACKS.length) % TRACKS.length); setElapsed(0); };
  const next = () => { setTrackIdx((i) => (i + 1) % TRACKS.length); setElapsed(0); };

  const pct = elapsed / track.duration;

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        background:
          "linear-gradient(160deg, #0a0a10 0%, #0f1520 40%, #0a0e18 100%)",
        fontFamily: "Pretendard, sans-serif",
      }}
    >
      {/* 돌아가기 */}
      <button
        onClick={onBack}
        className="absolute top-8 left-8 flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors"
        style={{ fontSize: 13, letterSpacing: "0.04em" }}
      >
        <ArrowLeft size={15} />
        Back
      </button>

      {/* 앨범 아트 */}
      <motion.div
        key={trackIdx}
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
        style={{
          width: 260,
          height: 260,
          borderRadius: 20,
          background:
            "linear-gradient(135deg, #1a2d5a 0%, #2d1b69 50%, #0d2240 100%)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 80,
          marginBottom: 40,
        }}
      >
        🎵
      </motion.div>

      {/* 트랙 정보 */}
      <motion.div
        key={`info-${trackIdx}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
        style={{ width: 300 }}
      >
        <p style={{ color: "#fff", fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em" }}>
          {track.title}
        </p>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, marginTop: 6, letterSpacing: "0.02em" }}>
          {track.artist}
        </p>
      </motion.div>

      {/* 진행 바 */}
      <div style={{ width: 300, marginBottom: 8 }}>
        <div
          style={{
            height: 3,
            background: "rgba(255,255,255,0.12)",
            borderRadius: 2,
            overflow: "hidden",
            cursor: "pointer",
          }}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const ratio = (e.clientX - rect.left) / rect.width;
            setElapsed(Math.floor(ratio * track.duration));
          }}
        >
          <motion.div
            style={{
              height: "100%",
              width: `${pct * 100}%`,
              background: "linear-gradient(90deg, #5ac8fa, #7dd6fc)",
              borderRadius: 2,
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 6,
            color: "rgba(255,255,255,0.3)",
            fontSize: 11,
          }}
        >
          <span>{fmt(elapsed)}</span>
          <span>-{fmt(track.duration - elapsed)}</span>
        </div>
      </div>

      {/* 컨트롤 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 36,
          marginTop: 8,
        }}
      >
        <button
          onClick={prev}
          style={{ color: "rgba(255,255,255,0.7)", background: "none", border: "none", cursor: "pointer" }}
        >
          <SkipBack size={28} />
        </button>

        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => setPlaying((p) => !p)}
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "#fff",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 24px rgba(255,255,255,0.15)",
          }}
        >
          {playing ? (
            <Pause size={26} color="#0a0a10" />
          ) : (
            <Play size={26} color="#0a0a10" style={{ marginLeft: 2 }} />
          )}
        </motion.button>

        <button
          onClick={next}
          style={{ color: "rgba(255,255,255,0.7)", background: "none", border: "none", cursor: "pointer" }}
        >
          <SkipForward size={28} />
        </button>
      </div>

      {/* 볼륨 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginTop: 32,
          color: "rgba(255,255,255,0.3)",
        }}
      >
        <Volume2 size={14} />
        <div
          style={{
            width: 120,
            height: 2,
            background: "rgba(255,255,255,0.12)",
            borderRadius: 1,
          }}
        >
          <div style={{ width: "70%", height: "100%", background: "rgba(255,255,255,0.35)", borderRadius: 1 }} />
        </div>
      </div>
    </motion.div>
  );
}
