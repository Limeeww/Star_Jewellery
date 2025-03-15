import Link from "next/link";

interface NavLink {
  label: string;
  href: string;
}

interface AccountSidebarProps {
  navLinks: NavLink[];
  pathname: string;
}

export default function AccountSidebar({ navLinks, pathname }: AccountSidebarProps) {
  return (
    <nav className="space-y-4 text-sm text-gray-700 flex flex-col">
      {navLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={isActive ? "underline font-semibold" : "hover:underline"}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
};

