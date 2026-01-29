import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Stripe from "stripe";

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!process.env.STRIPE_SECRET_KEY) {
            console.error("STRIPE_SECRET_KEY is missing");
            return new NextResponse("Internal Server Error", { status: 500 });
        }

        // FIX: Define a safe base URL that falls back to localhost if the env var is missing
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: "2023-10-16", // Use a stable API version (2025 version isn't standard yet)
            typescript: true,
        });

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: "Pro Plan",
                            description: "Unlock all premium features",
                        },
                        unit_amount: 1500, // $15.00
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            // FIX: Use the 'baseUrl' variable here
            success_url: `${baseUrl}/admin?upgraded=1`,
            cancel_url: `${baseUrl}/admin?canceled=1`,
            metadata: {
                user_id: user.id,
            },
            customer_email: user.email,
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error("[STRIPE_CHECKOUT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}