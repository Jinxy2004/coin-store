import { isUserAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";
import CartItems from "@/app/ui/cart/CartItems";
import Link from "next/link";

export default async function CartPage() {
  const isAuthenticated = await isUserAuthenticated();

  if (!isAuthenticated) {
    redirect("/api/auth/login?post_login_redirect_url=/cart");
  }

  return (
    <main className="min-h-screen bg-white pt-6 pb-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-6 border-b-2 border-[#d4af37] pb-3">
          <h1 className="text-2xl font-bold text-[#2c5282]">Shopping Cart</h1>
          <Link
            href="/coins"
            className="text-[#2c5282] hover:text-[#1e3a5f] font-medium"
          >
            ← Continue Shopping
          </Link>
        </div>

        <CartItems />
      </div>
    </main>
  );
}
