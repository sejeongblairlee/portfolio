"use client";

import { useState, useRef } from "react";
import { motion, useDragControls } from "framer-motion";
import {
  Folder,
  FileText,
  Globe,
  X,
  Minus,
  Square,
  ChevronLeft,
  ChevronRight,
  Grid2X2,
  List,
  Search,
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  type: "folder" | "file" | "web";
  date: string;
  tag?: string;
  tagColor?: string;
}

const PROJECTS: Project[] = [
  {
    id: "1",
    name: "Spatial Portfolio",
    type: "folder",
    date: "2024",
    tag: "In Progress",
    tagColor: "#30d158",
  },
  {
    id: "2",
    name: "Dalock Brand Identity",
    type: "folder",
    date: "2024",
    tag: "Design",
    tagColor: "#ff9f0a",
  },
  {
    id: "3",
    name: "2nd Syndrome — Web",
    type: "web",
    date: "2023",
    tag: "Development",
    tagColor: "#0a84ff",
  },
  {
    id: "4",
    name: "Unit Image — Rebrand",
    type: "folder",
    date: "2023",
    tag: "Branding",
    tagColor: "#bf5af2",
  },
  {
    id: "5",
    name: "AI Landing Concept",
    type: "file",
    date: "2024",
    tag: "UI/UX",
    tagColor: "#ff375f",
  },
  {
    id: "6",
    name: "About Blair.md",
    type: "file",
    date: "2024",
  },
];

const SIDEBAR = [
  { label: "Favorites", items: ["Blair", "Desktop", "Documents", "Downloads"] },
  { label: "Locations", items: ["MacBook Pro", "iCloud Drive"] },
];

function FileIcon({ type }: { type: Project["type"] }) {
  if (type === "folder")
    return <Folder size={36} className="text-[#5ac8fa]" fill="#5ac8fa" />;
  if (type === "web")
    return <Globe size={36} className="text-[#30d158]" />;
  return <FileText size={36} className="text-[#ebebf5]/70" />;
}

export default function FinderWindow({ onClose }: { onClose: () => void }) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selected, setSelected] = useState<string | null>(null);
  const dragControls = useDragControls();
  const constraintsRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={constraintsRef} className="absolute inset-0 pointer-events-none">
      <motion.div
        drag
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={constraintsRef}
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.88, y: 16 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className="absolute pointer-events-auto"
        style={{
          top: "10%",
          left: "50%",
          x: "-50%",
          width: 680,
          height: 440,
          borderRadius: 12,
          overflow: "hidden",
          boxShadow:
            "0 32px 80px rgba(0,0,0,0.7), 0 0 0 0.5px rgba(255,255,255,0.12)",
        }}
      >
        {/* 글래스 배경 */}
        <div
          className="absolute inset-0"
          style={{
            background: "rgba(30,30,34,0.85)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
          }}
        />

        <div className="relative flex flex-col h-full">
          {/* ── 타이틀바 ── */}
          <div
            className="flex items-center gap-3 px-4 h-11 shrink-0 cursor-grab active:cursor-grabbing"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
            onPointerDown={(e) => dragControls.start(e)}
          >
            {/* 신호등 버튼 */}
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff3b30] transition-colors group flex items-center justify-center"
              >
                <X size={7} className="text-[#4d0000] opacity-0 group-hover:opacity-100" />
              </button>
              <button className="w-3 h-3 rounded-full bg-[#febc2e] hover:bg-[#ff9500] transition-colors group flex items-center justify-center">
                <Minus size={7} className="text-[#4d3000] opacity-0 group-hover:opacity-100" />
              </button>
              <button className="w-3 h-3 rounded-full bg-[#28c840] hover:bg-[#30d158] transition-colors group flex items-center justify-center">
                <Square size={6} className="text-[#003000] opacity-0 group-hover:opacity-100" />
              </button>
            </div>

            {/* 네비게이션 */}
            <div className="flex items-center gap-1 ml-2">
              <button className="p-1 rounded hover:bg-white/10 text-white/40">
                <ChevronLeft size={15} />
              </button>
              <button className="p-1 rounded hover:bg-white/10 text-white/40">
                <ChevronRight size={15} />
              </button>
            </div>

            {/* 경로 */}
            <span className="flex-1 text-center text-white/70 text-xs font-medium">
              blair
            </span>

            {/* 뷰 전환 + 검색 */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView("grid")}
                className={`p-1 rounded ${view === "grid" ? "bg-white/15 text-white" : "text-white/40 hover:bg-white/10"}`}
              >
                <Grid2X2 size={14} />
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-1 rounded ${view === "list" ? "bg-white/15 text-white" : "text-white/40 hover:bg-white/10"}`}
              >
                <List size={14} />
              </button>
              <button className="p-1 rounded text-white/40 hover:bg-white/10">
                <Search size={14} />
              </button>
            </div>
          </div>

          {/* ── 바디: 사이드바 + 파일 목록 ── */}
          <div className="flex flex-1 overflow-hidden">
            {/* 사이드바 */}
            <div
              className="w-36 shrink-0 py-3 flex flex-col gap-4 overflow-y-auto"
              style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}
            >
              {SIDEBAR.map((section) => (
                <div key={section.label}>
                  <p className="px-4 text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-1">
                    {section.label}
                  </p>
                  {section.items.map((item) => (
                    <button
                      key={item}
                      className={`w-full text-left px-4 py-1 text-xs rounded transition-colors ${
                        item === "Blair"
                          ? "bg-[#0a84ff]/30 text-white"
                          : "text-white/50 hover:bg-white/08 hover:text-white/80"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              ))}
            </div>

            {/* 파일 영역 */}
            <div className="flex-1 overflow-y-auto p-4">
              {view === "grid" ? (
                <div className="grid grid-cols-4 gap-3">
                  {PROJECTS.map((project) => (
                    <motion.button
                      key={project.id}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelected(project.id)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg text-center transition-colors ${
                        selected === project.id
                          ? "bg-[#0a84ff]/25"
                          : "hover:bg-white/07"
                      }`}
                    >
                      <FileIcon type={project.type} />
                      <span className="text-white/85 text-[11px] leading-tight line-clamp-2">
                        {project.name}
                      </span>
                      {project.tag && (
                        <span
                          className="text-[9px] px-1.5 py-0.5 rounded-full font-medium"
                          style={{
                            background: project.tagColor + "30",
                            color: project.tagColor,
                          }}
                        >
                          {project.tag}
                        </span>
                      )}
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col">
                  {PROJECTS.map((project, i) => (
                    <motion.button
                      key={project.id}
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                      onClick={() => setSelected(project.id)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-left ${
                        selected === project.id ? "bg-[#0a84ff]/25" : ""
                      }`}
                    >
                      <FileIcon type={project.type} />
                      <span className="flex-1 text-white/85 text-xs">
                        {project.name}
                      </span>
                      {project.tag && (
                        <span
                          className="text-[9px] px-1.5 py-0.5 rounded-full font-medium"
                          style={{
                            background: project.tagColor + "30",
                            color: project.tagColor,
                          }}
                        >
                          {project.tag}
                        </span>
                      )}
                      <span className="text-white/30 text-[10px]">{project.date}</span>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── 상태바 ── */}
          <div
            className="px-4 h-7 flex items-center"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <span className="text-white/30 text-[10px]">
              {PROJECTS.length} items
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
