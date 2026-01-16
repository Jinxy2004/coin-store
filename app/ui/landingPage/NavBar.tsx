import Link from "next/link";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const Navbar = async () => {
  const { isAuthenticated } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();

  return (
    <>
      <div className="w-full h-20 bg-gray-500 sticky top-0">
        <div className="container mx-auto px-4 h-full">
          <div className="flex justify-between items-center h-full">
            <ul className="hidden md:flex gap-x-6 dark:text-black text-gray">
              <li>
                <Link href="/">
                  <p>Home Page</p>
                </Link>
              </li>
              <li>
                <Link href="/coins">
                  <p>Coins</p>
                </Link>
              </li>
              <li>
                <Link href="/coins?type=silver">
                  <p>Silver</p>
                </Link>
              </li>
            </ul>

            {isUserAuthenticated ? (
              <Button asChild>
                <LogoutLink>Logout</LogoutLink>
              </Button>
            ) : (
              <Button asChild>
                <Link href="/login">
                  <p>Sign in/Sign up</p>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
