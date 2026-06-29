import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { APPS } from "../_components/app-data";
import Link from "next/link";
import { ArrowLeft, Crown } from "lucide-react";
import { Container } from "@/app/components/ui/container";
import { Badge, Pill } from "@/app/components/ui/badge";

export const metadata = {
  title: "Ruby Queen",
  description: "POS Troubleshooting Assistant",
};

export default async function RubyQueenPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/apps/ruby-queen");

  const app = APPS.find((a) => a.slug === "ruby-queen");

  const embedUrl = "/ruby-queen/index.html";

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
                <span>Support</span>
                <span className="text-subtle">·</span>
                <span>Private</span>
              </div>
              <h1 className="mt-2 font-display text-4xl leading-tight tracking-tight text-ink md:text-5xl">
                Ruby Queen
              </h1>
              <p className="mt-3 text-muted md:text-lg">
                POS Troubleshooting Assistant. Built from Ms. Peggy's 235-file library.
              </p>
            </div>

            <div className="flex flex-col items-start gap-3 md:items-end">
              <div className="flex items-center gap-2">
                <Badge tone="live" dot>
                  Live
                </Badge>
                <Badge tone="accent">
                  v2.0
                </Badge>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Pill>Vanilla JS</Pill>
                <Pill>Claude</Pill>
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
              <Crown className="h-3.5 w-3.5" />
              ruby-queen
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-600">
              ● live
            </span>
          </div>

          <iframe
            src={embedUrl}
            title="Ruby Queen"
            className="h-[82vh] min-h-[720px] w-full bg-white"
            loading="lazy"
          />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 border-t border-line pt-8 md:grid-cols-4">
          <Info label="Status" value="Live" />
          <Info label="Version" value="2.0" />
          <Info label="Category" value="Support" />
          <Info label="Data" value="APEC Verified Library" />
        </div>

        <div className="mt-10 border-t border-line pt-8">
          <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted">
            Release Notes
          </div>
          <h2 className="mt-4 font-display text-2xl text-ink">What&apos;s new in v2.0</h2>
          <ul className="mt-4 space-y-3 text-muted max-w-2xl">
            <li className="flex gap-3">
              <span className="text-ink mt-0.5">•</span>
              <span><strong className="text-ink font-medium">Secured Data Access:</strong> Integrated NextAuth middleware protection for all static data routes (including site profiles and service history), ensuring that sensitive data is fully protected from unauthorized access.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-ink mt-0.5">•</span>
              <span><strong className="text-ink font-medium">Seamless Authentication:</strong> Removed the redundant site-level password check, allowing logged-in users to access the app immediately.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-ink mt-0.5">•</span>
              <span><strong className="text-ink font-medium">Next.js API Gateway Integration:</strong> Replaced the old Vercel Serverless JavaScript functions with native Next.js App Router API routes (`/api/ruby-queen/ask` and `/api/ruby-queen/screen`).</span>
            </li>
            <li className="flex gap-3">
              <span className="text-ink mt-0.5">•</span>
              <span><strong className="text-ink font-medium">Database Refresh:</strong> Loaded the latest site profiles (1,433 sites) and service history (5,226 past calls) from the latest downloads package.</span>
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
