"use client";

import { FiX } from "react-icons/fi";
import NavLinks from "./NavLinks";
import UserBlock from "./UserBlock";
import { useEffect } from "react";

const NAV_LINKS = [
  { href: "/about-us", label: "About Us" },
  { href: "/catalog", label: "Catalog" },
  { href: "/collections", label: "Collections" },
  { href: "/projects", label: "Projects" },
];

export default function MobileMenu({
  open,
  onClose,
  isLoggedIn,
}: {
  open: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
}) {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  return (
    <div
      className={`
          fixed top-0 left-0 h-full w-64 bg-white z-50 transform
          ${open ? "translate-x-0" : "-translate-x-full"}
          transition-transform duration-300 shadow-md flex flex-col
          xl:hidden
        `}
    >
      <div className="flex items-center text-gray-800 justify-between p-4 border-b">
        <span
          className="text-lg font-semibold"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          Menu
        </span>
        <button onClick={onClose}>
          <FiX size={24} />
        </button>
      </div>

      <nav
        className="flex flex-col p-4 space-y-4 text-gray-800"
        style={{ fontFamily: "var(--font-poppins)" }}
      >
        <NavLinks
          links={NAV_LINKS}
          linkClass="hover:underline"
          onClick={onClose}
        />
        <UserBlock isLoggedIn={isLoggedIn} onClose={onClose} />
      </nav>
    </div>
  );
}
