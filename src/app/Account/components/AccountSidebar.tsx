import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase/firebaseConfig";
import { useProfileData } from "@/app/utils/auth";

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

const ADMIN_LINKS = [
  { label: "Overview", href: "/Account/Overview" },
  { label: "My Profile", href: "/Account/Profile" },
  { label: "My Orders", href: "/Account/Orders" },
  { label: "My Addresses", href: "/Account/Addresses" },
  { label: "My Wish List", href: "/Account/Wishlist" },
  { label: "My Bonuses", href: "/Account/Bonuses" },
  { label: "Manage", href: "/Account/AdminPage" },
];

const getLinks = (role?: string): NavLink[] => {
  if (role === "admin") return ADMIN_LINKS;
  return SIDE_LINKS;
};

export default function AccountSidebar({
  navLinks,
  pathname,
}: AccountSidebarProps) {
  const [user] = useAuthState(auth);
  const [profileData] = useProfileData(user);
  const linksToRender = navLinks || getLinks(profileData?.role);
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
