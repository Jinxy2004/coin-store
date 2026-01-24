"use server";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

export default async function coin({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const coin = await prisma.coins.findUnique({
    where: { id: Number((await params).id) },
  });

  if (!coin) {
    return (
      <main className="min-h-screen bg-slate-50 pt-6">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-slate-600 text-lg">Coin not found</p>
            <Link
              href="/coins"
              className="text-amber-700 hover:text-amber-800 font-medium mt-4 inline-block"
            >
              ← Back to coins
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const {
    id,
    name,
    year,
    country,
    price,
    description,
    denomination,
    imageUrl,
  } = coin;
  let { type } = coin;
  switch (type) {
    case "gold":
      type = "Gold";
      break;
    case "silver":
      type = "Silver";
      break;
    case "historical_gold":
      type = "Historical Gold";
      break;
    case "historical_silver":
      type = "Historical Silver";
      break;
    case "historical":
      type = "Historical";
      break;
    default:
      break;
  }
  return (
    <main className="bg-slate-50 min-h-screen pt-8 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link
          href="/coins"
          className="text-amber-700 hover:text-amber-800 font-medium mb-6 inline-flex items-center gap-1 transition-colors"
        >
          ← Back to coins
        </Link>

        <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Image Section */}
            {imageUrl && (
              <div className="flex items-center justify-center bg-slate-50 rounded-lg p-6 border border-slate-200">
                <div className="relative w-full h-96">
                  <Image
                    src={imageUrl}
                    alt={name || "Coin image"}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            )}

            {/* Details Section */}
            <div className="flex flex-col justify-between">
              <div>
                <h1 className="text-4xl font-bold text-slate-800 mb-2">
                  {name}
                </h1>
                <p className="text-slate-600 text-lg mb-6">{description}</p>

                <div className="space-y-4 mb-8">
                  {year && (
                    <div className="border-b border-slate-200 pb-4">
                      <span className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                        Year
                      </span>
                      <p className="text-2xl font-semibold text-slate-800 mt-1">
                        {year}
                      </p>
                    </div>
                  )}
                  {country && (
                    <div className="border-b border-slate-200 pb-4">
                      <span className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                        Country
                      </span>
                      <p className="text-2xl font-semibold text-slate-800 mt-1">
                        {country}
                      </p>
                    </div>
                  )}
                  {type && (
                    <div className="border-b border-slate-200 pb-4">
                      <span className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                        Type
                      </span>
                      <p className="text-2xl font-semibold text-slate-800 mt-1">
                        {type}
                      </p>
                    </div>
                  )}
                  {denomination && (
                    <div className="border-b border-slate-200 pb-4">
                      <span className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                        Denomination
                      </span>
                      <p className="text-2xl font-semibold text-slate-800 mt-1">
                        {denomination}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Price Section */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <span className="text-sm font-semibold text-amber-700 uppercase tracking-wide">
                  Price
                </span>
                <p className="text-4xl font-bold text-amber-800 mt-2">
                  ${(price / 100).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
