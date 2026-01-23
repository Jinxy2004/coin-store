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
      className={`relative px-3 py-2 rounded-md transition-all duration-200 hover:text-white hover:bg-slate-900/50 active:scale-95 group ${className}`}
    >
      {children}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}
