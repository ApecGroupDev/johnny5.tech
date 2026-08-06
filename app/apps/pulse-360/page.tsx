import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { APPS } from "../_components/app-data";
import { AppDetailLayout } from "../_components/app-layout";

const SLUG = "pulse-360";

export async function generateMetadata() {
  const app = APPS.find((a) => a.slug === SLUG)!;
  return { title: app.title, description: app.description };
}

export default async function Page() {
  const app = APPS.find((a) => a.slug === SLUG)!;
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/login?callbackUrl=/apps/${SLUG}`);
  if (
    session.user.role !== "admin" &&
    !session.user.allowedApps?.includes(SLUG)
  ) {
    redirect("/?error=RestrictedAccess#apps");
  }

  const embedUrl =
    "https://pulse-360-apec.vercel.app/project-updates/index.html";

  return (
    <AppDetailLayout app={app} embedUrl={embedUrl}>
      <div className="mt-10 border-t border-line pt-8">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted">
          Release Notes
        </div>
        <h2 className="mt-4 font-display text-2xl text-ink">
          What&apos;s new in v3.1
        </h2>
        <ul className="mt-4 space-y-3 text-muted max-w-2xl">
          <li className="flex gap-3">
            <span className="text-ink mt-0.5">•</span>
            <span>
              <strong className="text-ink font-medium">
                Budget &amp; Accounting Integration:
              </strong>{" "}
              Each of the 75 active project cards now includes a profitability
              tracker displaying original quote budget, quoted price, running
              COGS, and calculated profit, alongside upgraded AI chatbot
              instructions for financial and profitability analysis.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-ink mt-0.5">•</span>
            <span>
              <strong className="text-ink font-medium">
                Searchable Project Picker:
              </strong>{" "}
              The chat view now has a live-search dropdown to quickly find and
              select any project by name, company, or city.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-ink mt-0.5">•</span>
            <span>
              <strong className="text-ink font-medium">
                Voice Input &amp; Read-Aloud:
              </strong>{" "}
              Speak questions via microphone and toggle text-to-speech to have
              answers read back aloud.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-ink mt-0.5">•</span>
            <span>
              <strong className="text-ink font-medium">
                Sign-Out from All Views:
              </strong>{" "}
              Quick sign-out is now accessible from the map, chat, and hub
              pages — no need to navigate back.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-ink mt-0.5">•</span>
            <span>
              <strong className="text-ink font-medium">
                Interactive Project Map:
              </strong>{" "}
              Track status colors, crew proximity, and 48-hour rain halos via
              Open-Meteo integration.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-ink mt-0.5">•</span>
            <span>
              <strong className="text-ink font-medium">AI Chatbot:</strong>{" "}
              Ask Claude Sonnet questions about any specific project data card
              or the overall portfolio.
            </span>
          </li>
        </ul>
      </div>
    </AppDetailLayout>
  );
}
