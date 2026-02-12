import { prisma } from "@/lib/prisma";
import CoinsList from "@/app/ui/coinsUI/CoinsList";
import Filters from "@/app/ui/coinsUI/Filters";
import { isAdminUserWithAuth } from "@/lib/auth";

export default async function allCoins(props: {
  searchParams?: Promise<{
    type?: string;
    yearMin?: string;
    yearMax?: string;
    country?: string;
  }>;
}) {
  const isAdmin = await isAdminUserWithAuth();
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
    <main className="bg-white min-h-screen pt-4">
      <div className="container mx-auto px-4">
        <div className="mb-6 border-b-2 border-[#d4af37] pb-3">
          <h1 className="text-3xl font-bold text-[#2c5282]">Coins</h1>
          <p className="text-[#666666] mt-1 text-sm">
            Browse our collection of rare and collectible coins
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Filters />
          </div>

          {/* Coins Grid */}
          <div className="lg:col-span-3">
            <CoinsList coins={coins} isAdmin={isAdmin} />
          </div>
        </div>
      </div>
    </main>
  );
}
