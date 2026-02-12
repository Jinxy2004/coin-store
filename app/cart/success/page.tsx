import { isUserAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import SuccessClearCart from "@/app/ui/cart/SuccessClearCart";

export default async function CartSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const isAuthenticated = await isUserAuthenticated();

  if (!isAuthenticated) {
    redirect("/api/auth/login?post_login_redirect_url=/cart/success");
  }

  const { session_id } = await searchParams;

  return (
    <>
      <SuccessClearCart sessionId={session_id} />
      <main className="min-h-screen bg-white pt-6 pb-8">
        <div className="container mx-auto px-4 max-w-xl text-center">
          <div className="border-2 border-[#d4af37] bg-[#faf9f5] p-8">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#228b22] text-white">
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#2c5282] mb-2">
              Thank you for your order
            </h1>
            <p className="text-[#555555] mb-6">
              {session_id
                ? "Your payment was successful. We'll process your order shortly."
                : "Your order has been received."}
            </p>
            <Link
              href="/coins"
              className="inline-block bg-[#2c5282] hover:bg-[#1e3a5f] text-white px-6 py-3 font-semibold"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
