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
    <main className="min-h-screen bg-slate-50">
      <section className="container mx-auto px-4 pt-20 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-amber-800 mb-6">
            Grandpa's Coin Store
          </h1>
          <p className="text-xl md:text-2xl text-slate-700 mb-8 leading-relaxed">
            Discover rare and valuable coins from around the world. Build your
            collection with authentic pieces backed by our quality guarantee.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-amber-700 hover:bg-amber-800 text-white text-lg px-8 shadow-md"
            >
              <Link href="/coins">Browse Collection</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg px-8 border-2 border-amber-700 text-amber-800 hover:bg-amber-50"
            >
              <Link href="/coins?type=gold">View Gold Coins</Link>
            </Button>
          </div>
        </div>
      </section>

      <FeaturedCoinsCarousel coins={featuredCoins} />

      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white p-8 rounded-lg border border-slate-200 hover:border-amber-400 hover:shadow-lg transition-all">
            <h3 className="text-xl font-semibold text-amber-800 mb-3">
              Authenticated Quality
            </h3>
            <p className="text-slate-600">
              Every coin is carefully verified for authenticity.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg border border-slate-200 hover:border-amber-400 hover:shadow-lg transition-all">
            <h3 className="text-xl font-semibold text-amber-800 mb-3">
              Rare Finds
            </h3>
            <p className="text-slate-600">
              Access exclusive collections of gold and silver coins with
              historical significance and investment value.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg border border-slate-200 hover:border-amber-400 hover:shadow-lg transition-all">
            <h3 className="text-xl font-semibold text-amber-800 mb-3">
              Secure Trading
            </h3>
            <p className="text-slate-600">
              Shop with confidence using our secure payment system and insured
              shipping for all orders.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-amber-800 mb-12">
          Explore by Category
        </h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Link href="/coins?type=gold" className="group">
            <div className="bg-amber-50 p-10 rounded-lg border-2 border-amber-300 hover:border-amber-500 transition-all hover:shadow-lg">
              <h3 className="text-2xl font-bold text-amber-800 mb-3 group-hover:text-amber-900 transition-colors">
                Gold Coins
              </h3>
              <p className="text-slate-700">
                Timeless investments and collector favorites crafted from
                precious gold.
              </p>
            </div>
          </Link>

          <Link href="/coins?type=silver" className="group">
            <div className="bg-slate-100 p-10 rounded-lg border-2 border-slate-300 hover:border-slate-400 transition-all hover:shadow-lg">
              <h3 className="text-2xl font-bold text-slate-700 mb-3 group-hover:text-slate-800 transition-colors">
                Silver Coins
              </h3>
              <p className="text-slate-700">
                Beautiful silver pieces perfect for both collectors and
                investors.
              </p>
            </div>
          </Link>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 pb-24">
        <div className="max-w-3xl mx-auto text-center bg-white p-12 rounded-lg border-2 border-amber-300 shadow-lg">
          <h2 className="text-3xl font-bold text-amber-800 mb-4">
            Start Your Collection Today
          </h2>
          <p className="text-slate-700 mb-8 text-lg">
            Join thousands of collectors who trust us for their numismatic
            needs.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-amber-700 hover:bg-amber-800 text-white text-lg px-10 shadow-md"
          >
            <Link href="/coins">View All Coins</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
