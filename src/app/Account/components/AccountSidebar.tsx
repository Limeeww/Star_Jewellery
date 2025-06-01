import Link from "next/link";
import { useUserRole } from "../../../hooks/useUserRole";

interface NavLink {
  label: string;
  href: string;
}

interface AccountSidebarProps {
  navLinks?: NavLink[];
  pathname: string | null;
}

const COMMON_LINKS = [
  { label: "Overview", href: "/Account/Overview" },
  { label: "My Profile", href: "/Account/Profile" },
  { label: "My Orders", href: "/Account/Orders" },
  { label: "My Addresses", href: "/Account/Addresses" },
  { label: "My Wish List", href: "/Account/Wishlist" },
  { label: "My Bonuses", href: "/Account/Bonuses" },
  { label: "My Payment Methods", href: "/Account/PaymentMethods" },
];

const SIDE_LINKS = [...COMMON_LINKS];

const ADMIN_LINKS = [
  ...COMMON_LINKS,
  { label: "Manage User Roles", href: "/Admin/Roles" },
  { label: "Manage Products", href: "/Admin/Products" },
  { label: "Manage Collections", href: "/Admin/Collections" },
  { label: "Manage Categories", href: "/Admin/Categories" },
  { label: "Manage Discounts", href: "/Admin/Discounts" },
];

const getLinks = (role?: string | null): NavLink[] => {
  if (role === "admin") return ADMIN_LINKS;
  return SIDE_LINKS;
};

export default function AccountSidebar({
  navLinks,
  pathname,
}: AccountSidebarProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user, role, loading } = useUserRole();
  const linksToRender = navLinks || getLinks(role);
  return (
    <nav className="space-y-4 text-sm text-gray-700 flex flex-col">
      {linksToRender.map((link) => {
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
