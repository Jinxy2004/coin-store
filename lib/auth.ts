import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const ADMIN_ROLE_KEY = "site-manager";

export async function isUserAuthenticated() {
  const { isAuthenticated } = getKindeServerSession();
  return Boolean(await isAuthenticated());
}

export async function isAdminUser() {
  const { getRoles } = getKindeServerSession();
  const roles = await getRoles();
  return roles?.some((role) => role.key === ADMIN_ROLE_KEY) ?? false;
}

export async function isAdminUserWithAuth() {
  const authenticated = await isUserAuthenticated();
  if (!authenticated) return false;
  return isAdminUser();
}
