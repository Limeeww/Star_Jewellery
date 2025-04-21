"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { LuLogOut, LuUserRound } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { signOutUser } from "@/app/utils/auth";

type UserBlockProps = {
  isScrolled: boolean;
  isLoggedIn: boolean;
  onClose?: () => void;
};

export default function UserBlock({ isScrolled, isLoggedIn, onClose }: UserBlockProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted) return null;

  if (isLoggedIn) {
    return (
      <>
        <Link
          href="/Account/Overview"
          className={`${linkClass} ${textColor}`}
          onClick={onClose}
        >
          <LuUserRound size={18} />
          <span>My Account</span>
        </Link>
        <button
          className={`${linkClass} ${textColor} text-left`}
          onClick={() => signOutUser(router)}
        >
          <LuLogOut size={18} />
          <span>Log out</span>
        </button>
      </>
    );
  } else {
    return (
      <Link
        href="/sign-in"
        className={`${linkClass} ${textColor}`}
        onClick={onClose}
      >
        <LuUserRound size={18} />
        <span>Login</span>
      </Link>
    );
  }
}
