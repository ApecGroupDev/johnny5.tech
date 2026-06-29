import { Section } from "../components/ui/section";
import { Reveal } from "../components/motion/reveal";

export default function LoginPage() {
  return (
    <Section id="login" className="pt-16 pb-24 md:pt-24 md:pb-32">
      <Reveal>
        <div className="mx-auto max-w-sm">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
            Authentication
          </p>
          <h1 className="mt-4 font-display text-[32px] leading-[1.05] text-ink sm:text-4xl">
            Sign in
          </h1>
          <p className="mt-3 text-[14px] leading-relaxed text-muted">
            Access restricted experiments and private tools.
          </p>

          <div className="mt-10 rounded-lg border border-line bg-surface/40 p-6">
            <label className="block">
              <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
                Email
              </span>
              <input
                type="email"
                placeholder="you@example.com"
                className="mt-2 block w-full rounded-md border border-line bg-bg px-3 py-2.5 text-[14px] text-ink placeholder:text-subtle outline-none focus:border-accent transition-colors"
              />
            </label>

            <label className="mt-4 block">
              <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
                Password
              </span>
              <input
                type="password"
                placeholder="••••••••"
                className="mt-2 block w-full rounded-md border border-line bg-bg px-3 py-2.5 text-[14px] text-ink placeholder:text-subtle outline-none focus:border-accent transition-colors"
              />
            </label>

            <button className="mt-6 w-full rounded-md bg-accent px-4 py-2.5 text-[14px] font-semibold text-bg transition-colors hover:bg-accent-ink cursor-pointer">
              Sign in
            </button>
          </div>

          <p className="mt-6 text-center font-mono text-[11px] text-subtle">
            Authentication is not yet wired up.
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
