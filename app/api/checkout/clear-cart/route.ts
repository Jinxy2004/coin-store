import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { isUserAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

/**
 * POST with session_id in body. Verifies the Stripe session is paid and
 * belongs to the current user, then clears their cart. Used as a fallback
 * when the user lands on the success page (in case webhook hasn't run yet).
 */
export async function POST(request: NextRequest) {
  try {
    const { getUser } = getKindeServerSession();
    if (!(await isUserAuthenticated())) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const kindeUser = await getUser();
    if (!kindeUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const userId = kindeUser.id;

    const { session_id } = (await request.json()) as { session_id?: string };
    if (!session_id) {
      return NextResponse.json(
        { error: "Missing session_id" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Session not paid" }, { status: 400 });
    }
    if (session.metadata?.userId !== userId) {
      return NextResponse.json(
        { error: "Session does not belong to this user" },
        { status: 403 }
      );
    }

    await prisma.cartItem.deleteMany({
      where: { userId },
    });

    return NextResponse.json({ cleared: true });
  } catch (error) {
    console.error("Clear cart error:", error);
    return NextResponse.json(
      { error: "Failed to clear cart" },
      { status: 500 }
    );
  }
}
