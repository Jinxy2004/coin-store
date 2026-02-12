import { prisma } from "@/lib/prisma";
import { isAdminUserWithAuth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  if (!(await isAdminUserWithAuth())) {
    return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
  }
  try {
    // Converts the requested data into a javascript object from JSON
    const data = await request.json();

    // Validate required fields
  } catch (error) {
    console.error("Error modifying coin:", error);
    return NextResponse.json(
      { error: "Failed to modify coin" },
      { status: 500 },
    );
  }
}
