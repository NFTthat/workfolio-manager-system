import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-12-15.clover",
    typescript: true,
});

export async function POST(req: Request) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("Stripe-Signature");

    if (!signature) {
        return new NextResponse("Missing Stripe-Signature", { status: 400 });
    }

    let event: Stripe.Event;

    try {
        if (!process.env.STRIPE_WEBHOOK_SECRET) {
            throw new Error("STRIPE_WEBHOOK_SECRET is missing");
        }
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error: any) {
        console.error("Webhook signature verification failed:", error);
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
        const userId = session.metadata?.user_id;

        if (!userId) {
            console.error("User ID missing in metadata");
            return new NextResponse("User id is missing in metadata", { status: 400 });
        }

        try {
            const supabaseAdmin = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY!
            );

            const { error } = await supabaseAdmin.rpc("upgrade_user_to_pro", {
                target_user_id: userId,
            });

            if (error) {
                console.error("Supabase RPC Error:", error);
                return new NextResponse("Database Error", { status: 500 });
            }
        } catch (error) {
            console.error("Upgrade Error:", error);
            return new NextResponse("Internal Error", { status: 500 });
        }
    }

    return new NextResponse(null, { status: 200 });
}
