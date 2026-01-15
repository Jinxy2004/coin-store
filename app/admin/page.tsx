import { redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Button } from "@/components/ui/button";

export default async function AdminPage() {
  const { isAuthenticated, getRoles } = getKindeServerSession();

  if (!(await isAuthenticated())) redirect("/login");

  const roles = await getRoles();

  const hasAdminRole = roles?.some((role) => role.key === "site-manager");
  if (!hasAdminRole) {
    redirect("/");
  }

  return (
    <main>
      <div>Admin DashBoard</div>
      <Button asChild></Button>
    </main>
  );
}
