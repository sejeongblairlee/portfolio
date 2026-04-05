"use client";

import dynamic from "next/dynamic";

const ThreeScene = dynamic(() => import("./ThreeScene"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#F5F5F7",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          color: "rgba(0,0,0,0.2)",
          fontSize: 11,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          fontFamily: "Pretendard, sans-serif",
        }}
      >
        Loading...
      </span>
    </div>
  ),
});

export default function ThreeSceneLoader() {
  return <ThreeScene />;
}
