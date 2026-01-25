import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import CartItems from "@/app/ui/cart/CartItems";
import Link from "next/link";

export default async function CartPage() {
  const { isAuthenticated } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();

  if (!isUserAuthenticated) {
    redirect("/api/auth/login?post_login_redirect_url=/cart");
  }

  return (
    <main className="min-h-screen bg-slate-50 pt-8 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Shopping Cart</h1>
          <Link
            href="/coins"
            className="text-amber-700 hover:text-amber-800 font-medium transition-colors"
          >
            ← Continue Shopping
          </Link>
        </div>

        <CartItems />
      </div>
    </main>
  );
}
