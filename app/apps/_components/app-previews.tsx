"use client";

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
  { preview: string; accent: AccentKind }
> = {
  "canopy-configurator": { preview: "cad", accent: "blue" },
  "rain-risk": { preview: "rain", accent: "blue" },
  "site-360": { preview: "database", accent: "emerald" },
  "pulse-360": { preview: "map", accent: "violet" },
  "ruby-queen": { preview: "chat", accent: "rose" },
};
