import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminDashboard from "@/components/admin/dashboard";

export default async function AdminPage() {




  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/sign-in");
  }

  // Load portfolio
  let { data: portfolio } = await supabase
    .from("portfolios")
    .select("*")
    .eq("authorId", user.id)
    .order("updatedAt", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!portfolio) {
    const { data: portfolioSnake } = await supabase
      .from("portfolios")
      .select("*")
      .eq("author_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    portfolio = portfolioSnake;
  }

  const portfolioContent = portfolio?.content || null;

  // Load plan from users table (single source of truth)
  // src/app/admin/page.tsx

  const { data: dbUser, error: planError } = await supabase
    .from("users")
    .select("plan")
    .eq("id", user.id)
    .single();

  if (planError) {
    console.error("Failed to load user plan:", planError);
  }

  const isPro = dbUser?.plan === "pro";



  return (
    <AdminDashboard
      user={{ ...user, isPro }}
      initialData={portfolioContent}
    />
  );




}
