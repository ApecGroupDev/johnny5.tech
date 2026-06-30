import Link from "next/link";
import { ArrowUpRight, Lock } from "lucide-react";
import { Badge, Pill } from "@/app/components/ui/badge";
import type { AppEntry } from "./app-data";
import { ACCENTS, APP_META, PreviewRenderer } from "./app-previews";

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
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-white/5 bg-zinc-950/80 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-white/20 hover:shadow-[0_30px_60px_-15px_var(--card-soft,rgba(10,10,10,0.25))]"
    >
      {/* Accent glow border overlay on hover */}
      <div className="absolute inset-0 rounded-xl bg-linear-to-br from-white/2 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />

      {/* Ambient background accent glow */}
      {accent && (
        <div
          className="absolute -inset-20 rounded-full opacity-0 blur-[50px] transition-all duration-500 group-hover:opacity-10 pointer-events-none"
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

      {/* Preview */}
      {meta && (
        <div
          className="relative h-36 border-b border-white/5"
          style={{
            background:
              "linear-gradient(135deg, var(--card-tint) 0%, transparent 65%), #030303",
          }}
        >
          {/* Subtle grid pattern inside preview */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(to right, var(--card-accent) 1px, transparent 1px), linear-gradient(to bottom, var(--card-accent) 1px, transparent 1px)`,
              backgroundSize: "16px 16px",
            }}
            aria-hidden
          />

          <div
            className="pointer-events-none absolute inset-0 opacity-[0.5]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, rgba(10,10,10,0.04) 0px, rgba(10,10,10,0.04) 1px, transparent 1px, transparent 8px)",
            }}
            aria-hidden
          />
          <div className="relative flex h-full w-full items-center justify-center p-4">
            <PreviewRenderer kind={meta.preview} />
          </div>

          {locked && (
            <div
              className="pointer-events-none absolute inset-0 flex items-center justify-center backdrop-blur-[2px]"
              style={{ background: "rgba(0, 0, 0, 0.45)" }}
              aria-hidden
            >
              <div className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-black/90 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-white/50 shadow-md">
                <Lock className="h-3 w-3 text-cyan-400" />
                Locked App
              </div>
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

          <p className="mt-2 text-[13px] leading-relaxed text-white/45">
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
