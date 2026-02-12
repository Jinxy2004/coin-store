import { redirect } from "next/navigation";
import { isAdminUserWithAuth, isUserAuthenticated } from "@/lib/auth";

// Layout for making sure current user always has admin access
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isUserAuthenticated())) redirect("/login");
  if (!(await isAdminUserWithAuth())) {
    redirect("/");
  }

  return <>{children}</>;
}
