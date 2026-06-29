import { Section } from "./components/ui/section";
import { Reveal } from "./components/motion/reveal";
import { AppsSection } from "./apps/_components/apps-section";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const isAuthenticated = !!session;
  const userEmail = session?.user?.email ?? null;

  return (
    <>
      {/* ── Hero ── */}
      <Section id="home" className="pt-16 pb-20 md:pt-24 md:pb-24">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
            System Online
          </p>
          <h1 className="mt-4 font-display text-[48px] leading-[1.02] text-ink sm:text-6xl md:text-[72px]">
            Johnny5
          </h1>
          <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-muted md:text-[17px]">
            Automated workflows, AI-assisted tools, and quick utilities shipped
            for the web.
          </p>
        </Reveal>
      </Section>

      <AppsSection
        kind="Private"
        isAuthenticated={isAuthenticated}
        userEmail={userEmail}
      />
    </>
  );
}
