import { prisma } from "@/lib/prisma";
import CoinsList from "@/app/ui/coinsUI/CoinsList";
import Filters from "@/app/ui/coinsUI/Filters";

export default async function allCoins(props: {
  searchParams?: Promise<{
    type?: string;
    yearMin?: string;
    yearMax?: string;
    country?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const coins = await prisma.coins.findMany({
    where: {
      type: searchParams?.type,
      year: {
        gte: searchParams?.yearMin ? Number(searchParams.yearMin) : undefined,
        lte: searchParams?.yearMax ? Number(searchParams.yearMax) : undefined,
      },
      country: searchParams?.country,
    },
  });
  return (
    <main className="bg-slate-50 min-h-screen pt-6">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800">Coins</h1>
          <p className="text-slate-600 mt-2">
            Browse our collection of rare and collectible coins
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Filters />
          </div>

          {/* Coins Grid */}
          <div className="lg:col-span-3">
            <CoinsList coins={coins} />
          </div>
        </div>
      </div>
    </main>
  );
}
