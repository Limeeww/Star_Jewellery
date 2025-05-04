"use client";

import React, { JSX, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebaseConfig";
import { useRequireAuth } from "@/hooks/index";
import { useProfileData } from "@/utils/index";
import Navbar from "@/app/components/Navbar/Navbar";
import Footer from "@/app/components/Footer/Footer";
import AccountLayout from "@/app/Account/components/AccountLayout";
import WelcomeBlock from "@/app/Account/components/WelcomeBlock";
import Notification from "@/app/components/MessageHandling/Notification";
import { useNotification } from "@/hooks/useNotification";

interface SideLink {
  label: string;
  href: string;
}

interface ProfileData {
  firstName: string;
  lastName: string;
}

interface AccountPageLayoutProps {
  sideLinks: SideLink[];
  title: string;
  description?: ReactNode;
  children: ReactNode;
}

export default function AccountPageLayout({
  sideLinks,
  title,
  description,
  children,
}: AccountPageLayoutProps): JSX.Element {
  const pathname = usePathname();
  const [user, loadingAuth] = useAuthState(auth);
  useRequireAuth(user ?? null, loadingAuth);

  const [profileData] = useProfileData(user ?? null);
  const { notification, clearNotification } = useNotification();

  return (
    <>
      <Navbar isScrolled isLoggedIn={!!user} />
      <AccountLayout pathname={pathname ?? ""} sideLinks={sideLinks}>
        <WelcomeBlock
          firstName={(profileData as unknown as ProfileData)?.firstName}
          lastName={(profileData as unknown as ProfileData)?.lastName}
        />

        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
            duration={notification.duration}
            onClose={clearNotification}
          />
        )}

        <div
          className="mt-6 space-y-4 text-sm text-gray-800"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          <h2
            className="text-2xl font-semibold"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {title}
          </h2>
          {description && <div className="text-gray-600">{description}</div>}

          {children}
        </div>
      </AccountLayout>
      <Footer />
    </>
  );
}
