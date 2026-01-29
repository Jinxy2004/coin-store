import Link from "next/link";
import * as React from "react";

type NavButtonProps = React.ComponentProps<typeof Link> & {
  children: React.ReactNode;
  className?: string;
};

export default function NavButton({
  children,
  className = "",
  ...linkProps
}: NavButtonProps) {
  return (
    <Link
      {...linkProps}
      className={`px-3 py-2 hover:text-[#2c5282] hover:bg-[#f0f0f0] border-b-2 border-transparent hover:border-[#d4af37] ${className}`}
    >
      {children}
    </Link>
  );
}
