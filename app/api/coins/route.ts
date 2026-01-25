import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

// API endpoint, for inserting the coin form data into the db
export async function POST(request: NextRequest) {
  // Verifies that the user is authorized to send an API request
  const { isAuthenticated, getRoles } = getKindeServerSession();
  const roles = await getRoles();

  const hasAdminRole = roles?.some((role) => role.key === "site-manager");
  if (!isAuthenticated || !hasAdminRole) {
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
