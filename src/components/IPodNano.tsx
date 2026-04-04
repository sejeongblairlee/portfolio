"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";

const TRACKS = [
  { title: "Seoul Morning", artist: "Blair", duration: 180 },
  { title: "Bukchon Rain", artist: "Blair", duration: 210 },
  { title: "Late Night Studio", artist: "Blair", duration: 240 },
];

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function IPodNano() {
  const [playing, setPlaying] = useState(true); // 기본 재생 상태
  const [trackIdx, setTrackIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [pressing, setPressing] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const track = TRACKS[trackIdx];
  const progress = elapsed / track.duration;

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setElapsed((e) => {
          const next = e + 1;
          if (next >= track.duration) {
            setTrackIdx((i) => (i + 1) % TRACKS.length);
            setElapsed(0);
            return 0;
          }
          return next;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, trackIdx, track.duration]);

  const nextTrack = () => {
    setTrackIdx((i) => (i + 1) % TRACKS.length);
    setElapsed(0);
  };
  const prevTrack = () => {
    setTrackIdx((i) => (i - 1 + TRACKS.length) % TRACKS.length);
    setElapsed(0);
  };

  const wheelBtns = [
    { id: "menu", label: "MENU", top: "15%", left: "50%", action: () => {} },
    { id: "next", label: "▶|", top: "50%", left: "82%", action: nextTrack },
    { id: "prev", label: "|◀", top: "50%", left: "18%", action: prevTrack },
    { id: "play", label: "▶II", top: "85%", left: "50%", action: () => setPlaying((p) => !p) },
  ];

  return (
    <div style={{ width: 148, position: "relative" }}>
      {/* ── 바디 ── */}
      <div
        style={{
          width: 148,
          height: 300,
          borderRadius: 26,
          background:
            "linear-gradient(160deg, #f2f2f4 0%, #e0e0e4 35%, #d0d0d4 65%, #e8e8ec 100%)",
          boxShadow:
            "0 16px 48px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.95), inset 0 -1px 0 rgba(0,0,0,0.08)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* 메탈 광택 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 26,
            background:
              "linear-gradient(140deg, rgba(255,255,255,0.45) 0%, transparent 45%, rgba(0,0,0,0.04) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* ── 화면 ── */}
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 14,
            right: 14,
            height: 104,
            borderRadius: 5,
            background: "#111",
            overflow: "hidden",
            boxShadow: "inset 0 2px 8px rgba(0,0,0,0.9)",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(180deg, #1c2e44 0%, #0e1a28 100%)",
              display: "flex",
              flexDirection: "column",
              padding: "6px 8px",
            }}
          >
            {/* 상단 바 */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#5ac8fa", fontSize: 8, fontWeight: 700 }}>iPod</span>
              <div style={{ display: "flex", gap: 2, alignItems: "flex-end" }}>
                {[3, 5, 7, 9, 11].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      width: 2,
                      height: h,
                      borderRadius: 1,
                      background: playing ? "#5ac8fa" : "rgba(255,255,255,0.2)",
                      transition: "background 0.3s",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* 앨범 + 정보 */}
            <div style={{ display: "flex", gap: 6, marginTop: 6, alignItems: "center" }}>
              {/* 앨범 아트 */}
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 4,
                  background: "linear-gradient(135deg, #1a3a5c 0%, #2d1b69 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  flexShrink: 0,
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                🎵
              </div>

              <div style={{ flex: 1, overflow: "hidden" }}>
                {/* 스크롤 텍스트 */}
                <div style={{ overflow: "hidden" }}>
                  <motion.p
                    style={{ color: "#fff", fontSize: 9, fontWeight: 600, whiteSpace: "nowrap" }}
                    animate={
                      playing && track.title.length > 10
                        ? { x: ["0%", "-35%", "0%"] }
                        : { x: "0%" }
                    }
                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  >
                    {track.title}
                  </motion.p>
                </div>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 8, marginTop: 2 }}>
                  {track.artist}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                  {playing ? (
                    <Pause size={8} color="rgba(255,255,255,0.6)" />
                  ) : (
                    <Play size={8} color="rgba(255,255,255,0.6)" />
                  )}
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 7 }}>
                    {trackIdx + 1}/{TRACKS.length}
                  </span>
                </div>
              </div>
            </div>

            {/* 진행 바 */}
            <div style={{ marginTop: "auto", paddingTop: 4 }}>
              <div
                style={{
                  height: 2,
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: 1,
                  overflow: "hidden",
                }}
              >
                <motion.div
                  style={{
                    height: "100%",
                    background: "#5ac8fa",
                    borderRadius: 1,
                    width: `${progress * 100}%`,
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 2,
                }}
              >
                <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 7 }}>
                  {formatTime(elapsed)}
                </span>
                <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 7 }}>
                  -{formatTime(track.duration - elapsed)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 클릭 휠 ── */}
        <div
          style={{
            position: "absolute",
            bottom: 24,
            left: 14,
            right: 14,
            height: 120,
          }}
        >
          {/* 바깥 링 */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background:
                "linear-gradient(145deg, #d0d0d4 0%, #b8b8bc 40%, #c8c8cc 70%, #d8d8dc 100%)",
              boxShadow:
                "inset 0 2px 8px rgba(0,0,0,0.18), 0 2px 4px rgba(255,255,255,0.9)",
            }}
          />

          {/* 버튼들 */}
          {wheelBtns.map((btn) => (
            <motion.button
              key={btn.id}
              style={{
                position: "absolute",
                top: btn.top,
                left: btn.left,
                transform: "translate(-50%, -50%)",
                width: 28,
                height: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
              whileTap={{ scale: 0.82 }}
              onPointerDown={() => setPressing(btn.id)}
              onPointerUp={() => {
                setPressing(null);
                btn.action();
              }}
            >
              <span
                style={{
                  fontSize: btn.id === "menu" ? 7 : 9,
                  fontWeight: 700,
                  color: pressing === btn.id ? "#222" : "#555",
                  letterSpacing: btn.id === "menu" ? "0.08em" : 0,
                  transition: "color 0.1s",
                }}
              >
                {btn.label}
              </span>
            </motion.button>
          ))}

          {/* 가운데 버튼 */}
          <motion.button
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 46,
              height: 46,
              borderRadius: "50%",
              background:
                "linear-gradient(145deg, #d4d4d8 0%, #bcbcc0 100%)",
              boxShadow:
                "inset 0 1px 3px rgba(0,0,0,0.18), 0 1px 2px rgba(255,255,255,0.85)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            whileTap={{ scale: 0.91 }}
            onPointerUp={() => setPlaying((p) => !p)}
          >
            {playing ? (
              <Pause size={13} color="#444" />
            ) : (
              <Play size={13} color="#444" style={{ marginLeft: 1 }} />
            )}
          </motion.button>
        </div>

        {/* 커넥터 */}
        <div
          style={{
            position: "absolute",
            bottom: 7,
            left: "50%",
            transform: "translateX(-50%)",
            width: 28,
            height: 4,
            borderRadius: 2,
            background: "rgba(0,0,0,0.12)",
          }}
        />
      </div>

      {/* 그림자 */}
      <div
        style={{
          position: "absolute",
          bottom: -6,
          left: 12,
          right: 12,
          height: 10,
          background: "rgba(0,0,0,0.35)",
          filter: "blur(10px)",
          borderRadius: "50%",
        }}
      />
    </div>
  );
}
