import { prisma } from "@/lib/prisma";
import { isAdminUserWithAuth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

// GET - Fetch a single coin by ID (for stock check)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing required parameter: id" },
        { status: 400 },
      );
    }

    const coin = await prisma.coins.findUnique({
      where: { id: Number(id) },
      select: { id: true, stock: true },
    });

    if (!coin) {
      return NextResponse.json({ error: "Coin not found" }, { status: 404 });
    }

    return NextResponse.json(coin);
  } catch (error) {
    console.error("Error fetching coin:", error);
    return NextResponse.json(
      { error: "Failed to fetch coin" },
      { status: 500 },
    );
  }
}

// API endpoint, for inserting the coin form data into the db
export async function POST(request: NextRequest) {
  if (!(await isAdminUserWithAuth())) {
    return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
  }
  try {
    // Converts the requested data into a javascript object from JSON
    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.country || data.price === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: name, country, price" },
        { status: 400 },
      );
    }

    // Converts users price in dollars to cents
    const priceInCents = Math.round(parseFloat(data.price) * 100);

    const coin = await prisma.coins.create({
      data: {
        name: data.name,
        year: data.year || null,
        country: data.country,
        price: priceInCents,
        type: data.type || null,
        description: data.description || null,
        denomination: data.denomination || null,
        imageUrl: data.imageUrl || null,
        stock: data.stock || 0,
      },
    });

    // Sends back the newly created json with status 201 to confirm success
    return NextResponse.json(coin, { status: 201 });
  } catch (error) {
    console.error("Error creating coin:", error);
    return NextResponse.json(
      { error: "Failed to create coin" },
      { status: 500 },
    );
  }
}
