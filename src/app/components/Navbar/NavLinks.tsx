"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
  
interface NavLinksProps {
  links: { href: string; label: string }[];
  linkClass?: string;
}

export default function NavLinks({ links, linkClass }: NavLinksProps) {
  const router = useRouter();
  const defaultLinkClass = `
    transition-colors
    duration-300
    hover:underline
    flex
    items-center
    space-x-1
  `;

  const handleClick = (
    e: React.MouseEvent,
    href: string,
    router: ReturnType<typeof useRouter>
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.slice(1);
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      e.preventDefault();
      router.push(href);
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
            onClick={(e) => handleClick(e, link.href, router)}
            className={`${linkClass} ${defaultLinkClass}`}
          >
            {link.label}
          </Link>
        </motion.div>
      ))}
    </>
  );
}
