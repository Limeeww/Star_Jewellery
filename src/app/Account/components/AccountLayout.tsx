import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AccountSidebar from "./AccountSidebar";

interface AccountLayoutProps {
  children: React.ReactNode;
  navLinks: { label: string; href: string }[];
  pathname: string;
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  children,
  navLinks,
  pathname,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <main
      className="min-h-screen mt-16"
      style={{ fontFamily: "var(--font-poppins)" }}
    >
      <div className="container mx-auto px-4 lg:px-8 py-12 flex flex-col lg:flex-row gap-8">
        <aside className="hidden lg:block w-1/4">
          <h2
            className="text-xl font-semibold mb-4 uppercase"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            MY STAR
          </h2>
          <nav className="space-y-2 flex flex-col text-sm text-gray-700">
            <AccountSidebar navLinks={navLinks} pathname={pathname} />
          </nav>
        </aside>

        <aside className="block lg:hidden w-full">
          <div
            className="border-b border-gray-300 py-2 flex items-center justify-between"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <span className="uppercase text-sm font-bold">MY STAR</span>
            <span className="text-sm">{isSidebarOpen ? "▲" : "▼"}</span>
          </div>
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.nav
                key="sidebar"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden space-y-2 text-sm text-gray-700 mt-2"
              >
                <AccountSidebar navLinks={navLinks} pathname={pathname} />
              </motion.nav>
            )}
          </AnimatePresence>
        </aside>

        <section className="w-full lg:w-3/4">{children}</section>
      </div>
    </main>
  );
};

export default AccountLayout;
