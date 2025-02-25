import Link from "next/link";
import React from "react";

export default function NavLinks({
  links,
  onClick,
  linkClass = "",
}: {
  links: { href: string; label: string }[];
  onClick?: () => void;
  linkClass?: string;
}) {
  return (
    <>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={linkClass}
          onClick={onClick}
        >
          {link.label}
        </Link>
      ))}
    </>
  );
}
