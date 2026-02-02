import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Stripe webhook signature verification failed:", message);
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 }
    );
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const userId = session.metadata?.userId;
  if (!userId) {
    console.error("Stripe session missing metadata.userId");
    return NextResponse.json(
      { error: "Session missing userId" },
      { status: 400 }
    );
  }

  const sessionId = session.id;
  const amountTotal = session.amount_total ?? 0;

  const existingOrder = await prisma.order.findUnique({
    where: { stripeSessionId: sessionId },
  });
  if (existingOrder) {
    return NextResponse.json({ received: true });
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { coin: true },
  });

  if (cartItems.length === 0) {
    console.error("Webhook: no cart items for user", userId);
    return NextResponse.json(
      { error: "Cart empty at checkout completion" },
      { status: 400 }
    );
  }

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + (item.coin?.price ?? 0) * item.quantity,
    0
  );
  if (cartTotal !== amountTotal) {
    console.error("Webhook: cart total mismatch", {
      cartTotal,
      amountTotal,
      userId,
    });
    return NextResponse.json({ error: "Cart total mismatch" }, { status: 400 });
  }

  const shippingDetails = session.collected_information?.shipping_details;
  const address =
    shippingDetails?.address ?? session.customer_details?.address ?? null;
  const shippingName =
    shippingDetails?.name ?? session.customer_details?.name ?? null;

  try {
    const order = await prisma.order.create({
      data: {
        userId,
        stripeSessionId: sessionId,
        totalCents: amountTotal,
        shippingName: shippingName ?? undefined,
        shippingLine1: address?.line1 ?? undefined,
        shippingLine2: address?.line2 ?? undefined,
        shippingCity: address?.city ?? undefined,
        shippingState: address?.state ?? undefined,
        shippingPostalCode: address?.postal_code ?? undefined,
        shippingCountry: address?.country ?? undefined,
        orderItems: {
          create: cartItems.map((item) => ({
            coinId: item.coinId,
            quantity: item.quantity,
            priceCents: item.coin.price,
          })),
        },
      },
    });

    for (const item of cartItems) {
      await prisma.coins.update({
        where: { id: item.coinId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    await prisma.cartItem.deleteMany({
      where: { userId },
    });
  } catch (error) {
    console.error("Webhook: failed to create order / update stock:", error);
    return NextResponse.json(
      { error: "Failed to fulfill order" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
