import { NextResponse } from "next/server";
import Stripe from "stripe";
import { neonAuth } from "@/lib/neon/auth-server";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_mock", {
  apiVersion: "2024-04-10" as any,
});

export async function POST(req: Request) {
  try {
    const { data: session } = await neonAuth.getSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tier } = await req.json(); // "pro" vs "lab"

    const user = await prisma.user.findUnique({ where: { email: session.user.email }});
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const priceId = tier === "lab" 
      ? process.env.STRIPE_PRICE_ID_LAB || "price_mock_lab_299"
      : process.env.STRIPE_PRICE_ID_PRO || "price_mock_pro_12";

    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/dashboard?success=true`,
      cancel_url: `${origin}/pricing?canceled=true`,
      metadata: {
        userId: user.id,
        tier: tier, 
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error("Stripe error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
