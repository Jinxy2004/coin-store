import { LogoutLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";
import { isAdminUserWithAuth, isUserAuthenticated } from "@/lib/auth";
import NavButton from "@/components/ui/NavButton";
import CartIcon from "@/app/ui/cart/CartIcon";

const Navbar = async () => {
  const isAuthenticated = await isUserAuthenticated();
  const isAdmin = await isAdminUserWithAuth();

  return (
    <>
      <div className="w-full h-16 bg-white sticky top-0 z-50 border-b-2 border-[#cccccc]">
        <div className="container mx-auto px-4 h-full">
          <div className="relative flex items-center h-full">
            <ul className="absolute left-1/2 -translate-x-1/2 flex gap-x-6 text-[#333333] font-medium whitespace-nowrap">
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
              {isAdmin ? (
                <li>
                  <NavButton href="/admin">Admin</NavButton>
                </li>
              ) : (
                <div></div>
              )}
            </ul>

            {isAuthenticated ? (
              <div className="ml-auto flex items-center gap-4 shrink-0">
                <CartIcon isAuthenticated={isAuthenticated} />
                <Button asChild variant="destructive" className="font-semibold">
                  <LogoutLink>Logout</LogoutLink>
                </Button>
              </div>
            ) : (
              <Button asChild className="ml-auto shrink-0 font-semibold">
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
