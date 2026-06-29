import { AppsSection } from "./apps/_components/apps-section";
import { Hero } from "./components/hero";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const isAuthenticated = !!session;
  const userEmail = session?.user?.email ?? null;

  return (
    <>
      <Hero />

      <AppsSection
        kind="Private"
        isAuthenticated={isAuthenticated}
        userEmail={userEmail}
      />
    </>
  );
}
