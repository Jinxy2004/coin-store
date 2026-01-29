"use server";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import AddToCartButton from "@/app/ui/cart/AddToCartButton";

export default async function coin({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { isAuthenticated } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();

  const coin = await prisma.coins.findUnique({
    where: { id: Number((await params).id) },
  });

  if (!coin) {
    return (
      <main className="min-h-screen bg-white pt-4">
        <div className="container mx-auto px-4">
          <div className="bg-[#f5f5f5] border border-[#cccccc] p-6 text-center">
            <p className="text-[#666666]">Coin not found</p>
            <Link
              href="/coins"
              className="text-[#2c5282] hover:text-[#1e3a5f] font-medium mt-4 inline-block"
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
    stock,
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
    <main className="bg-white min-h-screen pt-6 pb-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link
          href="/coins"
          className="text-[#2c5282] hover:text-[#1e3a5f] font-medium mb-4 inline-flex items-center gap-1"
        >
          ← Back to coins
        </Link>

        <div className="bg-white border-2 border-[#cccccc] overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {/* Image Section */}
            {imageUrl && (
              <div className="flex items-center justify-center bg-[#f5f5f5] p-4 border border-[#e0e0e0]">
                <div className="relative w-full h-80">
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
                <h1 className="text-3xl font-bold text-[#2c5282] mb-2">
                  {name}
                </h1>
                <p className="text-[#666666] mb-4">{description}</p>

                <div className="space-y-3 mb-6">
                  {year && (
                    <div className="border-b border-[#e0e0e0] pb-3">
                      <span className="text-xs font-semibold text-[#888888] uppercase tracking-wide">
                        Year
                      </span>
                      <p className="text-xl font-semibold text-[#333333] mt-1">
                        {year}
                      </p>
                    </div>
                  )}
                  {country && (
                    <div className="border-b border-[#e0e0e0] pb-3">
                      <span className="text-xs font-semibold text-[#888888] uppercase tracking-wide">
                        Country
                      </span>
                      <p className="text-xl font-semibold text-[#333333] mt-1">
                        {country}
                      </p>
                    </div>
                  )}
                  {type && (
                    <div className="border-b border-[#e0e0e0] pb-3">
                      <span className="text-xs font-semibold text-[#888888] uppercase tracking-wide">
                        Type
                      </span>
                      <p className="text-xl font-semibold text-[#333333] mt-1">
                        {type}
                      </p>
                    </div>
                  )}
                  {denomination && (
                    <div className="border-b border-[#e0e0e0] pb-3">
                      <span className="text-xs font-semibold text-[#888888] uppercase tracking-wide">
                        Denomination
                      </span>
                      <p className="text-xl font-semibold text-[#333333] mt-1">
                        {denomination}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Price Section */}
              <div className="bg-[#faf8f0] border-2 border-[#d4af37] p-4">
                <span className="text-xs font-semibold text-[#8b6914] uppercase tracking-wide">
                  Price
                </span>
                <p className="text-3xl font-bold text-[#8b6914] mt-1">
                  ${(price / 100).toFixed(2)}
                </p>

                {/* Stock Status */}
                <div className="mt-2 mb-2">
                  {stock > 0 ? (
                    <span
                      className={`text-sm font-medium ${stock <= 5 ? "text-[#cc6600]" : "text-[#228b22]"}`}
                    >
                      {stock <= 5 ? `Only ${stock} left!` : `${stock} in stock`}
                    </span>
                  ) : (
                    <span className="text-sm font-medium text-[#cc3333]">
                      Out of Stock
                    </span>
                  )}
                </div>

                <AddToCartButton
                  coinId={id}
                  isAuthenticated={isUserAuthenticated ?? false}
                  stock={stock}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
