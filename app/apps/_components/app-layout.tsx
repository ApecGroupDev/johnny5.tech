import Link from "next/link";
import { ArrowLeft, ExternalLink, Lock } from "lucide-react";
import { Container } from "@/app/components/ui/container";
import { Badge, Pill } from "@/app/components/ui/badge";
import type { AppEntry } from "./app-data";

export function AppDetailLayout({
  app,
  embedUrl,
  locked = false,
}: {
  app: AppEntry;
  embedUrl: string;
  locked?: boolean;
}) {
  const tone =
    app.status === "Live" ? "live" : app.status === "WIP" ? "wip" : "private";

  let displayUrl = `${app.slug}.streamlit.app`;
  try {
    if (embedUrl) {
      displayUrl = new URL(embedUrl).hostname;
    }
  } catch {
    // Keep fallback
  }

  return (
    <div className="relative">
      <Container>
        <div className="pt-10 pb-6">
          <Link
            href="/#apps"
            className="link-underline font-mono text-[11px] uppercase tracking-[0.18em] text-muted"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All apps
          </Link>

          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted">
                <span>{app.category}</span>
                <span className="text-subtle">·</span>
                <span>{app.kind}</span>
              </div>
              <h1 className="mt-2 font-display text-4xl leading-tight tracking-tight text-ink md:text-5xl">
                {app.title}
              </h1>
              <p className="mt-3 text-muted md:text-lg">{app.description}</p>
            </div>

            <div className="flex flex-col items-start gap-3 md:items-end">
              <Badge tone={tone} dot>
                {locked ? "Locked" : app.status}
              </Badge>
              <div className="flex flex-wrap gap-1.5">
                {app.stack.map((t) => (
                  <Pill key={t}>{t}</Pill>
                ))}
              </div>
              <a
                href={embedUrl.replace("?embed=true", "")}
                target="_blank"
                rel="noreferrer"
                className="link-underline font-mono text-[11px] uppercase tracking-[0.18em] text-ink"
              >
                Open in new tab
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Runtime frame */}
        <div className="relative overflow-hidden rounded-lg border border-line bg-surface shadow-[0_20px_60px_-30px_rgba(10,10,10,0.2)]">
          <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
              <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
              <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
            </div>
            <span className="font-mono text-[11px] text-muted">
              {displayUrl}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-600">
              ● live
            </span>
          </div>

          {locked ? (
            <LockedState />
          ) : (
            <iframe
              src={embedUrl}
              title={app.title}
              className="h-[78vh] min-h-[640px] w-full bg-bg"
              loading="lazy"
            />
          )}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 border-t border-line pt-8 md:grid-cols-3">
          <Info label="Status" value={locked ? "Locked" : app.status} />
          <Info label="Category" value={app.category} />
          <Info label="Kind" value={app.kind} />
        </div>

        <div className="h-24" />
      </Container>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted">
        {label}
      </div>
      <div className="mt-1 font-display text-xl text-ink">{value}</div>
    </div>
  );
}

function LockedState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-20 text-center">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-line bg-bg">
        <Lock className="h-5 w-5 text-ink/70" />
      </div>
      <h2 className="font-display text-3xl text-ink">Private app</h2>
      <p className="max-w-md text-sm text-muted">
        Sign in to access this private application and its underlying data.
      </p>
      <Link
        href="/login"
        className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm text-bg transition hover:bg-ink/85"
      >
        Sign in
      </Link>
    </div>
  );
}
