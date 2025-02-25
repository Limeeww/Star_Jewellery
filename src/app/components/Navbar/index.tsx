"use client";

import React, { useState } from "react";
import Link from "next/link";

import { LuSearch, LuUserRound, LuShoppingBag } from "react-icons/lu";
import SearchOverlay from "./SearchOverlay";

const Navbar = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cartItemCount, setCartItemCount] = useState<number>(100);
  const [open, setOpen] = useState<boolean>(false);

  return (
    <header className="w-full bg-gray-100">
      <nav className="container mx-auto flex items-center justify-between py-4 px-4 md:px-0">
        <div className="hidden md:flex space-x-8">
          <Link
            href="/about-us"
            className="text-sm font-medium text-gray-800 hover:text-gray-500 transition-colors"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            ABOUT US
          </Link>
          <Link
            href="/catalog"
            className="text-sm font-medium text-gray-800 hover:text-gray-500 transition-colors"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            CATALOG
          </Link>
          <Link
            href="/collections"
            className="text-sm font-medium text-gray-800 hover:text-gray-500 transition-colors"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            COLLECTIONS
          </Link>
          <Link
            href="/projects"
            className="text-sm font-medium text-gray-800 hover:text-gray-500 transition-colors"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            PROJECTS
          </Link>
        </div>

        <div
          className="absolute left-1/2 transform text-gray-800 -translate-x-1/2 text-3xl md:text-3xl font-bold tracking-wide"
          style={{
            fontFamily: "var(--font-playfair)",
            letterSpacing: "0.05em",
          }}
        >
          <Link href="/">STAR</Link>
        </div>

        <div className="flex items-center space-x-7">
          <Link href="/profile" className="text-gray-800 hover:text-gray-500">
            <LuUserRound size={20} />
          </Link>
          <button className="text-gray-800 hover:text-gray-500 border-none outline-none focus:outline-none shadow-none focus:shadow-none border-none">
            <LuSearch onClick={() => setOpen(true)} size={20} />
          </button>
          <Link
            href="/cart"
            className="relative text-gray-800 hover:text-gray-500"
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
      <SearchOverlay open={open} onClose={() => setOpen(false)} />
    </header>
  );
};

export default Navbar;
