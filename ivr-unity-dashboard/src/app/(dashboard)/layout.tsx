import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { Sidebar } from "@/components/dashboard/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen gradient-mesh">
      <Sidebar />
      <main className="ml-[280px] transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
