import Link from "next/link";
import { Lock, ArrowUpRight, Sparkles } from "lucide-react";
import { Section } from "@/app/components/ui/section";
import { Reveal } from "@/app/components/motion/reveal";
import { AppCard } from "./app-card";
import { APPS, type AppKind } from "./app-data";

type Props = {
  kind: AppKind;
  isAuthenticated: boolean;
  variant?: "page" | "teaser";
  userEmail?: string | null;
  eyebrow?: string;
  title?: string;
  description?: string;
};

const DEFAULTS = {
  Private: {
    eyebrow: "Apps",
    title: "Behind the sign-in wall.",
    description:
      "A controlled workspace for tools that touch personal data or need longer runtimes. Access is by invitation — sign in to run them.",
  },
  Free: {
    eyebrow: "Free",
    title: "Tools anyone can use.",
    description:
      "Open-access Python apps for quick tasks, experimentation, and everyday workflows. No sign-in required.",
  },
};

export function AppsSection({
  kind,
  isAuthenticated,
  variant = "page",
  userEmail,
  eyebrow,
  title,
  description,
}: Props) {
  const isPrivate = kind === "Private";
  const isTeaser = variant === "teaser";
  const scoped = APPS.filter((a) => a.kind === kind);
  const defaults = DEFAULTS[kind];

  return (
    <Section
      id="apps"
      eyebrow={eyebrow ?? defaults.eyebrow}
      title={title ?? defaults.title}
      description={description ?? defaults.description}
      className="relative overflow-hidden"
    >
      {/* Background neon glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[550px] rounded-full bg-indigo-500/[0.03] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[350px] h-[350px] rounded-full bg-cyan-500/[0.015] blur-[100px] pointer-events-none" />

      {/* Locked banner (private + unauthenticated, page variant only) */}
      {!isTeaser && isPrivate && !isAuthenticated && (
        <div
          className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-white/5 bg-zinc-950/80 px-5 py-4 shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-md relative overflow-hidden"
        >
          {/* subtle glowing cyan accent line */}
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          
          <div className="flex items-center gap-3">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-black/40 backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <Lock className="h-4 w-4 text-cyan-400" />
            </div>
            <div>
              <div className="text-[13.5px] font-semibold text-white">
                Workspace Protected
              </div>
              <div className="text-[12.5px] text-white/45">
                Sign in to launch verified secure apps in your terminal session.
              </div>
            </div>
          </div>
          <Link
            href="/login?callbackUrl=/"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-black transition-all hover:opacity-90 shadow-[0_0_15px_rgba(6,182,212,0.2)] cursor-pointer"
            style={{ background: "linear-gradient(135deg, #06b6d4, #818cf8)" }}
          >
            Authenticate
          </Link>
        </div>
      )}

      {/* Grid / empty */}
      {scoped.length === 0 ? (
        isTeaser ? (
          <div className="rounded-xl border border-white/5 bg-zinc-950/80 backdrop-blur-md px-6 py-12 text-center shadow-[0_15px_30px_rgba(0,0,0,0.3)]">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
              Coming soon
            </div>
            <p className="mt-2 text-[14px] text-white/80">
              Apps are on the way.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-white/10 bg-zinc-950/40 p-16 text-center shadow-[0_15px_30px_rgba(0,0,0,0.2)]">
            <div className="mx-auto mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-black/40 backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <Sparkles className="h-4 w-4 text-cyan-400" />
            </div>
            <p className="font-display text-2xl font-bold text-white">No apps yet.</p>
            <p className="mt-2 text-sm text-white/45">
              New apps will show up here as they ship.
            </p>
          </div>
        )
      ) : (
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 relative z-10">
          {scoped.map((app, i) => (
            <Reveal key={app.slug} delay={i * 0.05} as="li">
              <AppCard
                app={app}
                locked={!isTeaser && isPrivate && !isAuthenticated}
              />
            </Reveal>
          ))}
        </ul>
      )}

      {/* Footer row */}
      {(scoped.length > 0 || !isTeaser) && (
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:gap-4 relative z-10">
          <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
            <Lock className="h-3.5 w-3.5 text-cyan-400" />
            {scoped.length} {scoped.length === 1 ? "app" : "apps"} loaded ·{" "}
            {isAuthenticated ? "Session Active" : "Verification Required"}
          </span>
          {isTeaser ? (
            <Link
              href="/apps"
              className="link-underline inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.12em] text-white/60 hover:text-white"
            >
              open portal
              <ArrowUpRight className="h-3.5 w-3.5 text-cyan-400" />
            </Link>
          ) : (
            isPrivate &&
            !isAuthenticated && (
              <Link
                href="/login?callbackUrl=/"
                className="link-underline inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.12em] text-white/60 hover:text-white"
              >
                request access
                <ArrowUpRight className="h-3.5 w-3.5 text-cyan-400" />
              </Link>
            )
          )}
        </div>
      )}
    </Section>
  );
}
