import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminDashboard from "./admin-dashboard";

export const metadata = {
  title: "Admin Dashboard | Johnny5",
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login?callbackUrl=/admin");
  }

  if (session.user.role !== "admin") {
    redirect("/");
  }

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, active: true, allowedApps: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-bg">
      <AdminDashboard initialUsers={users} currentUser={session.user} />
    </div>
  );
}
