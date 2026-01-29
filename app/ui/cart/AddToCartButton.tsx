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
    <div className="mt-3">
      <Button
        onClick={handleAddToCart}
        disabled={isLoading || isOutOfStock}
        className={`w-full text-base py-5 font-semibold ${
          isOutOfStock
            ? "bg-[#999999] hover:bg-[#999999] cursor-not-allowed border-[#999999]"
            : added
              ? "bg-[#228b22] hover:bg-[#1a6b1a] border-[#1a6b1a]"
              : error
                ? "bg-[#cc3333] hover:bg-[#aa2222] border-[#aa2222]"
                : ""
        } text-white`}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">Adding...</span>
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
        <p className="text-[#cc6600] text-sm mt-2 text-center font-medium">
          Only {stock} left in stock!
        </p>
      )}
    </div>
  );
}
