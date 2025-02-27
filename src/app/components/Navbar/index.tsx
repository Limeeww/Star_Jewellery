"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LuSearch, LuShoppingBag, LuMenu } from "react-icons/lu";
import SearchOverlay from "./SearchOverlay";
import MobileMenu from "./MobileMenu";
import NavLinks from "./NavLinks";
import UserBlock from "./UserBlock";

const NAV_LINKS = [
  { href: "/about-us", label: "ABOUT US" },
  { href: "/catalog", label: "CATALOG" },
  { href: "/collections", label: "COLLECTIONS" },
  { href: "/projects", label: "PROJECTS" },
];

export default function Navbar() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cartItemCount, setCartItemCount] = useState<number>(100);
  const [openSearch, setOpenSearch] = useState<boolean>(true);
  const [openMenu, setOpenMenu] = useState<boolean>(false);

  const isLoggedIn = false;

  return (
    <header
      className="
    fixed 
    top-0 
    left-0 
    w-full 
    z-50 
    group
    transition-colors 
    duration-300
  "
      style={{ fontFamily: "var(--font-poppins)" }}
    >
      <div
        className="
      bg-transparent 
      group-hover:bg-gray-100 
      transition-colors 
      duration-300
    "
      >
        <MobileMenu
          open={openMenu}
          onClose={() => setOpenMenu(false)}
          isLoggedIn={isLoggedIn}
        />

        <nav className="flex items-center justify-between px-4 py-4 xl:px-6">
          <button
            onClick={() => setOpenMenu(true)}
            className="
          text-white 
          group-hover:text-gray-800 
          transition-colors 
          duration-300 
          border-none 
          outline-none 
          focus:outline-none 
          xl:hidden
        "
          >
            <LuMenu size={24} />
          </button>

          <div
            className="
          absolute 
          left-1/2 
          -translate-x-1/2 
          text-3xl 
          xl:text-3xl 
          font-bold 
          tracking-wide
          text-white 
          group-hover:text-gray-800 
          transition-colors 
          duration-300
        "
            style={{
              fontFamily: "var(--font-playfair)",
              letterSpacing: "0.05em",
            }}
          >
            <Link href="/">STAR</Link>
          </div>

          <div className="hidden xl:flex space-x-8">
            <NavLinks
              links={NAV_LINKS}
              linkClass="
            text-md 
            font-medium 
            text-white 
            group-hover:text-gray-800 
            transition-colors 
            duration-300
          "
            />
          </div>

          <div className="flex items-center space-x-7">
            <div className="hidden xl:flex xl:space-x-4">
              <UserBlock isLoggedIn={isLoggedIn} />
            </div>

            <button
              onClick={() => setOpenSearch(true)}
              className="
            text-white 
            group-hover:text-gray-800 
            transition-colors 
            duration-300 
            border-none 
            outline-none 
            focus:outline-none
          "
            >
              <LuSearch size={20} />
            </button>

            <Link
              href="/cart"
              className="
            relative 
            text-white 
            group-hover:text-gray-800 
            transition-colors 
            duration-300
          "
            >
              <LuShoppingBag size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount > 9 ? "9+" : cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </nav>
      </div>

      <SearchOverlay open={openSearch} onClose={() => setOpenSearch(false)} />
    </header>
  );
}
