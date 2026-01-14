import { prisma } from "@/lib/prisma";
import Image from "next/image";

export default async function Home() {
  const coins = await prisma.coins.findMany();
  return (
    <main style={{ padding: 20 }}>
      <h1>Stuff</h1>

      <ul>
        {coins.map((p) => (
          <li key={p.id}>
            <strong>{p.name}</strong>
            <p>{p.year}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
