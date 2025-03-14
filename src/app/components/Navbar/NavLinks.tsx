"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NavLinks({
  links,
  linkClass = "",
}: {
  links: { href: string; label: string }[];
  linkClass?: string;
}) {
  const handleClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();

    const targetId = href.replace(/.*\#/, "");
    const element = document.getElementById(targetId);

    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      {links.map((link) => (
        <motion.div
          key={link.href}
          whileTap={{ scale: 0.95 }}
          className="inline-block"
        >
          <Link
            href={link.href}
            className={linkClass}
            onClick={(e) => handleClick(e, link.href)}
          >
            {link.label}
          </Link>
        </motion.div>
      ))}
    </>
  );
}
