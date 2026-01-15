import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { NextRequest } from "next/server";

export default withAuth(
  async function proxy(request: NextRequest) {
    console.log(request); // If I wanted to log requests do it here
  },
  {
    isReturnToCurrentPage: true,
  }
);

export const config = {
  // Only allows logged into users to route to cart
  matcher: ["/cart/:path*"],
};
