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
              <div className="mb-3 font-mono text-[11px] text-muted">
                {eyebrow}
              </div>
            )}
            {title && (
              <h2 className="font-display text-[32px] md:text-[40px] text-ink">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted md:text-base">
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
