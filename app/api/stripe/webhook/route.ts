import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { prismaDb as prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_mock", {
  apiVersion: "2024-04-10" as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "whsec_mock";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("Stripe-Signature") as string;
    
    let event: Stripe.Event;

    // Use test event logic if we're stubbing
    if (process.env.NODE_ENV === "development" && process.env.STRIPE_SECRET_KEY === undefined) {
      event = JSON.parse(body);
    } else {
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      } catch (err: any) {
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
      }
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const userId = session.metadata?.userId;
      const tierStr = session.metadata?.tier;

      if (userId && tierStr) {
        const role = tierStr === "lab" ? "LAB" : "PRO";
        
        await prisma.user.update({
          where: { id: userId },
          data: { role },
        });

        if (role === "LAB") {
          await prisma.labProfile.updateMany({
            where: { userId },
            data: { subscriptionTier: "pro" }
          });
        }

        console.log(`Successfully upgraded user ${userId} to ${role}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook processing error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
