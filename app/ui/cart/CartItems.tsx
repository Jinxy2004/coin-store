"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Coin {
  id: number;
  name: string | null;
  price: number;
  imageUrl: string | null;
  year: number | null;
  country: string | null;
  stock: number;
}

interface CartItem {
  id: number;
  coinId: number;
  quantity: number;
  coin: Coin;
}

interface CartData {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export default function CartItems() {
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const fetchCart = async () => {
    try {
      const response = await fetch("/api/cart");
      if (response.ok) {
        const data = await response.json();
        setCart(data);
        window.dispatchEvent(new Event("cartUpdated"));
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (coinId: number, newQuantity: number) => {
    setUpdating(coinId);
    try {
      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coinId, quantity: newQuantity }),
      });

      if (response.ok) {
        await fetchCart();
        window.dispatchEvent(new Event("cartUpdated"));
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (coinId: number) => {
    setUpdating(coinId);
    try {
      const response = await fetch(`/api/cart?coinId=${coinId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchCart();
        window.dispatchEvent(new Event("cartUpdated"));
      }
    } catch (error) {
      console.error("Error removing item:", error);
    } finally {
      setUpdating(null);
    }
  };

  const proceedToCheckout = async () => {
    setCheckoutLoading(true);
    setCheckoutError(null);
    try {
      const response = await fetch("/api/checkout/create-session", {
        method: "POST",
      });
      const data = await response.json();
      if (!response.ok) {
        setCheckoutError(data.error || "Failed to start checkout");
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      } else {
        setCheckoutError("Invalid checkout response");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setCheckoutError("Failed to start checkout");
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <span className="text-[#666666]">Loading...</span>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-8 bg-[#f5f5f5] border border-[#cccccc] p-6">
        <svg
          className="mx-auto h-12 w-12 text-[#999999] mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h2 className="text-lg font-semibold text-[#555555] mb-1">
          Your cart is empty
        </h2>
        <p className="text-[#666666] mb-4 text-sm">
          Looks like you haven&apos;t added any coins yet.
        </p>
        <Link
          href="/coins"
          className="inline-flex items-center gap-2 bg-[#2c5282] hover:bg-[#1e3a5f] text-white px-4 py-2 font-semibold"
        >
          Browse Coins
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-3">
        {cart.items.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-[#cccccc] p-3 flex gap-3"
          >
            {/* Coin Image */}
            <div className="relative w-20 h-20 shrink-0 bg-[#f5f5f5] overflow-hidden border border-[#e0e0e0]">
              {item.coin.imageUrl ? (
                <Image
                  src={item.coin.imageUrl}
                  alt={item.coin.name || "Coin"}
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#999999]">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Coin Details */}
            <div className="grow">
              <Link
                href={`/coins/${item.coinId}`}
                className="text-base font-semibold text-[#333333] hover:text-[#2c5282]"
              >
                {item.coin.name || "Unknown Coin"}
              </Link>
              <div className="text-xs text-[#666666] mt-1">
                {item.coin.year && <span>{item.coin.year}</span>}
                {item.coin.year && item.coin.country && <span> • </span>}
                {item.coin.country && <span>{item.coin.country}</span>}
              </div>
              <p className="text-[#8b6914] font-semibold mt-1">
                ${(item.coin.price / 100).toFixed(2)}
              </p>
            </div>

            {/* Quantity Controls */}
            <div className="flex flex-col items-end justify-between">
              <button
                onClick={() => removeItem(item.coinId)}
                disabled={updating === item.coinId}
                className="text-[#999999] hover:text-[#cc3333]"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => updateQuantity(item.coinId, item.quantity - 1)}
                  disabled={updating === item.coinId || item.quantity <= 1}
                  className="w-6 h-6 border border-[#cccccc] flex items-center justify-center text-[#555555] hover:bg-[#f0f0f0] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  -
                </button>
                <span className="w-6 text-center font-medium text-sm">
                  {updating === item.coinId ? "..." : item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.coinId, item.quantity + 1)}
                  disabled={
                    updating === item.coinId || item.quantity >= item.coin.stock
                  }
                  className="w-6 h-6 border border-[#cccccc] flex items-center justify-center text-[#555555] hover:bg-[#f0f0f0] disabled:opacity-50 disabled:cursor-not-allowed"
                  title={
                    item.quantity >= item.coin.stock
                      ? "Maximum stock reached"
                      : undefined
                  }
                >
                  +
                </button>
              </div>

              {item.quantity >= item.coin.stock && (
                <p className="text-xs text-[#cc6600] font-medium">Max qty</p>
              )}

              <p className="text-[#333333] font-semibold">
                ${((item.coin.price * item.quantity) / 100).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="bg-white border-2 border-[#cccccc] p-4 sticky top-20">
          <h2 className="text-lg font-bold text-[#2c5282] mb-3 border-b border-[#d4af37] pb-2">
            Order Summary
          </h2>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-[#555555] text-sm">
              <span>Subtotal ({cart.itemCount} items)</span>
              <span>${(cart.total / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#555555] text-sm">
              <span>Shipping</span>
              <span className="text-[#228b22]">Free</span>
            </div>
            <div className="border-t border-[#cccccc] pt-2">
              <div className="flex justify-between text-base font-bold text-[#333333]">
                <span>Total</span>
                <span>${(cart.total / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <Button
            onClick={proceedToCheckout}
            disabled={checkoutLoading}
            className="w-full font-semibold py-4 text-base"
          >
            {checkoutLoading ? "Redirecting to checkout…" : "Proceed to Checkout"}
          </Button>
          {checkoutError && (
            <p className="text-red-600 text-sm mt-2 text-center">{checkoutError}</p>
          )}

          <Link
            href="/coins"
            className="block text-center text-[#2c5282] hover:text-[#1e3a5f] font-medium mt-3 text-sm"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
