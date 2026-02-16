import { prisma } from "@/lib/prisma";
import { isAdminUserWithAuth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  if (!(await isAdminUserWithAuth())) {
    return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
  }
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.id || !data.name || !data.country || data.price === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: id, name, country, price" },
        { status: 400 },
      );
    }

    const updatedCoin = await prisma.coins.update({
      where: { id: data.id },
      data: {
        name: data.name,
        year: data.year ?? null,
        country: data.country,
        price: data.price,
        type: data.type ?? null,
        description: data.description ?? null,
        denomination: data.denomination ?? null,
        imageUrl: data.imageUrl ?? null,
        stock: data.stock ?? 0,
      },
    });

    return NextResponse.json(updatedCoin);
  } catch (error) {
    console.error("Error modifying coin:", error);
    return NextResponse.json(
      { error: "Failed to modify coin" },
      { status: 500 },
    );
  }
}
