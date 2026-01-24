import Link from "next/link";
import { LogoutLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import NavButton from "@/components/ui/NavButton";

const Navbar = async () => {
  const { isAuthenticated } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();

  return (
    <>
      <div className="w-full h-20 bg-white sticky top-0 z-50 border-b border-slate-200 shadow-md backdrop-blur-md">
        <div className="container mx-auto px-4 h-full">
          <div className="grid grid-cols-3 items-center h-full">
            <ul className="col-start-2 justify-self-center hidden md:flex gap-x-8 text-slate-700 font-medium">
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
                className="justify-self-end bg-red-600 hover:bg-red-700 text-white font-semibold shadow-sm hover:shadow-md transition-all"
              >
                <LogoutLink>Logout</LogoutLink>
              </Button>
            ) : (
              <Button
                asChild
                className="justify-self-end bg-amber-700 hover:bg-amber-800 text-white font-semibold shadow-sm hover:shadow-md transition-all"
              >
                <LoginLink>Sign in / Sign up</LoginLink>
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
