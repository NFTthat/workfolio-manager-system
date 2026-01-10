import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import AdminDashboard from "@/components/admin/dashboard";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Fetch initial portfolio data server-side
  const portfolio = await db.portfolio.findFirst({
    where: {
      authorId: user.id
    },
    orderBy: { updatedAt: "desc" },
    include: {
      experiences: { orderBy: { order: "asc" } },
      projects: { orderBy: { order: "asc" } },
      skills: { orderBy: { order: "asc" } }
    }
  });

  const portfolioContent = portfolio?.content || null;

  return <AdminDashboard user={user} initialData={portfolioContent} />;
}