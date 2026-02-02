import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function CartCancelPage() {
  const { isAuthenticated } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();

  if (!isUserAuthenticated) {
    redirect("/api/auth/login?post_login_redirect_url=/cart");
  }

  return (
    <main className="min-h-screen bg-white pt-6 pb-8">
      <div className="container mx-auto px-4 max-w-xl text-center">
        <div className="border-2 border-[#cccccc] bg-[#f5f5f5] p-8">
          <h1 className="text-2xl font-bold text-[#555555] mb-2">
            Checkout cancelled
          </h1>
          <p className="text-[#666666] mb-6">
            Your cart is unchanged. You can continue shopping or return to your
            cart.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/cart"
              className="inline-block bg-[#2c5282] hover:bg-[#1e3a5f] text-white px-6 py-3 font-semibold"
            >
              View Cart
            </Link>
            <Link
              href="/coins"
              className="inline-block border-2 border-[#2c5282] text-[#2c5282] hover:bg-[#2c5282] hover:text-white px-6 py-3 font-semibold"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
