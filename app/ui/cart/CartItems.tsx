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

  const fetchCart = async () => {
    try {
      const response = await fetch("/api/cart");
      if (response.ok) {
        const data = await response.json();
        setCart(data);
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
      }
    } catch (error) {
      console.error("Error removing item:", error);
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <svg
          className="animate-spin h-8 w-8 text-amber-700"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-16 w-16 text-slate-400 mb-4"
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
        <h2 className="text-xl font-semibold text-slate-700 mb-2">
          Your cart is empty
        </h2>
        <p className="text-slate-500 mb-6">
          Looks like you haven&apos;t added any coins yet.
        </p>
        <Link
          href="/coins"
          className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Browse Coins
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        {cart.items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-md border border-slate-200 p-4 flex gap-4"
          >
            {/* Coin Image */}
            <div className="relative w-24 h-24 shrink-0 bg-slate-100 rounded-lg overflow-hidden">
              {item.coin.imageUrl ? (
                <Image
                  src={item.coin.imageUrl}
                  alt={item.coin.name || "Coin"}
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <svg
                    className="w-10 h-10"
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
                className="text-lg font-semibold text-slate-800 hover:text-amber-700 transition-colors"
              >
                {item.coin.name || "Unknown Coin"}
              </Link>
              <div className="text-sm text-slate-500 mt-1">
                {item.coin.year && <span>{item.coin.year}</span>}
                {item.coin.year && item.coin.country && <span> • </span>}
                {item.coin.country && <span>{item.coin.country}</span>}
              </div>
              <p className="text-amber-700 font-semibold mt-2">
                ${(item.coin.price / 100).toFixed(2)}
              </p>
            </div>

            {/* Quantity Controls */}
            <div className="flex flex-col items-end justify-between">
              <button
                onClick={() => removeItem(item.coinId)}
                disabled={updating === item.coinId}
                className="text-slate-400 hover:text-red-500 transition-colors"
              >
                <svg
                  className="w-5 h-5"
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

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.coinId, item.quantity - 1)}
                  disabled={updating === item.coinId || item.quantity <= 1}
                  className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  -
                </button>
                <span className="w-8 text-center font-medium">
                  {updating === item.coinId ? "..." : item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.coinId, item.quantity + 1)}
                  disabled={
                    updating === item.coinId || item.quantity >= item.coin.stock
                  }
                  className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                <p className="text-xs text-amber-600 font-medium">Max qty</p>
              )}

              <p className="text-slate-700 font-semibold">
                ${((item.coin.price * item.quantity) / 100).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6 sticky top-24">
          <h2 className="text-xl font-bold text-slate-800 mb-4">
            Order Summary
          </h2>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal ({cart.itemCount} items)</span>
              <span>${(cart.total / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="border-t border-slate-200 pt-3">
              <div className="flex justify-between text-lg font-bold text-slate-800">
                <span>Total</span>
                <span>${(cart.total / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <Button className="w-full bg-amber-700 hover:bg-amber-800 text-white font-semibold py-6 text-lg">
            Proceed to Checkout
          </Button>

          <Link
            href="/coins"
            className="block text-center text-amber-700 hover:text-amber-800 font-medium mt-4 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
