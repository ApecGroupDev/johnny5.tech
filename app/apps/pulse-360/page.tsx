import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { APPS } from "../_components/app-data";
import Link from "next/link";
import { ArrowLeft, Map } from "lucide-react";
import { Container } from "@/app/components/ui/container";
import { Badge, Pill } from "@/app/components/ui/badge";

export const metadata = {
  title: "PULSE 360",
  description:
    "Interactive map of every site with crew proximity and 48-hour rain risk, plus a dedicated Claude AI assistant.",
};

export default async function ProjectUpdatesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/apps/pulse-360");
  if (session.user.role !== "admin" && !session.user.allowedApps?.includes("pulse-360")) {
    redirect("/?error=RestrictedAccess");
  }

  const app = APPS.find((a) => a.slug === "pulse-360")!;

  const embedUrl = "https://pulse-360-apec.vercel.app/project-updates/index.html";

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
                <span>Management</span>
                <span className="text-subtle">·</span>
                <span>Private</span>
              </div>
              <h1 className="mt-2 font-display text-4xl leading-tight tracking-tight text-ink md:text-5xl">
                PULSE 360
              </h1>
              <p className="mt-3 text-muted md:text-lg">
                Interactive map of every site with crew proximity and 48-hour rain risk, plus a dedicated Claude AI assistant.
              </p>
            </div>

            <div className="flex flex-col items-start gap-3 md:items-end">
              <div className="flex items-center gap-2">
                <Badge tone="live" dot>
                  Live
                </Badge>
                <Badge tone="accent">
                  v3.0
                </Badge>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Pill>Vanilla JS</Pill>
                <Pill>Claude</Pill>
                <Pill>Python</Pill>
              </div>
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
            <span className="flex items-center gap-2 font-mono text-[11px] text-muted">
              <Map className="h-3.5 w-3.5" />
              pulse-360
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-600">
              ● live
            </span>
          </div>

          <iframe
            src={embedUrl}
            title="PULSE 360 App"
            className="h-[82vh] min-h-[720px] w-full bg-white"
            loading="lazy"
          />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 border-t border-line pt-8 md:grid-cols-4">
          <Info label="Status" value="Live" />
          <Info label="Version" value="3.0" />
          <Info label="Category" value="Management" />
          <Info label="Data" value="Serverless API" />
        </div>

        <div className="mt-10 border-t border-line pt-8">
          <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted">
            Release Notes
          </div>
          <h2 className="mt-4 font-display text-2xl text-ink">What's new in v3.0</h2>
          <ul className="mt-4 space-y-3 text-muted max-w-2xl">
            <li className="flex gap-3">
              <span className="text-ink mt-0.5">•</span>
              <span><strong className="text-ink font-medium">Searchable Project Picker:</strong> The chat view now has a live-search dropdown to quickly find and select any project by name, company, or city.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-ink mt-0.5">•</span>
              <span><strong className="text-ink font-medium">Voice Input &amp; Read-Aloud:</strong> Speak questions via microphone and toggle text-to-speech to have answers read back aloud.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-ink mt-0.5">•</span>
              <span><strong className="text-ink font-medium">Sign-Out from All Views:</strong> Quick sign-out is now accessible from the map, chat, and hub pages — no need to navigate back.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-ink mt-0.5">•</span>
              <span><strong className="text-ink font-medium">Interactive Project Map:</strong> Track status colors, crew proximity, and 48-hour rain halos via Open-Meteo integration.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-ink mt-0.5">•</span>
              <span><strong className="text-ink font-medium">AI Chatbot:</strong> Ask Claude Sonnet questions about any specific project data card or the overall portfolio.</span>
            </li>
          </ul>
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
