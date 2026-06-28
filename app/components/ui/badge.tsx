import { cn } from "@/lib/cn";

type BadgeTone = "neutral" | "live" | "wip" | "private" | "accent";

const tones: Record<BadgeTone, string> = {
  neutral: "bg-ink/5 text-ink/70 border-ink/10",
  live: "bg-emerald-50 text-emerald-700 border-emerald-200",
  wip: "bg-amber-50 text-amber-700 border-amber-200",
  private: "bg-ink/5 text-ink/80 border-line-strong",
  accent: "bg-accent/10 text-accent-ink border-accent/20",
};

export function Badge({
  tone = "neutral",
  className,
  children,
  dot = false,
}: {
  tone?: BadgeTone;
  className?: string;
  children: React.ReactNode;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10.5px] uppercase tracking-[0.14em]",
        tones[tone],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            tone === "live" && "bg-emerald-500",
            tone === "wip" && "bg-amber-500",
            tone === "private" && "bg-ink/60",
            tone === "accent" && "bg-accent",
            tone === "neutral" && "bg-ink/40"
          )}
        />
      )}
      {children}
    </span>
  );
}

export function Pill({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-line bg-surface px-1.5 py-0.5 font-mono text-[10.5px] text-muted",
        className
      )}
    >
      {children}
    </span>
  );
}
