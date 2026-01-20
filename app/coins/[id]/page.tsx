"use server";
import { prisma } from "@/lib/prisma";
import Image from "next/image";

export default async function coin({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const coin = await prisma.coins.findUnique({
    where: { id: Number((await params).id) },
  });

  if (!coin) return <div>Coin not found</div>;

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
      type = "G" + type.slice(1);
      break;
    case "silver":
      type = "S" + type.slice(1);
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
    <main className="max-w-4xl mx-auto p-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-4">{name}</h1>

        {imageUrl && (
          <div className="relative w-full h-96 mb-6">
            <Image
              src={imageUrl}
              alt={name || "Coin image"}
              fill
              className="object-contain"
              priority
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-lg">
          {year && (
            <div>
              <span className="font-semibold">Year:</span> {year}
            </div>
          )}
          {country && (
            <div>
              <span className="font-semibold">Country:</span> {country}
            </div>
          )}
          <div>
            <span className="font-semibold">Price:</span> ${price}
          </div>
          {type && (
            <div>
              <span className="font-semibold">Type:</span> {type}
            </div>
          )}
          {denomination && (
            <div>
              <span className="font-semibold">Denomination:</span>{" "}
              {denomination}
            </div>
          )}
        </div>

        {description && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{description}</p>
          </div>
        )}
      </div>
    </main>
  );
}
