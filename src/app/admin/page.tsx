import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminDashboard from "@/components/admin/dashboard";

export default async function AdminPage() {
  const supabase = await createClient();
  await supabase.auth.getSession();
  const { data: { user } } = await supabase.auth.getUser();


  if (!user) {
    redirect("/sign-in");
  }

  // Fetch initial portfolio data server-side using Supabase
  // We use the same logic as the API route for consistency
  let { data: portfolio } = await supabase
    .from('portfolios')
    .select('*')
    .eq('authorId', user.id)
    .order('updatedAt', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!portfolio) {
    // Try snake_case
    const { data: portfolioSnake } = await supabase
      .from('portfolios')
      .select('*')
      .eq('author_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    portfolio = portfolioSnake;
  }

  const portfolioContent = portfolio?.content || null;

  // Check if user is Pro
  // Assuming 'plan' is in user metadata or public.users table.
  // For now, we'll check metadata as it's faster.
  // We can also fetch from 'users' table if needed.
  let isPro = user.user_metadata?.plan === 'pro';

  // Also check DB if metadata is not set
  if (!isPro) {
    const { data: dbUser, error } = await supabase
    .from("users")
    .select("plan")
    .eq("id", user.id)
    .maybeSingle();

let isPro = false;

if (error) {
  console.error("Error fetching user plan:", error.message);
} else if (dbUser) {
  isPro = dbUser.plan === "pro";
}
  }

  return <AdminDashboard user={{ ...user, isPro }} initialData={portfolioContent} />;
}
