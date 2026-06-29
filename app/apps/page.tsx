import { AppsSection } from "./_components/apps-section";

export const metadata = {
  title: "Apps",
  description:
    "A controlled workspace of applications for sensitive data and compute-heavy workflows.",
};

export default function AppsPage() {
  const isAuthenticated = false; // Auth not wired up yet
  const userEmail = null;

  return (
    <div className="pt-16 pb-24 md:pt-24 md:pb-32">
      <AppsSection
        kind="Private"
        isAuthenticated={isAuthenticated}
        userEmail={userEmail}
      />
    </div>
  );
}
