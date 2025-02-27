import React from "react";
import Link from "next/link";
import { LuLogOut, LuUserRound } from "react-icons/lu";

type UserBlockProps = {
  isScrolled: boolean;
  isLoggedIn: boolean;
  onClose?: () => void;
};

export default function UserBlock({
  isScrolled,
  isLoggedIn,
  onClose,
}: UserBlockProps) {
  const handleLogout = () => {
    if (onClose) onClose();
  };

  const linkClass = `
    transition-colors 
    duration-300 
    hover:underline 
    flex 
    items-center 
    space-x-1
  `;

  const textColor = isScrolled
    ? "text-gray-800 hover:text-gray-500"
    : "text-white hover:text-gray-300";

  if (isLoggedIn) {
    return (
      <>
        <Link
          href="/profile"
          className={`${linkClass} ${textColor}`}
          onClick={onClose}
        >
          <LuUserRound size={18} />
          <span>My Account</span>
        </Link>
        <button
          className={`${linkClass} ${textColor} text-left`}
          onClick={handleLogout}
        >
          <LuLogOut size={18} />
          <span>Log out</span>
        </button>
      </>
    );
  } else {
    return (
      <Link
        href="/login"
        className={`${linkClass} ${textColor}`}
        onClick={onClose}
      >
        <LuUserRound size={18} />
        <span>Login</span>
      </Link>
    );
  }
}
