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
    <section className="py-10 bg-white border-y border-[#cccccc] overflow-hidden">
      <div className="container mx-auto px-4 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-[#2c5282] mb-1">
          Featured High-Value Coins
        </h2>
        <p className="text-center text-[#666666] text-sm">
          Explore our most valuable pieces
        </p>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-hidden cursor-pointer"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {duplicatedCoins.map((coin, index) => (
          <Link
            href={`/coins/${coin.id}`}
            key={`${coin.id}-${index}`}
            className="shrink-0 w-64 group"
          >
            <div className="bg-white border-2 border-[#cccccc] hover:border-[#d4af37] overflow-hidden">
              <div className="relative h-40 bg-[#f5f5f5] p-3 flex items-center justify-center">
                {coin.imageUrl ? (
                  <Image
                    src={coin.imageUrl}
                    alt={coin.name || "Coin"}
                    width={140}
                    height={140}
                    className="object-contain w-36 h-36"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-[#d4af37] flex items-center justify-center">
                    <span className="text-white text-3xl font-bold">$</span>
                  </div>
                )}
                {coin.type && (
                  <span className="absolute top-2 right-2 px-2 py-1 text-xs font-semibold bg-[#2c5282] text-white">
                    {formatCoinType(coin.type)}
                  </span>
                )}
              </div>
              <div className="p-3 border-t border-[#cccccc]">
                <h3 className="font-semibold text-[#333333] text-base truncate">
                  {coin.name}
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[#666666] text-xs">
                    {coin.country} {coin.year && `• ${coin.year}`}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xl font-bold text-[#8b6914]">
                    ${(coin.price / 100).toFixed(2)}
                  </span>
                  <span className="text-xs text-[#2c5282] bg-[#e8f0f8] px-2 py-1 font-medium">
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
