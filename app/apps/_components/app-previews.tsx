"use client";

import { TrendingUp } from "lucide-react";

export type PreviewKind = "dashboard" | "score" | "goals" | "networth" | "rain" | "chat";
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
  "personal-finance": { preview: "dashboard", accent: "blue" },
  "financial-health-score": { preview: "score", accent: "emerald" },
  "goal-based-savings-planner": { preview: "goals", accent: "amber" },
  "net-worth-tracker": { preview: "networth", accent: "violet" },
  "rain-risk": { preview: "rain", accent: "blue" },
  r2d2: { preview: "chat", accent: "rose" },
};

export function PreviewRenderer({ kind }: { kind: PreviewKind }) {
  if (kind === "dashboard") return <DashboardPreview />;
  if (kind === "score") return <ScorePreview />;
  if (kind === "goals") return <GoalsPreview />;
  if (kind === "rain") return <RainPreview />;
  if (kind === "chat") return <ChatPreview />;
  return <NetWorthPreview />;
}

/* -------------------------------------------------------------------------- */

export function DashboardPreview() {
  const pts = [0.55, 0.42, 0.6, 0.5, 0.72, 0.65, 0.85];
  const path = pts
    .map((v, i) => `${i === 0 ? "M" : "L"} ${8 + i * 28} ${70 - v * 55}`)
    .join(" ");
  const area = `${path} L ${8 + (pts.length - 1) * 28} 70 L 8 70 Z`;
  return (
    <div className="w-full max-w-[200px] space-y-2">
      <div className="flex items-center gap-2">
        <div
          className="rounded-sm px-1.5 py-0.5 font-mono text-[9px]"
          style={{
            background: "var(--card-tint)",
            color: "var(--card-accent)",
          }}
        >
          $12,480
        </div>
        <div className="font-mono text-[9px] text-muted">+ 4.2% mtd</div>
      </div>
      <svg
        viewBox="0 0 180 80"
        className="h-[60px] w-full"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path d={area} fill="var(--card-accent)" fillOpacity="0.15" />
        <path
          d={path}
          fill="none"
          stroke="var(--card-accent)"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {pts.map((v, i) => (
          <circle
            key={i}
            cx={8 + i * 28}
            cy={70 - v * 55}
            r="2"
            fill="var(--card-accent)"
          />
        ))}
      </svg>
    </div>
  );
}

export function ScorePreview() {
  return (
    <svg
      viewBox="0 0 200 110"
      className="h-[90px] w-full max-w-[180px]"
      aria-hidden
    >
      <path
        d="M 20 100 A 80 80 0 0 1 180 100"
        fill="none"
        stroke="var(--card-accent)"
        strokeOpacity="0.18"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path
        d="M 20 100 A 80 80 0 0 1 155 45"
        fill="none"
        stroke="var(--card-accent)"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <text
        x="100"
        y="90"
        textAnchor="middle"
        className="fill-ink"
        style={{ font: "600 30px var(--font-sans)", letterSpacing: "-0.03em" }}
      >
        82
      </text>
      <text
        x="100"
        y="108"
        textAnchor="middle"
        style={{
          font: "500 9px var(--font-mono)",
          letterSpacing: "0.08em",
          fill: "var(--card-accent)",
        }}
      >
        SCORE / 100
      </text>
    </svg>
  );
}

export function GoalsPreview() {
  const goals = [
    { label: "Emergency", pct: 78 },
    { label: "House", pct: 42 },
    { label: "Vacation", pct: 91 },
  ];
  return (
    <div className="w-full max-w-[200px] space-y-2 font-mono text-[10px]">
      {goals.map((g) => (
        <div key={g.label} className="space-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-ink">{g.label}</span>
            <span style={{ color: "var(--card-accent)" }}>{g.pct}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${g.pct}%`,
                background: "var(--card-accent)",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function NetWorthPreview() {
  const pts = [0.25, 0.32, 0.3, 0.45, 0.5, 0.6, 0.72, 0.88];
  const path = pts
    .map((v, i) => `${i === 0 ? "M" : "L"} ${6 + i * 24} ${70 - v * 55}`)
    .join(" ");
  const area = `${path} L ${6 + (pts.length - 1) * 24} 70 L 6 70 Z`;
  return (
    <div className="w-full max-w-[200px] space-y-2">
      <div className="flex items-center justify-between">
        <div className="font-mono text-[9px] text-muted">net worth</div>
        <div
          className="inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 font-mono text-[9px]"
          style={{
            background: "var(--card-tint)",
            color: "var(--card-accent)",
          }}
        >
          <TrendingUp className="h-2.5 w-2.5" />
          +18.3%
        </div>
      </div>
      <svg
        viewBox="0 0 200 80"
        className="h-[60px] w-full"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path d={area} fill="var(--card-accent)" fillOpacity="0.18" />
        <path
          d={path}
          fill="none"
          stroke="var(--card-accent)"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
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
    go: { bg: "rgba(21, 128, 61, 0.12)", border: "rgba(21, 128, 61, 0.30)", text: "#15803d" },
    chance: { bg: "rgba(180, 83, 9, 0.12)", border: "rgba(180, 83, 9, 0.30)", text: "#b45309" },
    nogo: { bg: "rgba(185, 28, 28, 0.12)", border: "rgba(185, 28, 28, 0.30)", text: "#b91c1c" },
  };
  return (
    <div className="flex items-end gap-1.5 font-mono text-[9px]">
      {days.map((d, i) => {
        const c = colors[d.cls as keyof typeof colors];
        return (
          <div key={i} className="flex flex-col items-center gap-1">
            <div
              className="flex h-12 w-10 flex-col items-center justify-center rounded-md border"
              style={{ background: c.bg, borderColor: c.border, color: c.text }}
            >
              <span className="text-[13px] font-bold leading-none">{d.pct}%</span>
              <span className="mt-0.5 text-[7px] font-extrabold uppercase tracking-wider opacity-80">
                {d.cls === "go" ? "Go" : d.cls === "chance" ? "Chc" : "No"}
              </span>
            </div>
            <span className="text-muted">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export function ChatPreview() {
  return (
    <div className="flex w-full max-w-[180px] flex-col gap-2">
      <div
        className="self-end rounded-t-xl rounded-bl-xl px-3 py-1.5 font-mono text-[9px]"
        style={{ background: "var(--card-accent)", color: "#fff" }}
      >
        what did I decide about OWL?
      </div>
      <div
        className="w-11/12 self-start rounded-t-xl rounded-br-xl px-3 py-1.5 font-mono text-[9px]"
        style={{
          background: "var(--card-tint)",
          border: "1px solid var(--card-soft)",
          color: "var(--card-accent)",
        }}
      >
        <div className="mb-1 opacity-70">R2D2</div>
        Here is what you decided (from your OWL decision note)...
      </div>
    </div>
  );
}
