"use client";

import React from "react";
import Link from "next/link";

type LinkButtonProps = {
  text: string;
  href?: string;
  className?: string;
  onClick?: () => void;
  showArrow?: boolean;
};

export default function LinkButton({
  text,
  href,
  className = "",
  onClick,
  showArrow = false,
}: LinkButtonProps) {
  const content = (
    <>
      <span className="text-center w-full">{text}</span>
      {showArrow && <span className="ml-1 inline-block">&rarr;</span>}
    </>
  );

  const baseClasses = `inline-flex items-center justify-center text-center font-medium w-full ${className}`;

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={baseClasses}>
      {content}
    </button>
  );
}
