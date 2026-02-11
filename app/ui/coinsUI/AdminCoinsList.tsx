"use client";
import clsx from "clsx";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Coin = {
  id: number;
  name: string | null;
  price: number;
  imageUrl: string | null;
  year: number | null;
  country: string | null;
  stock: number;
};

export default function CoinsList({ coins }: { coins: Coin[] }) {
  const [activeId, setActiveId] = useState<number | null>(null);

  if (coins.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-[#666666]">No coins found matching your filters</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 text-[#666666] font-medium text-sm">
        Showing {coins.length} coin{coins.length !== 1 ? "s" : ""}
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {coins.map((coin) => (
          <li key={coin.id}>
            <Link
              href={"/admin/coin-modify/modify-form"}
              onMouseOver={() => setActiveId(coin.id)}
              onMouseLeave={() => setActiveId(null)}
              className={clsx(
                "block p-4 h-full",
                "border border-[#cccccc] hover:border-[#d4af37]",
                activeId === coin.id
                  ? "bg-[#faf8f0] border-[#d4af37]"
                  : "bg-white hover:bg-[#f9f9f9]",
              )}
            >
              {coin.imageUrl && (
                <div className="mb-3 overflow-hidden bg-[#f5f5f5] p-3 h-48 flex items-center justify-center border border-[#e0e0e0]">
                  <Image
                    src={coin.imageUrl}
                    alt={coin.name || "Coin image"}
                    width={180}
                    height={180}
                    className="object-contain w-full h-full"
                    priority
                  />
                </div>
              )}
              <div className="text-center flex-1 flex flex-col justify-center">
                <strong className="text-[#333333] block mb-1">
                  {coin.name}
                </strong>
                <p className="text-[#666666] text-sm mb-1">{coin.year}</p>
                {coin.price && (
                  <p className="text-[#8b6914] font-semibold">
                    ${(coin.price / 100).toFixed(2)}
                  </p>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
