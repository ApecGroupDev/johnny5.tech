import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { APPS, STREAMLIT_URLS } from "../_components/app-data";
import { AppDetailLayout } from "../_components/app-layout";

const SLUG = "canopy-configurator";

export async function generateMetadata() {
  const app = APPS.find((a) => a.slug === SLUG)!;
  return { title: app.title, description: app.description };
}

export default async function Page() {
  const app = APPS.find((a) => a.slug === SLUG)!;
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/apps/canopy-configurator");
  if (session.user.role !== "admin" && !session.user.allowedApps?.includes("canopy-configurator")) {
    redirect("/?error=RestrictedAccess#apps");
  }

  const locked = app.kind === "Private" && !session;
  return <AppDetailLayout app={app} embedUrl={STREAMLIT_URLS[SLUG]} locked={locked} />;
}
