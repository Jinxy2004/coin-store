import { prisma } from "@/lib/prisma";

export default async function coin({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const coin = await prisma.coins.findUnique({
    where: { id: Number((await params).id) },
  });

  // Add a coin skeleton later
  if (!coin) return <div>Coin not found</div>;
  return (
    <main>
      <h1>Coin: {coin.id}</h1>
    </main>
  );
}
