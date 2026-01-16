import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AdminPage() {
  return (
    <main>
      <div>Admin DashBoard</div>
      <Button asChild>
        <Link href="/admin/coin-add">Add a coin</Link>
      </Button>
    </main>
  );
}
