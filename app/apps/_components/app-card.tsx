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
      className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-line bg-surface transition-all duration-300 hover:-translate-y-0.5 hover:border-ink/50 hover:shadow-[0_22px_60px_-30px_var(--card-soft,rgba(10,10,10,0.2))]"
    >
      {/* Accent strip */}
      {accent && (
        <div
          className="absolute inset-x-0 top-0 h-px opacity-60 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: "var(--card-accent)" }}
          aria-hidden
        />
      )}

      {/* Preview */}
      {meta && (
        <div
          className="relative h-36 border-b border-line"
          style={{
            background:
              "linear-gradient(135deg, var(--card-tint) 0%, transparent 75%), var(--color-bg)",
          }}
        >
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
              style={{ background: "rgba(250, 250, 250, 0.28)" }}
              aria-hidden
            >
              <div className="inline-flex items-center gap-1.5 rounded-md border border-line bg-bg/90 px-2.5 py-1 font-mono text-[10px] text-muted shadow-sm">
                <Lock className="h-3 w-3" />
                Locked
              </div>
            </div>
          )}
        </div>
      )}

      {/* Body */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="flex items-start justify-between">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line bg-bg">
              <Icon className="h-[18px] w-[18px] text-ink/80 transition-transform duration-300 group-hover:-rotate-6" />
            </div>
            <Badge tone={tone} dot>
              {locked ? "Locked" : app.status}
            </Badge>
          </div>

          <div className="mt-5 flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted">
            <span>{app.category}</span>
            <span className="text-subtle">·</span>
            <span>{app.kind}</span>
          </div>

          <h3 className="mt-2 font-display text-[17px] text-ink md:text-[18px]">
            {app.title}
          </h3>

          <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
            {app.description}
          </p>
        </div>

        <div className="mt-6 flex items-end justify-between gap-4">
          <div className="flex flex-wrap gap-1.5">
            {app.stack.map((t) => (
              <Pill key={t}>{t}</Pill>
            ))}
          </div>
          <span className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.18em] text-ink">
            {locked ? (
              <>
                Unlock
                <Lock className="h-3.5 w-3.5" />
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
