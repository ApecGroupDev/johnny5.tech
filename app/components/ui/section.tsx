import { cn } from "@/lib/cn";
import { Container } from "./container";

type SectionProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  eyebrow?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  containerSize?: "sm" | "md" | "lg";
  bare?: boolean;
};

export function Section({
  eyebrow,
  title,
  description,
  className,
  children,
  containerSize = "lg",
  bare = false,
  ...rest
}: SectionProps) {
  return (
    <section
      className={cn("relative py-16 md:py-20", className)}
      {...rest}
    >
      <Container size={containerSize}>
        {!bare && (eyebrow || title || description) && (
          <div className="mb-10 md:mb-12 max-w-2xl">
            {eyebrow && (
              <div className="mb-3 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-400">
                <span className="h-1 w-1 rounded-full bg-cyan-400 animate-pulse" />
                {eyebrow}
              </div>
            )}
            {title && (
              <h2 className="font-display text-[32px] md:text-[38px] font-extrabold text-white tracking-tight leading-tight">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-white/50 md:text-[15px]">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}
