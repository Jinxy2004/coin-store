import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AdminPage() {
  return (
    <main className="min-h-screen bg-white p-6">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold text-[#2c5282] mb-4 border-b-2 border-[#d4af37] pb-2">
          Admin Dashboard
        </h1>
        <div className="bg-[#f5f5f5] border border-[#cccccc] p-4">
          <Button asChild>
            <Link href="/admin/coin-add">Add a coin</Link>
          </Button>
        </div>
        <div className="bg-[#f5f5f5] border border-[#cccccc] p-4">
          <Button asChild>
            <Link href="/coins">Modify a coin</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
