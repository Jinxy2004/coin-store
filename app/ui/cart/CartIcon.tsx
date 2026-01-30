"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface CartIconProps {
  isAuthenticated: boolean;
}

export default function CartIcon({ isAuthenticated }: CartIconProps) {
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchCartCount = async () => {
      try {
        const response = await fetch("/api/cart");
        if (response.ok) {
          const data = await response.json();
          setItemCount(data.itemCount || 0);
        }
      } catch (error) {
        console.error("Error fetching cart count:", error);
      }
    };

    fetchCartCount();

    const handleCartUpdate = () => {
      fetchCartCount();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  return (
    <Link
      href="/cart"
      className="relative p-2 text-[#333333] hover:text-[#2c5282]"
    >
      <svg
        className="w-6 h-6"
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
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#2c5282] text-white text-xs font-bold w-5 h-5 flex items-center justify-center">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Link>
  );
}
