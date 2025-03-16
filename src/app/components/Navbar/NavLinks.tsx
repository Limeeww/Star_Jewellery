"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function NavLinks({
  links,
}: {
  links: { href: string; label: string }[];
  linkClass?: string;
}) {
  const router = useRouter();
  const handleClick = (
    e: React.MouseEvent,
    href: string,
    router: ReturnType<typeof useRouter>
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.replace("#", "");
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
          >
            {link.label}
          </Link>
        </motion.div>
      ))}
    </>
  );
}
