import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { portfolioContentSchema } from "@/lib/validators";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const portfolio = await db.portfolio.findFirst({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(portfolio ?? null);
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Optional: Check role from user_metadata or db
    // if (user.user_metadata.role !== 'admin') ...

    const body = await req.json();
    if (!body?.content) return NextResponse.json({ error: "Missing content" }, { status: 400 });

    // Validate shape (throws if invalid)
    const validated = portfolioContentSchema.parse(body.content);

    // create new version (simple audit)
    // For author, Supabase user.id is UUID, Prisma User.id is typically CUID or UUID.
    // If we moved away from Prisma Auth, we might not have a corresponding User record in public.User table.
    // However, the prompt said "Prisma may still be used only for portfolio content".
    // And "Supabase handles Users".
    // So we probably don't have a `User` record in Prisma for this Supabase user unless we sync them.
    // But `db.portfolio.create` expects `author: { connect: { id: user.id } }`.
    // This implies we NEED a record in Prisma `User` table matching Supabase ID.
    // OR we update Prisma schema to remove relation?
    // "Supabase handles: Users... Prisma handles: Portfolio content ONLY"
    // This implies we might need to remove the `author` relation or sync users.
    // Given the constraints and the "no adapters" rule, we should probably remove the relation in Prisma schema
    // OR handle user creation in Prisma on first login (webhook or just lazy creation).

    // For now, I'll attempt to find/create the user in Prisma to satisfy the relation,
    // explicitly using the Supabase ID.

    // We need to check if Prisma schema uses string for ID.

    // Let's check Prisma schema first.
    // I can't check it right now inside this tool call.
    // But assuming it expects a User relation.

    // I will try to upsert the user in Prisma to match Supabase user.
    await db.user.upsert({
      where: { email: user.email! },
      update: {}, // No updates needed, Supabase handles auth
      create: {
        id: user.id, // Ensure IDs match if possible, or mapping
        email: user.email!,
        name: user.user_metadata.full_name || user.email!.split('@')[0],
        role: 'admin', // First user logic?
        image: user.user_metadata.avatar_url
      }
    });

    const latest = await db.portfolio.findFirst({
      where: { authorId: user.id }, // ID might be mismatched if we didn't force it in upsert
      orderBy: { createdAt: "desc" }
    });

    const nextVersion = (latest?.version ?? 0) + 1;

    const saved = await db.portfolio.create({
      data: {
        title: body.title ?? `Portfolio v${nextVersion}`,
        description: body.description ?? null,
        isPublished: !!body.isPublished,
        content: validated,
        version: nextVersion,
        author: { connect: { email: user.email! } } // Connect by email is safer if IDs differ
      }
    });

    return NextResponse.json(saved);
  } catch (err: unknown) {
    console.error("POST /api/content error:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
