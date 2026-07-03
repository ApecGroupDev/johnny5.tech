"use client";

import { TrendingUp } from "lucide-react";

export type PreviewKind = "cad" | "rain" | "database" | "map" | "chat";
export type AccentKind = "blue" | "emerald" | "amber" | "violet" | "rose";

export const ACCENTS: Record<
  AccentKind,
  { color: string; tint: string; soft: string }
> = {
  blue: {
    color: "#3b82f6",
    tint: "rgba(59, 130, 246, 0.10)",
    soft: "rgba(59, 130, 246, 0.20)",
  },
  emerald: {
    color: "#10b981",
    tint: "rgba(16, 185, 129, 0.10)",
    soft: "rgba(16, 185, 129, 0.22)",
  },
  amber: {
    color: "#f59e0b",
    tint: "rgba(245, 158, 11, 0.12)",
    soft: "rgba(245, 158, 11, 0.22)",
  },
  violet: {
    color: "#8b5cf6",
    tint: "rgba(139, 92, 246, 0.10)",
    soft: "rgba(139, 92, 246, 0.22)",
  },
  rose: {
    color: "#f43f5e",
    tint: "rgba(244, 63, 94, 0.10)",
    soft: "rgba(244, 63, 94, 0.22)",
  },
};

/* Per-slug preview + accent mapping */
export const APP_META: Record<
  string,
  { preview: PreviewKind; accent: AccentKind }
> = {
  "canopy-configurator": { preview: "cad", accent: "blue" },
  "rain-risk": { preview: "rain", accent: "blue" },
  "site-360": { preview: "database", accent: "emerald" },
  "pulse-360": { preview: "map", accent: "violet" },
  "ruby-queen": { preview: "chat", accent: "rose" },
};

export function PreviewRenderer({ kind }: { kind: PreviewKind }) {
  if (kind === "cad") return <CadPreview />;
  if (kind === "rain") return <RainPreview />;
  if (kind === "database") return <DatabasePreview />;
  if (kind === "map") return <MapPreview />;
  return <ChatPreview />;
}

/* -------------------------------------------------------------------------- */

export function CadPreview() {
  return (
    <div className="w-full max-w-[190px] h-full flex flex-col justify-center relative font-mono text-[9px] text-white/50">
      <div className="absolute top-1 left-1 text-[7px] text-cyan-400/50">
        GRID: 1.0m · ORTHO
      </div>
      <div className="absolute top-1 right-1 text-[7px]">SCALE 1:150</div>

      <div className="relative border border-cyan-500/20 bg-cyan-950/5 h-20 w-full rounded-md flex items-center justify-center overflow-hidden">
        <div className="absolute top-0 bottom-0 left-[25%] border-r border-dashed border-cyan-500/10" />
        <div className="absolute top-0 bottom-0 left-[75%] border-r border-dashed border-cyan-500/10" />
        <div className="absolute top-[40%] bottom-[40%] left-0 right-0 border-y border-dashed border-cyan-500/10" />

        <svg viewBox="0 0 160 60" className="w-full h-full p-2">
          {/* Ground */}
          <line
            x1="10"
            y1="52"
            x2="150"
            y2="52"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
          />

          {/* Columns */}
          <rect
            x="35"
            y="24"
            width="6"
            height="28"
            fill="var(--card-accent)"
            fillOpacity="0.2"
            stroke="var(--card-accent)"
            strokeWidth="1"
          />
          <rect
            x="119"
            y="24"
            width="6"
            height="28"
            fill="var(--card-accent)"
            fillOpacity="0.2"
            stroke="var(--card-accent)"
            strokeWidth="1"
          />

          {/* Canopy Roof Box */}
          <rect
            x="20"
            y="8"
            width="120"
            height="16"
            rx="1.5"
            fill="var(--card-accent)"
            fillOpacity="0.3"
            stroke="var(--card-accent)"
            strokeWidth="1.5"
          />

          {/* Height Dimension */}
          <line
            x1="8"
            y1="8"
            x2="8"
            y2="52"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="0.75"
          />
          <path
            d="M 6 12 L 8 8 L 10 12 M 6 48 L 8 52 L 10 48"
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="0.75"
          />
          <text
            x="6"
            y="32"
            transform="rotate(-90, 6, 32)"
            textAnchor="middle"
            fill="rgba(255,255,255,0.4)"
            style={{ fontSize: "5px" }}
          >
            h: 4.8m
          </text>

          {/* Width Dimension */}
          <line
            x1="20"
            y1="57"
            x2="140"
            y2="57"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="0.75"
          />
          <path
            d="M 24 55 L 20 57 L 24 59 M 136 55 L 140 57 L 136 59"
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="0.75"
          />
          <text
            x="80"
            y="56"
            textAnchor="middle"
            fill="rgba(255,255,255,0.4)"
            style={{ fontSize: "5px" }}
          >
            w: 24.5m
          </text>
        </svg>
      </div>

      <div className="mt-1 flex items-center justify-between text-[8px]">
        <span>SPEC: APEC-STD-3</span>
        <span className="text-cyan-400">GENERATE CAD ◈</span>
      </div>
    </div>
  );
}

export function RainPreview() {
  const days = [
    { label: "M", pct: 12, cls: "go" },
    { label: "T", pct: 35, cls: "chance" },
    { label: "W", pct: 78, cls: "nogo" },
    { label: "T", pct: 22, cls: "chance" },
    { label: "F", pct: 8, cls: "go" },
  ];
  const colors = {
    go: {
      bg: "rgba(21, 128, 61, 0.12)",
      border: "rgba(21, 128, 61, 0.30)",
      text: "#10b981",
    },
    chance: {
      bg: "rgba(180, 83, 9, 0.12)",
      border: "rgba(180, 83, 9, 0.30)",
      text: "#f59e0b",
    },
    nogo: {
      bg: "rgba(185, 28, 28, 0.12)",
      border: "rgba(185, 28, 28, 0.30)",
      text: "#ef4444",
    },
  };
  return (
    <div className="flex items-end gap-1.5 font-mono text-[9px] h-full justify-center">
      {days.map((d, i) => {
        const c = colors[d.cls as keyof typeof colors];
        return (
          <div key={i} className="flex flex-col items-center gap-1">
            <div
              className="flex h-12 w-10 flex-col items-center justify-center rounded-md border backdrop-blur-xs transition-transform duration-300 hover:scale-105"
              style={{ background: c.bg, borderColor: c.border, color: c.text }}
            >
              <span className="text-[12px] font-bold leading-none">
                {d.pct}%
              </span>
              <span className="mt-0.5 text-[6.5px] font-extrabold uppercase tracking-wider opacity-85">
                {d.cls === "go" ? "Go" : d.cls === "chance" ? "Chc" : "No"}
              </span>
            </div>
            <span className="text-white/30 text-[7.5px]">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export function DatabasePreview() {
  return (
    <div className="w-full max-w-[190px] h-full flex flex-col justify-center relative font-mono text-[9px]">
      <div className="flex items-center justify-between text-[8px] text-white/30 mb-1">
        <span>SCHEMA: site_db</span>
        <span>INDEXED: 1,433</span>
      </div>

      <div className="border border-emerald-500/20 bg-emerald-950/3 rounded-md p-2 space-y-1">
        <div className="flex justify-between items-center border-b border-white/5 pb-1">
          <span className="text-white/60 font-semibold">
            APEC SITE ID: #360
          </span>
          <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[6.5px] px-1 rounded font-bold">
            ACTIVE
          </span>
        </div>

        <div className="space-y-0.5 text-[7.5px] text-white/40">
          <div className="flex justify-between">
            <span>BRAND:</span>
            <span className="text-white/80">ExxonMobil</span>
          </div>
          <div className="flex justify-between">
            <span>POS:</span>
            <span className="text-white/80">Commander 16.2</span>
          </div>
          <div className="flex justify-between">
            <span>DISPENSERS:</span>
            <span className="text-white/80">12 x Wayne Ovation</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MapPreview() {
  return (
    <div className="w-full max-w-[190px] h-full flex flex-col justify-center relative font-mono text-[9px] text-white/50">
      <div className="flex items-center justify-between text-[8px] mb-1">
        <span className="text-violet-400 flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
          TELEMETRY LIVE
        </span>
        <span>ATLANTA, GA</span>
      </div>

      <div className="relative border border-violet-500/20 bg-violet-950/5 h-20 w-full rounded-md flex items-center justify-center overflow-hidden">
        {/* Radar Sweeper */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.03)_0%,transparent_60%)]" />
        <div className="absolute w-full h-full bg-linear-to-tr from-transparent to-violet-500/5 animate-[spin_5s_linear_infinite]" />

        {/* Radar grid coordinates */}
        <div className="absolute w-12 h-12 rounded-full border border-violet-500/15" />
        <div className="absolute w-20 h-20 rounded-full border border-violet-500/10" />

        {/* Radar Pins */}
        <div className="absolute top-[25%] left-[30%]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-400" />
          </span>
          <span className="absolute left-3 top-[-3px] text-[6.5px] bg-black/85 px-1 py-0.5 rounded border border-white/10 text-white/90">
            CREW 1
          </span>
        </div>

        <div className="absolute bottom-[30%] right-[25%]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
          </span>
          <span className="absolute left-2.5 top-[-4px] text-[6.5px] bg-black/85 px-1 py-0.5 rounded border border-white/10 text-white/70">
            SITE #204
          </span>
        </div>
      </div>
    </div>
  );
}

export function ChatPreview() {
  return (
    <div className="w-full max-w-[190px] h-full flex flex-col justify-center gap-1 font-mono text-[8.5px] relative">
      <div className="flex items-center gap-1.5 self-end max-w-[85%] rounded-lg bg-rose-500/10 border border-rose-500/20 px-2 py-1 text-rose-300 leading-tight">
        POS offline at Site #102?
      </div>
      <div className="flex flex-col gap-0.5 self-start max-w-[90%] rounded-lg bg-black/60 border border-white/5 p-1.5 text-white/50 backdrop-blur-xs">
        <div className="text-[7px] font-bold text-rose-400/80">
          RUBY QUEEN SYSTEM
        </div>
        <div className="leading-tight text-[8px]">
          POS reset library search... Found reset manual inside
          peggy_support/gilbarco.pdf.
        </div>
      </div>
    </div>
  );
}
