"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface AddToCartButtonProps {
  coinId: number;
  isAuthenticated: boolean;
  stock: number;
}

export default function AddToCartButton({
  coinId,
  isAuthenticated,
  stock,
}: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      // Redirect to login
      window.location.href = "/api/auth/login";
      return;
    }

    if (stock <= 0) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ coinId, quantity: 1 }),
      });

      const data = await response.json();

      if (response.ok) {
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
      } else {
        setError(data.error || "Failed to add to cart");
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      setError("Failed to add to cart");
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const isOutOfStock = stock <= 0;

  return (
    <div className="mt-4">
      <Button
        onClick={handleAddToCart}
        disabled={isLoading || isOutOfStock}
        className={`w-full text-lg py-6 font-semibold transition-all ${
          isOutOfStock
            ? "bg-slate-400 hover:bg-slate-400 cursor-not-allowed"
            : added
              ? "bg-green-600 hover:bg-green-700"
              : error
                ? "bg-red-600 hover:bg-red-700"
                : "bg-amber-700 hover:bg-amber-800"
        } text-white`}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
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
            Adding...
          </span>
        ) : isOutOfStock ? (
          <span className="flex items-center gap-2">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
            Out of Stock
          </span>
        ) : error ? (
          <span className="flex items-center gap-2">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {error}
          </span>
        ) : added ? (
          <span className="flex items-center gap-2">
            <svg
              className="h-5 w-5"
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
            Added to Cart!
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Add to Cart
          </span>
        )}
      </Button>
      {!isOutOfStock && stock <= 5 && (
        <p className="text-amber-600 text-sm mt-2 text-center font-medium">
          Only {stock} left in stock!
        </p>
      )}
    </div>
  );
}
