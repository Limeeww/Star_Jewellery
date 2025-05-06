"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LuSearch, LuShoppingBag, LuMenu } from "react-icons/lu";
import SearchOverlay from "./SearchOverlay";
import MobileMenu from "./MobileMenu";
import NavLinks from "./NavLinks";
import UserBlock from "./UserBlock";
import CartSideModal from "@/app/components/SideModal/CartSideModal";
import { useCartContext } from "@/app/contexts/CartContent";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebaseConfig";

const NAV_LINKS = [
  { href: "/about-us", label: "ABOUT US" },
  { href: "/Catalog", label: "CATALOG" },
  { href: "/Collections", label: "COLLECTIONS" },
];

type NavbarProps = {
  isScrolled: boolean;
  isLoggedIn: boolean;
  navLinks?: { label: string; href: string }[];
};

export default function Navbar({
  isScrolled,
  isLoggedIn,
  navLinks = NAV_LINKS,
}: NavbarProps) {
  const [openSearch, setOpenSearch] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [openCartModal, setOpenCartModal] = useState(false);

  const { cartItemCount, cartItems } = useCartContext();
  const [user] = useAuthState(auth);

  return (
    <>
      <header
        className={`
          fixed 
          top-0 
          left-0 
          w-full 
          z-50 
          ${
            isScrolled
              ? "bg-white text-gray-800 shadow-md"
              : "bg-transparent text-white"
          }
          transition-colors 
          duration-300
        `}
        style={{ fontFamily: "var(--font-poppins)" }}
      >
        <MobileMenu
          open={openMenu}
          onClose={() => setOpenMenu(false)}
          isLoggedIn={isLoggedIn}
        />

        <nav className="flex items-center justify-between px-4 py-4 xl:px-8">
          <button
            onClick={() => setOpenMenu(true)}
            className={`
              ${isScrolled ? "text-gray-800" : "text-white"}
              hover:text-gray-500 
              border-none 
              outline-none 
              focus:outline-none 
              xl:hidden
            `}
          >
            <LuMenu size={24} />
          </button>

          <div
            className={`
              absolute 
              left-1/2 
              -translate-x-1/2 
              text-3xl 
              xl:text-3xl 
              font-bold 
              tracking-wide
              ${isScrolled ? "text-gray-800" : "text-white"}
            `}
            style={{
              fontFamily: "var(--font-playfair)",
              letterSpacing: "0.05em",
            }}
          >
            <Link href="/">STAR</Link>
          </div>

          <div className="hidden xl:flex space-x-8">
            <NavLinks
              links={navLinks}
              linkClass={`
                text-md 
                font-medium 
                transition-colors
                ${
                  isScrolled
                    ? "text-gray-800 hover:text-gray-500"
                    : "text-white hover:text-gray-300"
                }
              `}
            />
          </div>

          <div className="flex items-center space-x-7">
            <div className="hidden xl:flex xl:space-x-4">
              <UserBlock isScrolled={isScrolled} isLoggedIn={isLoggedIn} />
            </div>

            <button
              onClick={() => setOpenSearch(true)}
              className={`
                ${isScrolled ? "text-gray-800" : "text-white"}
                hover:text-gray-500 
                border-none 
                outline-none 
                focus:outline-none
              `}
            >
              <LuSearch size={20} />
            </button>

            <button
              onClick={() => setOpenCartModal(true)}
              className={`
                relative
                ${isScrolled ? "text-gray-800" : "text-white"}
                hover:text-gray-500
                border-none
                outline-none
                focus:outline-none
              `}
            >
              <LuShoppingBag size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount > 9 ? "9+" : cartItemCount}
                </span>
              )}
            </button>
          </div>
        </nav>

        <SearchOverlay open={openSearch} onClose={() => setOpenSearch(false)} />
      </header>

      <CartSideModal
        isOpen={openCartModal}
        onClose={() => setOpenCartModal(false)}
        cartItems={cartItems}
        user={user ?? null}
        added={false}
      />
    </>
  );
}
