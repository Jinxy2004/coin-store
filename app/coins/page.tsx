import { prisma } from "@/lib/prisma";

export default async function allCoins() {
  const coins = await prisma.coins.findMany();
  return <h1>Hello</h1>;
}
