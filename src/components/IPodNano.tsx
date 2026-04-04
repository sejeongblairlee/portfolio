"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";

const TRACKS = [
  { title: "Seoul Morning", artist: "Blair", duration: 187, src: "/audio/track1.mp3" },
  { title: "Bukchon Rain", artist: "Blair", duration: 214, src: "/audio/track2.mp3" },
  { title: "Late Night Studio", artist: "Blair", duration: 243, src: "/audio/track3.mp3" },
];

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function IPodNano() {
  const [playing, setPlaying] = useState(false);
  const [trackIdx, setTrackIdx] = useState(0);
  const [progress, setProgress] = useState(0); // 0~1
  const [elapsed, setElapsed] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [pressing, setPressing] = useState<string | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const track = TRACKS[trackIdx];

  // 재생 시뮬레이션 (실제 오디오 파일 없을 때도 UI 작동)
  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setElapsed((e) => {
          const next = e + 1;
          if (next >= track.duration) {
            nextTrack();
            return 0;
          }
          setProgress(next / track.duration);
          return next;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, trackIdx]);

  const nextTrack = () => {
    setTrackIdx((i) => (i + 1) % TRACKS.length);
    setElapsed(0);
    setProgress(0);
  };
  const prevTrack = () => {
    setTrackIdx((i) => (i - 1 + TRACKS.length) % TRACKS.length);
    setElapsed(0);
    setProgress(0);
  };

  // 클릭휠 버튼 위치
  const wheelButtons = [
    { id: "menu",    label: "MENU",  top: "14%",  left: "50%",  action: () => {} },
    { id: "next",    label: "▶|",   top: "50%",  left: "82%",  action: nextTrack },
    { id: "prev",    label: "|◀",   top: "50%",  left: "18%",  action: prevTrack },
    { id: "play",    label: "▶II",  top: "86%",  left: "50%",  action: () => setPlaying((p) => !p) },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 24 }}
      className="relative select-none"
      style={{ width: 168, userSelect: "none" }}
    >
      {/* ── 바디: 실버 메탈 ── */}
      <div
        className="relative rounded-[28px] overflow-hidden"
        style={{
          width: 168,
          height: 340,
          background:
            "linear-gradient(160deg, #f0f0f2 0%, #d8d8dc 30%, #c8c8cc 60%, #e0e0e4 100%)",
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(0,0,0,0.1)",
        }}
      >
        {/* 메탈 광택 레이어 */}
        <div
          className="absolute inset-0 rounded-[28px] pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%, rgba(0,0,0,0.05) 100%)",
          }}
        />

        {/* ── 화면 ── */}
        <div
          className="absolute"
          style={{
            top: 22,
            left: 16,
            right: 16,
            height: 118,
            borderRadius: 6,
            background: "#1a1a1a",
            boxShadow: "inset 0 2px 6px rgba(0,0,0,0.8)",
            overflow: "hidden",
          }}
        >
          {/* 화면 내용 */}
          <div
            className="w-full h-full flex flex-col"
            style={{
              background: "linear-gradient(180deg, #1c2a3a 0%, #0f1a26 100%)",
            }}
          >
            {/* 상단 상태바 */}
            <div className="flex justify-between items-center px-2 pt-1.5">
              <span className="text-[#5ac8fa] text-[8px] font-bold">iPod</span>
              <div className="flex items-center gap-1">
                <Volume2 size={7} className="text-white/50" />
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 rounded-sm"
                      style={{
                        height: 4 + i * 1.5,
                        background: i < Math.round(volume * 5) ? "#5ac8fa" : "rgba(255,255,255,0.2)",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* 앨범 아트 + 정보 */}
            <div className="flex items-center gap-2 px-2 mt-1">
              {/* 앨범 아트 플레이스홀더 */}
              <div
                className="shrink-0 rounded"
                style={{
                  width: 44,
                  height: 44,
                  background: "linear-gradient(135deg, #1a3a5c, #2d1b69)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                }}
              >
                🎵
              </div>

              <div className="flex-1 overflow-hidden">
                {/* 스크롤 텍스트 */}
                <div className="overflow-hidden">
                  <motion.p
                    className="text-white text-[10px] font-semibold whitespace-nowrap"
                    animate={track.title.length > 12 ? { x: ["0%", "-40%", "0%"] } : {}}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  >
                    {track.title}
                  </motion.p>
                </div>
                <p className="text-white/50 text-[9px] mt-0.5">{track.artist}</p>
              </div>

              {/* 재생 상태 아이콘 */}
              <div className="shrink-0">
                {playing ? (
                  <Pause size={10} className="text-white/70" />
                ) : (
                  <Play size={10} className="text-white/70" />
                )}
              </div>
            </div>

            {/* 진행 바 */}
            <div className="px-2 mt-2">
              <div className="relative h-0.5 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="absolute left-0 top-0 h-full bg-[#5ac8fa] rounded-full"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-0.5">
                <span className="text-white/40 text-[8px]">{formatTime(elapsed)}</span>
                <span className="text-white/40 text-[8px]">-{formatTime(track.duration - elapsed)}</span>
              </div>
            </div>

            {/* 트랙 번호 */}
            <div className="flex justify-center mt-1">
              <span className="text-white/30 text-[8px]">
                {trackIdx + 1} of {TRACKS.length}
              </span>
            </div>
          </div>
        </div>

        {/* ── 클릭 휠 ── */}
        <div
          className="absolute"
          style={{ bottom: 28, left: 16, right: 16, height: 136 }}
        >
          {/* 바깥 링 */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "linear-gradient(145deg, #c8c8cc 0%, #b8b8bc 50%, #d0d0d4 100%)",
              boxShadow:
                "inset 0 2px 6px rgba(0,0,0,0.2), 0 2px 4px rgba(255,255,255,0.8)",
            }}
          />

          {/* 휠 버튼들 */}
          {wheelButtons.map((btn) => (
            <motion.button
              key={btn.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
              style={{ top: btn.top, left: btn.left, width: 32, height: 32 }}
              whileTap={{ scale: 0.85 }}
              onPointerDown={() => setPressing(btn.id)}
              onPointerUp={() => { setPressing(null); btn.action(); }}
            >
              <span
                className="text-[9px] font-semibold"
                style={{
                  color: pressing === btn.id ? "#333" : "#666",
                  letterSpacing: btn.id === "menu" ? "0.05em" : 0,
                }}
              >
                {btn.label}
              </span>
            </motion.button>
          ))}

          {/* 가운데 버튼 */}
          <motion.button
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center"
            style={{
              width: 50,
              height: 50,
              background:
                "linear-gradient(145deg, #d8d8dc 0%, #c0c0c4 100%)",
              boxShadow:
                "inset 0 1px 3px rgba(0,0,0,0.2), 0 1px 2px rgba(255,255,255,0.8)",
            }}
            whileTap={{ scale: 0.93 }}
            onPointerUp={() => setPlaying((p) => !p)}
          >
            {playing
              ? <Pause size={14} className="text-gray-600" />
              : <Play size={14} className="text-gray-600 ml-0.5" />
            }
          </motion.button>
        </div>

        {/* 하단 커넥터 표시 */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-sm"
          style={{
            width: 32,
            height: 5,
            background: "rgba(0,0,0,0.15)",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.2)",
          }}
        />
      </div>

      {/* 그림자 */}
      <div
        className="absolute -bottom-3 left-4 right-4 blur-xl opacity-40 rounded-full"
        style={{ height: 16, background: "rgba(0,0,0,0.8)" }}
      />
    </motion.div>
  );
}
