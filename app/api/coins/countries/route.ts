import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch all distinct countries from the coins table
    const countries = await prisma.coins.findMany({
      where: {
        country: {
          not: null,
        },
      },
      select: {
        country: true,
      },
      distinct: ["country"],
    });

    // Extract and sort country names
    const countryNames = countries
      .map((c) => c.country)
      .filter((c): c is string => c !== null)
      .sort();

    return NextResponse.json(countryNames);
  } catch (error) {
    console.error("Error fetching countries:", error);
    return NextResponse.json(
      { error: "Failed to fetch countries" },
      { status: 500 },
    );
  }
}
