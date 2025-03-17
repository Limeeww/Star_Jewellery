import Link from "next/link";

interface NavLink {
  label: string;
  href: string;
}

interface AccountSidebarProps {
  navLinks: NavLink[];
  pathname: string;
}

const SIDE_LINKS = [
  { label: "Overview", href: "/Account/Overview" },
  { label: "My Profile", href: "/Account/Profile" },
  { label: "My Orders", href: "/Account/Orders" },
  { label: "My Addresses", href: "/Account/Addresses" },
  { label: "My Wish List", href: "/Account/Wishlist" },
  { label: "My Bonuses", href: "/Account/Bonuses" },
];

export default function AccountSidebar({
  navLinks=SIDE_LINKS,
  pathname,
}: AccountSidebarProps) {
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
}
