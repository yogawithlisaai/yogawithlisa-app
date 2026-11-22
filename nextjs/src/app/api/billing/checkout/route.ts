import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe, PRICE_IDS } from "@/lib/stripe";

export async function POST(req: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ message: "Sign in required" }, { status: 401 });

  const { plan } = (await req.json()) as { plan?: "monthly" | "yearly" };
  const priceId = plan === "yearly" ? PRICE_IDS.yearly : PRICE_IDS.monthly;

  const { origin } = new URL(req.url);
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: { trial_period_days: 7, metadata: { user_id: user.id } },
    payment_method_collection: "always",
    client_reference_id: user.id,
    customer_email: user.email,
    success_url: `${origin}/classes?membership=success`,
    cancel_url: `${origin}/classes?membership=cancelled`,
  });

  if (!session.url) {
    return NextResponse.json({ message: "Could not start checkout" }, { status: 500 });
  }
  return NextResponse.json({ url: session.url });
}
