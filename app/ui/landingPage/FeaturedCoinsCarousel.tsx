"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Coin = {
  id: number;
  name: string | null;
  year: number | null;
  imageUrl: string | null;
  price: number;
  type: string | null;
  country: string | null;
};

function formatCoinType(type: string): string {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export default function FeaturedCoinsCarousel({ coins }: { coins: Coin[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef(0);
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate coins for seamless infinite scroll
  const duplicatedCoins = [...coins, ...coins];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || coins.length === 0) return;

    let animationId: number;
    const scrollSpeed = 0.2; // pixels per frame

    const scroll = () => {
      if (!isPaused && scrollContainer) {
        scrollPositionRef.current += scrollSpeed;

        // Reset position when we've scrolled through the first set
        const halfWidth = scrollContainer.scrollWidth / 2;
        if (scrollPositionRef.current >= halfWidth) {
          scrollPositionRef.current = 0;
        }

        scrollContainer.scrollLeft = scrollPositionRef.current;
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPaused, coins.length]);

  if (coins.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-linear-to-r from-amber-50 via-white to-amber-50 overflow-hidden">
      <div className="container mx-auto px-4 mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-amber-800 mb-2">
          Featured High-Value Coins
        </h2>
        <p className="text-center text-slate-600">
          Explore our most valuable pieces
        </p>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-hidden cursor-pointer"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {duplicatedCoins.map((coin, index) => (
          <Link
            href={`/coins/${coin.id}`}
            key={`${coin.id}-${index}`}
            className="shrink-0 w-72 group"
          >
            <div className="bg-white rounded-xl border-2 border-amber-200 hover:border-amber-400 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative h-48 bg-linear-to-br from-slate-100 to-amber-50 p-4 flex items-center justify-center">
                {coin.imageUrl ? (
                  <Image
                    src={coin.imageUrl}
                    alt={coin.name || "Coin"}
                    width={160}
                    height={160}
                    className="object-contain w-40 h-40 group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-amber-200 flex items-center justify-center">
                    <span className="text-amber-700 text-4xl font-bold">$</span>
                  </div>
                )}
                {coin.type && (
                  <span className="absolute top-3 right-3 px-2 py-1 text-xs font-semibold rounded-full bg-amber-600 text-white">
                    {formatCoinType(coin.type)}
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-slate-800 text-lg truncate group-hover:text-amber-800 transition-colors">
                  {coin.name}
                </h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-slate-500 text-sm">
                    {coin.country} {coin.year && `• ${coin.year}`}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-2xl font-bold text-amber-700">
                    ${(coin.price / 100).toFixed(2)}
                  </span>
                  <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full font-medium">
                    View Details →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
