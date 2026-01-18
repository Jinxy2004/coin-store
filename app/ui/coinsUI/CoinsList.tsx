"use client";
import clsx from "clsx";
import { useState } from "react";
import Link from "next/link";

type Coin = {
  id: number;
  name: string | null;
  year: number | null;
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
                "block p-3 rounded-md transition",
                activeId === coin.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              )}
            >
              <strong>{coin.name}</strong>
              <p>{coin.year}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
