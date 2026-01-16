import { prisma } from "@/lib/prisma";
import CoinsList from "@/app/ui/coinsUI/CoinsList";
import SearchBar from "../ui/coinsUI/SearchBar";

export default async function allCoins(props: {
  searchParams?: Promise<{
    type?: string;
    yearMin?: string;
    yearMax?: string;
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
    },
  });
  return (
    <main style={{ padding: 20 }}>
      <h1 className="text-xl font-semibold">Coins</h1>
      <SearchBar />
      <CoinsList coins={coins} />
    </main>
  );
}
