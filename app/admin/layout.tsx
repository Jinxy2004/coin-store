import { redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

// Layout for making sure current user always has admin access
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, getRoles } = getKindeServerSession();

  if (!(await isAuthenticated())) redirect("/login");

  const roles = await getRoles();
  const hasAdminRole = roles?.some((role) => role.key === "site-manager");

  if (!hasAdminRole) {
    redirect("/");
  }

  return <>{children}</>;
}
