import { prisma } from "@/lib/prisma";
import CoinsList from "@/app/ui/coinsUI/CoinsList";

export default async function allCoins() {
  const coins = await prisma.coins.findMany();
  return (
    <main style={{ padding: 20 }}>
      <h1 className="text-xl font-semibold">Coins</h1>
      <CoinsList coins={coins} />
    </main>
  );
}
