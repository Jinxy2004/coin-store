import Link from "next/link";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import FeaturedCoinsCarousel from "./ui/landingPage/FeaturedCoinsCarousel";

async function getHighValueCoins() {
  const coins = await prisma.coins.findMany({
    orderBy: {
      price: "desc",
    },
    take: 12,
    select: {
      id: true,
      name: true,
      year: true,
      imageUrl: true,
      price: true,
      type: true,
      country: true,
    },
  });
  return coins;
}

export default async function Home() {
  const featuredCoins = await getHighValueCoins();

  return (
    <main className="min-h-screen bg-white">
      <section className="container mx-auto px-4 pt-12 pb-10 border-b border-[#cccccc]">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#2c5282] mb-4">
            Grandpa's Coin Store
          </h1>
          <p className="text-lg md:text-xl text-[#555555] mb-6">
            Discover rare and valuable coins from around the world. Build your
            collection with authentic pieces backed by our quality guarantee.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="text-base px-8">
              <Link href="/coins">Browse Collection</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-base px-8 border-2 border-[#d4af37] text-[#8b6914] hover:bg-[#faf8f0]"
            >
              <Link href="/coins?type=gold">View Gold Coins</Link>
            </Button>
          </div>
        </div>
      </section>

      <FeaturedCoinsCarousel coins={featuredCoins} />

      <section className="container mx-auto px-4 py-10 bg-[#f5f5f5] border-y border-[#cccccc]">
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="bg-white p-6 border border-[#cccccc] hover:border-[#d4af37]">
            <h3 className="text-lg font-semibold text-[#2c5282] mb-2 border-b border-[#d4af37] pb-2">
              Authenticated Quality
            </h3>
            <p className="text-[#555555] text-sm">
              Every coin is carefully verified for authenticity.
            </p>
          </div>

          <div className="bg-white p-6 border border-[#cccccc] hover:border-[#d4af37]">
            <h3 className="text-lg font-semibold text-[#2c5282] mb-2 border-b border-[#d4af37] pb-2">
              Rare Finds
            </h3>
            <p className="text-[#555555] text-sm">
              Access exclusive collections of gold and silver coins with
              historical significance and investment value.
            </p>
          </div>

          <div className="bg-white p-6 border border-[#cccccc] hover:border-[#d4af37]">
            <h3 className="text-lg font-semibold text-[#2c5282] mb-2 border-b border-[#d4af37] pb-2">
              Secure Trading
            </h3>
            <p className="text-[#555555] text-sm">
              Shop with confidence using our secure payment system and insured
              shipping for all orders.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-[#2c5282] mb-8 border-b-2 border-[#d4af37] pb-2 max-w-md mx-auto">
          Explore by Category
        </h2>
        <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          <Link href="/coins?type=gold" className="group">
            <div className="bg-[#faf8f0] p-8 border-2 border-[#d4af37] hover:bg-[#f5f0e0]">
              <h3 className="text-xl font-bold text-[#8b6914] mb-2">
                Gold Coins
              </h3>
              <p className="text-[#555555] text-sm">
                Timeless investments and collector favorites crafted from
                precious gold.
              </p>
            </div>
          </Link>

          <Link href="/coins?type=silver" className="group">
            <div className="bg-[#f5f5f5] p-8 border-2 border-[#999999] hover:bg-[#e8e8e8]">
              <h3 className="text-xl font-bold text-[#555555] mb-2">
                Silver Coins
              </h3>
              <p className="text-[#555555] text-sm">
                Beautiful silver pieces perfect for both collectors and
                investors.
              </p>
            </div>
          </Link>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 pb-16">
        <div className="max-w-3xl mx-auto text-center bg-[#f5f5f5] p-8 border-2 border-[#cccccc]">
          <h2 className="text-2xl font-bold text-[#2c5282] mb-3">
            Start Your Collection Today
          </h2>
          <p className="text-[#555555] mb-6">
            Join thousands of collectors who trust us for their numismatic
            needs.
          </p>
          <Button asChild size="lg" className="text-base px-10">
            <Link href="/coins">View All Coins</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
