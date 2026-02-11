import AdminCoinsList from "@/app/ui/coinsUI/AdminCoinsList";
import { prisma } from "@/lib/prisma";

export default async function CoinModify() {
  const coins = await prisma.coins.findMany({
    select: {
      id: true,
      name: true,
      year: true,
      imageUrl: true,
      price: true,
      type: true,
      country: true,
      stock: true,
    },
  });

  return (
    <div>
      <div className="lg:col-span-3">
        <AdminCoinsList coins={coins} />
      </div>
    </div>
  );
}
