"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface AddToCartButtonProps {
  coinId: number;
  isAuthenticated: boolean;
  stock: number;
}

export default function AddToCartButton({
  coinId,
  isAuthenticated,
  stock: initialStock,
}: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [justAdded, setJustAdded] = useState(false); // Brief feedback after adding
  const [cartQuantity, setCartQuantity] = useState(0); // How many of this coin are in cart
  const [currentStock, setCurrentStock] = useState(initialStock); // Live stock from API
  const [dataChecked, setDataChecked] = useState(false); // Whether we've checked cart/stock
  const [error, setError] = useState<string | null>(null);

  // Check cart quantity and current stock on mount and when cartUpdated event fires
  useEffect(() => {
    const checkCartAndStock = async () => {
      try {
        // Fetch current coin stock
        const coinResponse = await fetch(`/api/coins?id=${coinId}`);
        if (coinResponse.ok) {
          const coinData = await coinResponse.json();
          if (coinData.stock !== undefined) {
            setCurrentStock(coinData.stock);
          }
        }

        // Fetch cart quantity if authenticated
        if (isAuthenticated) {
          const cartResponse = await fetch("/api/cart");
          if (cartResponse.ok) {
            const cartData = await cartResponse.json();
            const cartItem = cartData.items?.find(
              (item: any) => item.coinId === coinId,
            );
            setCartQuantity(cartItem?.quantity || 0);
          }
        }
      } catch (err) {
        console.error("Error checking cart/stock:", err);
      } finally {
        setDataChecked(true);
      }
    };

    checkCartAndStock();

    const handleCartUpdated = () => {
      checkCartAndStock();
    };

    window.addEventListener("cartUpdated", handleCartUpdated);
    return () => window.removeEventListener("cartUpdated", handleCartUpdated);
  }, [coinId, isAuthenticated]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      // Redirect to login
      window.location.href = "/api/auth/login";
      return;
    }

    if (currentStock <= 0) return;

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
        setJustAdded(true);
        setCartQuantity((prev) => prev + 1);
        window.dispatchEvent(new Event("cartUpdated"));
        setTimeout(() => setJustAdded(false), 2000); // Show feedback briefly
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

  const isOutOfStock = currentStock <= 0;
  const remainingStock = currentStock - cartQuantity;
  const isFullyInCart = remainingStock <= 0 && cartQuantity > 0;

  return (
    <div className="mt-3">
      <Button
        onClick={handleAddToCart}
        disabled={isLoading || isOutOfStock || isFullyInCart}
        className={`w-full text-base py-5 font-semibold ${
          isOutOfStock || isFullyInCart
            ? "bg-[#999999] hover:bg-[#999999] cursor-not-allowed border-[#999999]"
            : justAdded
              ? "bg-[#228b22] hover:bg-[#1a6b1a] border-[#1a6b1a]"
              : error
                ? "bg-[#cc3333] hover:bg-[#aa2222] border-[#aa2222]"
                : ""
        } text-white`}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">Adding...</span>
        ) : isOutOfStock || isFullyInCart ? (
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
        ) : justAdded ? (
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
      {dataChecked &&
        !isOutOfStock &&
        !isFullyInCart &&
        remainingStock > 0 &&
        remainingStock <= 5 && (
          <p className="text-[#cc6600] text-sm mt-2 text-center font-medium">
            Only {remainingStock} left in stock!
          </p>
        )}
    </div>
  );
}
