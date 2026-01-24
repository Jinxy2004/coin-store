"use client";
import clsx from "clsx";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Coin = {
  id: number;
  name: string | null;
  year: number | null;
  imageUrl: string | null;
  price?: number | null;
};

export default function CoinsList({ coins }: { coins: Coin[] }) {
  const [activeId, setActiveId] = useState<number | null>(null);

  if (coins.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <p className="text-slate-600 text-lg">
            No coins found matching your filters
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 text-slate-600 font-medium">
        Showing {coins.length} coin{coins.length !== 1 ? "s" : ""}
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coins.map((coin) => (
          <li key={coin.id}>
            <Link
              href={`/coins/${coin.id}`}
              onMouseOver={() => setActiveId(coin.id)}
              onMouseLeave={() => setActiveId(null)}
              className={clsx(
                "block p-5 rounded-lg transition-all duration-200 h-full",
                "border border-slate-200 hover:border-amber-400",
                "shadow-sm hover:shadow-md",
                activeId === coin.id
                  ? "bg-amber-50 border-amber-400"
                  : "bg-white hover:bg-slate-50",
              )}
            >
              {coin.imageUrl && (
                <div className="mb-4 rounded-md overflow-hidden bg-slate-100 p-4 h-56 flex items-center justify-center border border-slate-200">
                  <Image
                    src={coin.imageUrl}
                    alt={coin.name || "Coin image"}
                    width={200}
                    height={200}
                    className="object-contain w-full h-full"
                    priority
                  />
                </div>
              )}
              <div className="text-center flex-1 flex flex-col justify-center">
                <strong className="text-slate-800 block mb-1 text-lg">
                  {coin.name}
                </strong>
                <p className="text-slate-600 text-sm mb-2">{coin.year}</p>
                {coin.price && (
                  <p className="text-amber-700 font-semibold">
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
