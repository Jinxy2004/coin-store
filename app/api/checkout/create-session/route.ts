import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

async function ensureDbUser() {
  const { getUser, isAuthenticated } = getKindeServerSession();
  if (!(await isAuthenticated())) return null;
  const kindeUser = await getUser();
  if (!kindeUser) return null;
  const user = await prisma.user.upsert({
    where: { id: kindeUser.id },
    update: {},
    create: { id: kindeUser.id },
  });
  return user;
}

export async function POST() {
  try {
    const user = await ensureDbUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: { coin: true },
    });

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: "Your cart is empty" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      cartItems.map((item) => ({
        price_data: {
          currency: "usd",
          unit_amount: item.coin.price,
          product_data: {
            name: item.coin.name || `Coin #${item.coin.id}`,
            description: [item.coin.year, item.coin.country]
              .filter(Boolean)
              .join(" • "),
            images: item.coin.imageUrl ? [item.coin.imageUrl] : undefined,
          },
        },
        quantity: item.quantity,
      }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${baseUrl}/cart/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart/cancel`,
      client_reference_id: user.id,
      metadata: {
        userId: user.id,
      },
      shipping_address_collection: {
        allowed_countries: [
          "US",
          "CA",
          "GB",
          "AU",
          "DE",
          "FR",
          "IT",
          "ES",
          "NL",
          "BE",
          "AT",
          "IE",
          "NZ",
          "JP",
          "MX",
        ],
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Failed to create checkout session" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout create-session error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
