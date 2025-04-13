"use client";

import React from "react";
import Link from "next/link";

interface LinkButtonProps {
  label: React.ReactNode;
  href: string;
  isLoading?: boolean;
  className?: string;
  showArrow?: boolean;
}

function LinkButtonForm({
  label,
  href,
  isLoading = false,
  className = "",
  showArrow = false,
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={`w-full inline-block bg-black text-white text-sm font-medium px-4 py-2 hover:bg-gray-800 transition-colors ${className} ${
        isLoading ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      {isLoading ? "Loading..." : label}
      {showArrow && !isLoading && <span className="ml-1">&rarr;</span>}
    </Link>
  );
}

export default LinkButtonForm;
