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
    eyebrow: "Private",
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
  const scoped = APPS.filter((a) => {
    if (a.kind !== kind) return false;
    if (a.hiddenFrom && userEmail && a.hiddenFrom.includes(userEmail)) return false;
    if (a.allowedUsers && (!userEmail || !a.allowedUsers.includes(userEmail))) return false;
    return true;
  });
  const defaults = DEFAULTS[kind];

  return (
    <Section
      id={isPrivate ? "private" : "free"}
      eyebrow={eyebrow ?? defaults.eyebrow}
      title={title ?? defaults.title}
      description={description ?? defaults.description}
    >
      {/* Locked banner (private + unauthenticated, page variant only) */}
      {!isTeaser && isPrivate && !isAuthenticated && (
        <div
          className="mb-8 flex items-center justify-between gap-4 rounded-lg border border-line bg-surface px-4 py-3"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, rgba(10,10,10,0.03) 0px, rgba(10,10,10,0.03) 1px, transparent 1px, transparent 8px)",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-line bg-bg">
              <Lock className="h-4 w-4 text-ink/70" />
            </div>
            <div>
              <div className="text-[13.5px] font-medium text-ink">
                These apps are locked.
              </div>
              <div className="text-[12px] text-muted">
                Sign in to launch any app in your browser.
              </div>
            </div>
          </div>
          <Link
            href="/login?callbackUrl=/apps"
            className="inline-flex items-center gap-1.5 rounded-md bg-ink px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-bg transition-all hover:bg-ink/85"
          >
            Sign in
          </Link>
        </div>
      )}

      {/* Grid / empty */}
      {scoped.length === 0 ? (
        isTeaser ? (
          <div className="rounded-lg border border-line bg-surface/60 px-6 py-10 text-center">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted">
              Coming soon
            </div>
            <p className="mt-2 text-[14px] text-ink/80">
              {isPrivate
                ? "Private tools are on the way. In the meantime, take a look at the free apps."
                : "Free apps are on the way. In the meantime, take a look at the private apps."}
            </p>
            <Link
              href={isPrivate ? "/free" : "/apps"}
              className="link-underline mt-4 inline-flex items-center gap-1 font-mono text-[12px] text-ink"
            >
              {isPrivate ? "browse free apps" : "access private apps"}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-line bg-surface/60 p-16 text-center">
            <div className="mx-auto mb-3 inline-flex h-10 w-10 items-center justify-center rounded-md border border-line bg-bg">
              <Sparkles className="h-4 w-4 text-muted" />
            </div>
            <p className="font-display text-2xl text-ink">No apps yet.</p>
            <p className="mt-2 text-sm text-muted">
              New {isPrivate ? "private" : "free"} tools will show up here as
              they ship.
            </p>
          </div>
        )
      ) : (
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:gap-4">
          <span className="inline-flex items-center gap-2 font-mono text-[11px] text-muted">
            {isPrivate ? (
              <Lock className="h-3 w-3" />
            ) : (
              <Sparkles className="h-3 w-3" />
            )}
            {scoped.length} {scoped.length === 1 ? "app" : "apps"} ·{" "}
            {isPrivate
              ? isAuthenticated
                ? "full access"
                : "invite-only"
              : "open access"}
          </span>
          {isTeaser ? (
            <Link
              href={isPrivate ? "/apps" : "/free"}
              className="link-underline inline-flex items-center gap-1 font-mono text-[12px] text-ink"
            >
              open {isPrivate ? "private" : "free"} portal
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            isPrivate &&
            !isAuthenticated && (
              <Link
                href="/login?callbackUrl=/apps"
                className="link-underline inline-flex items-center gap-1 font-mono text-[12px] text-ink"
              >
                request access
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            )
          )}
        </div>
      )}
    </Section>
  );
}
