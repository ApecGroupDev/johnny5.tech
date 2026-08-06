import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { APPS } from "../_components/app-data";
import { AppDetailLayout } from "../_components/app-layout";

const SLUG = "rain-risk";

export async function generateMetadata() {
  const app = APPS.find((a) => a.slug === SLUG)!;
  return { title: app.title, description: app.description };
}

export default async function Page() {
  const app = APPS.find((a) => a.slug === SLUG)!;
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/login?callbackUrl=/apps/${SLUG}`);
  if (session.user.role !== "admin" && !session.user.allowedApps?.includes(SLUG)) {
    redirect("/?error=RestrictedAccess#apps");
  }

  const embedUrl = "/rain-risk-dashboard.html";

  return <AppDetailLayout app={app} embedUrl={embedUrl} />;
}
