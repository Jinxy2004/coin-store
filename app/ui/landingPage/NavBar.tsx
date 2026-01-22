import Link from "next/link";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import NavButton from "@/components/ui/NavButton";

const Navbar = async () => {
  const { isAuthenticated } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();

  return (
    <>
      <div className="w-full h-20 bg-slate-900 from-slate-900 via-slate-800 to-slate-900 sticky top-0 z-50 border-b border-slate-700 shadow-lg backdrop-blur-md">
        <div className="container mx-auto px-4 h-full">
          <div className="grid grid-cols-3 items-center h-full">
            <ul className="col-start-2 justify-self-center hidden md:flex gap-x-8 text-slate-200 font-medium">
              <li>
                <NavButton href="/">Home Page</NavButton>
              </li>
              <li>
                <NavButton href="/coins">Coins</NavButton>
              </li>
              <li>
                <NavButton href="/coins?type=silver">Silver</NavButton>
              </li>
              <li>
                <NavButton href="/coins?type=gold">Gold</NavButton>
              </li>
            </ul>

            {isUserAuthenticated ? (
              <Button
                asChild
                className="justify-self-end bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md hover:shadow-lg transition-all"
              >
                <LogoutLink>Logout</LogoutLink>
              </Button>
            ) : (
              <Button
                asChild
                className="justify-self-end bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-md hover:shadow-lg transition-all"
              >
                <Link href="/login">
                  <p>Sign in / Sign up</p>
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
