import React from "react";
import Link from "next/link";
import { LuLogOut, LuUserRound } from "react-icons/lu";

export default function UserBlock({
  isLoggedIn,
  onClose,
}: {
  isLoggedIn: boolean;
  onClose?: () => void;
}) {
  const handleLogout = () => {
    // Logik for logout HERE
    if (onClose) onClose();
  };

  if (isLoggedIn) {
    return (
      <>
        <Link
          href="/profile"
          className="
            text-white 
            group-hover:text-gray-800 
            transition-colors 
            duration-300 
            hover:underline 
            flex 
            items-center 
            space-x-1
          "
          onClick={onClose}
        >
          <LuUserRound size={18} />
          <span>My Account</span>
        </Link>
        <button
          className="
            text-white 
            group-hover:text-gray-800 
            transition-colors 
            duration-300 
            hover:underline 
            flex 
            items-center 
            space-x-1 
            text-left
          "
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
        className="
          text-white 
          text-gray-800
          group-hover:text-gray-800 
          transition-colors 
          duration-300 
          hover:underline 
          flex 
          items-center 
          space-x-1
        "
        onClick={onClose}
      >
        <LuUserRound size={18} />
        <span>Login</span>
      </Link>
    );
  }
}
