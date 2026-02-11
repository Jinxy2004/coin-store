import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

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
  } catch (error) {
    console.error("Error modifying coin:", error);
    return NextResponse.json(
      { error: "Failed to modify coin" },
      { status: 500 },
    );
  }
}
