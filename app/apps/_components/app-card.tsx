import Link from "next/link";
import { ArrowUpRight, Lock } from "lucide-react";
import { Badge, Pill } from "@/app/components/ui/badge";
import type { AppEntry } from "./app-data";
import { ACCENTS, APP_META } from "./app-previews";

export function AppCard({
  app,
  locked = false,
}: {
  app: AppEntry;
  locked?: boolean;
}) {
  const Icon = app.icon;
  const tone =
    app.status === "Live" ? "live" : app.status === "WIP" ? "wip" : "private";
  const href = locked
    ? `/login?callbackUrl=${encodeURIComponent(app.href)}`
    : app.href;

  const meta = APP_META[app.slug];
  const accent = meta ? ACCENTS[meta.accent] : null;

  return (
    <Link
      href={href}
      style={
        accent
          ? ({
              "--card-accent": accent.color,
              "--card-tint": accent.tint,
              "--card-soft": accent.soft,
            } as React.CSSProperties)
          : undefined
      }
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-white/12 bg-[#13131a]/95 backdrop-blur-md transition-all duration-300 hover:-translate-y-3.5 hover:scale-[1.02] hover:border-(--card-accent,rgba(255,255,255,0.35)) hover:shadow-[0_30px_70px_-10px_var(--card-soft,rgba(0,0,0,0.65)),0_0_30px_var(--card-soft,rgba(0,0,0,0.2))] shadow-[0_12px_40px_-12px_rgba(0,0,0,0.9),0_0_15px_var(--card-soft,rgba(0,0,0,0.03))]"
    >
      {/* Accent glow border overlay on hover */}
      <div className="absolute inset-0 rounded-xl bg-linear-to-br from-white/2 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />

      {/* Ambient background accent glow */}
      {accent && (
        <div
          className="absolute -inset-20 rounded-full opacity-0 blur-[50px] transition-all duration-500 group-hover:opacity-25 pointer-events-none"
          style={{
            background: `radial-gradient(circle, var(--card-accent) 0%, transparent 60%)`,
          }}
        />
      )}

      {/* Top neon strip */}
      {accent && (
        <div
          className="absolute inset-x-0 top-0 h-[2px] opacity-75 transition-opacity duration-300 group-hover:opacity-100 group-hover:blur-[0.5px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--card-accent), transparent)",
          }}
          aria-hidden
        />
      )}

      {/* Mini Node Active Banner */}
      {meta && (
        <div
          className="relative h-10 border-b border-white/5 overflow-hidden flex items-center justify-between px-4"
          style={{
            background:
              "linear-gradient(90deg, var(--card-tint) 0%, transparent 75%), #050507",
          }}
        >
          {/* Subtle grid pattern inside mini banner */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `linear-gradient(to right, var(--card-accent) 1px, transparent 1px), linear-gradient(to bottom, var(--card-accent) 1px, transparent 1px)`,
              backgroundSize: "8px 8px",
            }}
            aria-hidden
          />

          <div className="relative flex items-center gap-1.5">
            <span
              className="h-1 w-1 rounded-full animate-pulse"
              style={{
                backgroundColor: "var(--card-accent)",
                boxShadow: `0 0 6px var(--card-accent)`,
              }}
            />
            <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/30">
              {app.category} REGISTRY
            </span>
          </div>

          {locked ? (
            <div className="relative inline-flex items-center gap-1 font-mono text-[7.5px] uppercase tracking-wider text-cyan-400/80">
              <Lock className="h-2.5 w-2.5" />
              LOCKED
            </div>
          ) : (
            <div className="relative inline-flex items-center gap-1 font-mono text-[7.5px] uppercase tracking-wider text-emerald-400/80 animate-pulse">
              <span>ONLINE</span>
            </div>
          )}
        </div>
      )}

      {/* Body */}
      <div className="flex flex-1 flex-col justify-between p-5 relative z-10">
        <div>
          <div className="flex items-start justify-between">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-black/40 backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <Icon
                className="h-5 w-5 text-white/80 transition-transform duration-300 group-hover:-rotate-6"
                style={accent ? { color: "var(--card-accent)" } : undefined}
              />
            </div>
            <Badge tone={tone} dot>
              {locked ? "Locked" : app.status}
            </Badge>
          </div>

          <div className="mt-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
            <span>{app.category}</span>
            <span className="text-white/20">·</span>
            <span>{app.kind}</span>
          </div>

          <h3 className="mt-2 font-display text-[18px] font-bold text-white group-hover:text-(--card-accent,rgba(255,255,255,0.9)) transition-colors duration-300">
            {app.title}
          </h3>

          <p className="mt-2 text-[12px] leading-relaxed text-white/40 line-clamp-2">
            {app.description}
          </p>
        </div>

        <div className="mt-6 flex items-end justify-between gap-4">
          <div className="flex flex-wrap gap-1.5">
            {app.stack.map((t) => (
              <Pill key={t}>{t}</Pill>
            ))}
          </div>
          <span className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.18em] text-white/70 group-hover:text-white transition-colors duration-300">
            {locked ? (
              <>
                Unlock
                <Lock className="h-3.5 w-3.5 text-white/60" />
              </>
            ) : (
              <>
                Open
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </>
            )}
          </span>
        </div>
      </div>
    </Link>
  );
}
