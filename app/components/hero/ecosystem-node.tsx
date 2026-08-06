"use client";

import { forwardRef, useEffect, useRef } from "react";
import Image from "next/image";

export const EcosystemNode = forwardRef<
  HTMLDivElement,
  {
    name: string;
    tag: string;
    accentColor?: string;
    logoSrc: string;
  }
>(function EcosystemNode({ name, tag, accentColor = "#06b6d4", logoSrc }, ref) {
  return (
    <div
      ref={ref}
      className="relative flex items-center gap-3.5 rounded-lg border px-3.5 py-3 backdrop-blur-sm transition-all duration-300 hover:scale-[1.03] hover:border-white/30 hover:shadow-[0_0_32px_rgba(6,182,212,0.25)] hover:bg-black/90"
      style={{
        borderColor: `${accentColor}40`,
        background:
          "linear-gradient(135deg, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.72) 100%)",
        boxShadow: `0 0 24px ${accentColor}18, inset 0 1px 0 rgba(255,255,255,0.05)`,
      }}
    >
      <div
        className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full"
        style={{ background: accentColor, boxShadow: `0 0 8px ${accentColor}` }}
      />

      <div
        className="ml-1.5 relative flex h-11 w-[68px] shrink-0 items-center justify-center rounded-md overflow-hidden bg-white p-1"
        style={{ border: `1px solid ${accentColor}40` }}
      >
        <Image
          src={logoSrc}
          alt={name}
          fill
          className="object-contain p-1"
          sizes="60px"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate text-[13.5px] font-semibold tracking-tight text-white/90">
          {name}
        </div>
        <div
          className="mt-0.5 font-mono text-[9.5px] uppercase tracking-[0.18em]"
          style={{ color: `${accentColor}90` }}
        >
          {tag}
        </div>
      </div>

      <div className="shrink-0">
        <span className="relative flex h-1.5 w-1.5">
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
            style={{ background: accentColor }}
          />
          <span
            className="relative inline-flex h-1.5 w-1.5 rounded-full"
            style={{ background: accentColor }}
          />
        </span>
      </div>
    </div>
  );
});

/* ─────────────────────────────────────────────────────────────
   Stat badge — slim
 ───────────────────────────────────────────────────────────── */
export function StatBadge({
  value,
  label,
  icon,
}: {
  value: string;
  label: string;
  icon: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/3 px-3 py-1.5 backdrop-blur-sm">
      <span className="font-mono text-[10px] text-white/28">{icon}</span>
      <span className="font-display text-[13px] font-bold text-white">
        {value}
      </span>
      <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-white/38">
        {label}
      </span>
    </div>
  );
}

