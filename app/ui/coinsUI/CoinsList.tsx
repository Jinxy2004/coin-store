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
};

export default function CoinsList({ coins }: { coins: Coin[] }) {
  const [activeId, setActiveId] = useState<number | null>(null);

  return (
    <main style={{ padding: 20 }}>
      <div className="justify-center align-middle"></div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coins.map((coin) => (
          <li
            key={coin.id}
            onMouseOver={() => setActiveId(coin.id)}
            onMouseLeave={() => setActiveId(0)}
          >
            <Link
              href={`../../coins/${coin.id}`}
              className={clsx(
                "p-3 rounded-md transition h-100 flex flex-col",
                activeId === coin.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200",
              )}
            >
              {coin.imageUrl && (
                <div className="mb-4 border-4 border-gray-300 rounded-md overflow-hidden bg-white p-4 h-70 flex items-center justify-center">
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
                <strong>{coin.name}</strong>
                <p>{coin.year}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
