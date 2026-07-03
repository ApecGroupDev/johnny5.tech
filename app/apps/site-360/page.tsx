import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { APPS } from "../_components/app-data";
import Link from "next/link";
import { ArrowLeft, Globe } from "lucide-react";
import { Container } from "@/app/components/ui/container";
import { Badge, Pill } from "@/app/components/ui/badge";

export const metadata = {
  title: "SITE 360",
  description: "Atlanta Petroleum Equipment Company (APEC) Site Profile Database",
};

export default async function Site360Page() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/apps/site-360");
  if (session.user.role !== "admin" && !session.user.allowedApps?.includes("site-360")) {
    redirect("/?error=RestrictedAccess#apps");
  }

  const app = APPS.find((a) => a.slug === "site-360");

  const embedUrl = "https://site-360-apec.vercel.app/";

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
                <span>Database</span>
                <span className="text-subtle">·</span>
                <span>Private</span>
              </div>
              <h1 className="mt-2 font-display text-4xl leading-tight tracking-tight text-ink md:text-5xl">
                SITE 360
              </h1>
              <p className="mt-3 text-muted md:text-lg">
                Atlanta Petroleum Equipment Company (APEC) Site Profile Database over 1,400+ POS install records and service calls.
              </p>
            </div>

            <div className="flex flex-col items-start gap-3 md:items-end">
              <Badge tone="live" dot>
                Live
              </Badge>
              <div className="flex flex-wrap gap-1.5">
                <Pill>Vanilla JS</Pill>
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
              <Globe className="h-3.5 w-3.5" />
              site-360
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-600">
              ● live
            </span>
          </div>

          <iframe
            src={embedUrl}
            title="SITE 360"
            className="h-[82vh] min-h-[720px] w-full bg-white"
            loading="lazy"
          />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 border-t border-line pt-8 md:grid-cols-3">
          <Info label="Status" value="Live" />
          <Info label="Category" value="Database" />
          <Info label="Data" value="1,433 Sites" />
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
