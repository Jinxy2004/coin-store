import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

// Helper to ensure user exists in our database
async function ensureDbUser() {
  const { getUser, isAuthenticated } = getKindeServerSession();

  if (!(await isAuthenticated())) {
    console.log("Cart API: User not authenticated");
    return null;
  }

  const kindeUser = await getUser();
  if (!kindeUser) {
    console.log("Cart API: Could not get Kinde user");
    return null;
  }

  try {
    const user = await prisma.user.upsert({
      where: { id: kindeUser.id },
      update: {},
      create: {
        id: kindeUser.id,
      },
    });
    return user;
  } catch (error) {
    console.error("Cart API: Error upserting user:", error);
    throw error;
  }
}

// GET - Fetch cart items for the current user
export async function GET() {
  try {
    const user = await ensureDbUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: {
        coin: true,
      },
    });

    const total = cartItems.reduce(
      (sum, item) => sum + (item.coin?.price ?? 0) * item.quantity,
      0,
    );

    return NextResponse.json({
      items: cartItems,
      total,
      itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 },
    );
  }
}

// POST - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const user = await ensureDbUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { coinId, quantity = 1 } = await request.json();

    if (!coinId) {
      return NextResponse.json(
        { error: "Missing required field: coinId" },
        { status: 400 },
      );
    }

    // Check if coin exists
    const coin = await prisma.coins.findUnique({
      where: { id: Number(coinId) },
    });

    if (!coin) {
      return NextResponse.json({ error: "Coin not found" }, { status: 404 });
    }

    // Check available stock
    if (coin.stock <= 0) {
      return NextResponse.json(
        { error: "This coin is out of stock" },
        { status: 400 },
      );
    }

    // Check current cart quantity for this item
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        userId_coinId: {
          userId: user.id,
          coinId: Number(coinId),
        },
      },
    });

    const currentQty = existingCartItem?.quantity ?? 0;
    const newQty = currentQty + quantity;

    if (newQty > coin.stock) {
      return NextResponse.json(
        {
          error: `Only ${coin.stock} available in stock. You already have ${currentQty} in your cart.`,
          availableStock: coin.stock,
          currentCartQty: currentQty,
        },
        { status: 400 },
      );
    }

    // Upsert cart item (add or update quantity)
    const cartItem = await prisma.cartItem.upsert({
      where: {
        userId_coinId: {
          userId: user.id,
          coinId: Number(coinId),
        },
      },
      update: {
        quantity: { increment: quantity },
      },
      create: {
        userId: user.id,
        coinId: Number(coinId),
        quantity,
      },
      include: {
        coin: true,
      },
    });

    return NextResponse.json(cartItem, { status: 201 });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 500 },
    );
  }
}

// PUT - Update cart item quantity
export async function PUT(request: NextRequest) {
  try {
    const user = await ensureDbUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { coinId, quantity } = await request.json();

    if (!coinId || quantity === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: coinId, quantity" },
        { status: 400 },
      );
    }

    if (quantity <= 0) {
      // Delete the item if quantity is 0 or less
      await prisma.cartItem.delete({
        where: {
          userId_coinId: {
            userId: user.id,
            coinId: Number(coinId),
          },
        },
      });
      return NextResponse.json({ deleted: true });
    }

    // Check stock before updating
    const coin = await prisma.coins.findUnique({
      where: { id: Number(coinId) },
    });

    if (!coin) {
      return NextResponse.json({ error: "Coin not found" }, { status: 404 });
    }

    if (quantity > coin.stock) {
      return NextResponse.json(
        {
          error: `Only ${coin.stock} available in stock`,
          availableStock: coin.stock,
        },
        { status: 400 },
      );
    }

    const cartItem = await prisma.cartItem.update({
      where: {
        userId_coinId: {
          userId: user.id,
          coinId: Number(coinId),
        },
      },
      data: { quantity },
      include: {
        coin: true,
      },
    });

    return NextResponse.json(cartItem);
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json(
      { error: "Failed to update cart" },
      { status: 500 },
    );
  }
}

// DELETE - Remove item from cart
export async function DELETE(request: NextRequest) {
  try {
    const user = await ensureDbUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const coinId = searchParams.get("coinId");

    if (!coinId) {
      return NextResponse.json(
        { error: "Missing required parameter: coinId" },
        { status: 400 },
      );
    }

    await prisma.cartItem.delete({
      where: {
        userId_coinId: {
          userId: user.id,
          coinId: Number(coinId),
        },
      },
    });

    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error("Error removing from cart:", error);
    return NextResponse.json(
      { error: "Failed to remove from cart" },
      { status: 500 },
    );
  }
}
