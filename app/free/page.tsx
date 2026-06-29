import { AppsSection } from "../apps/_components/apps-section";

export const metadata = {
  title: "Free Apps",
  description:
    "Open-access applications for quick tasks, experimentation, and everyday workflows.",
};

export default function FreeAppsPage() {
  const isAuthenticated = false; // Auth not wired up yet

  return (
    <div className="pt-16 pb-24 md:pt-24 md:pb-32">
      <AppsSection
        kind="Free"
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
}
