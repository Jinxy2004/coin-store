import Link from "next/link";
import { LogoutLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";
import { isUserAuthenticated } from "@/lib/auth";
import NavButton from "@/components/ui/NavButton";
import CartIcon from "@/app/ui/cart/CartIcon";

const Navbar = async () => {
  const isAuthenticated = await isUserAuthenticated();

  return (
    <>
      <div className="w-full h-16 bg-white sticky top-0 z-50 border-b-2 border-[#cccccc]">
        <div className="container mx-auto px-4 h-full">
          <div className="grid grid-cols-3 items-center h-full">
            <ul className="col-start-2 justify-self-center hidden md:flex gap-x-6 text-[#333333] font-medium">
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

            {isAuthenticated ? (
              <div className="flex items-center gap-4 justify-self-end">
                <CartIcon isAuthenticated={isAuthenticated} />
                <Button asChild variant="destructive" className="font-semibold">
                  <LogoutLink>Logout</LogoutLink>
                </Button>
              </div>
            ) : (
              <Button asChild className="justify-self-end font-semibold">
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
