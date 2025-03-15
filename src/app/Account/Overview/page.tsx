"use client";

import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase/firebaseConfig";
import { useRouter, usePathname } from "next/navigation";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Loading from "../../components/Loading/Loading";

import { fetchUserData } from "@/app/utils/auth";
import WelcomeBlock from "@/app/Account/components/WelcomeBlock";
import AccountLayout from "../components/AccountLayout";

export default function Profile() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const pathname = usePathname();

  interface ProfileData {
    email?: string;
    firstName?: string;
    lastName?: string;
    birthDay?: number;
    birthMonth?: number;
    birthYear?: number;
  }

  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  const isLoggedIn = !loading && !!user;

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const getProfileData = async () => {
      if (user) {
        const data = await fetchUserData(user.uid);
        if (data) setProfileData(data);
      }
    };
    getProfileData();
  }, [user]);

  if (loading) {
    return <Loading />;
  }

  const navLinks = [
    { label: "Overview", href: "/Account/Overview" },
    { label: "My Profile", href: "/Account/Profile" },
    { label: "My Orders", href: "/Account/Orders" },
    { label: "My Addresses", href: "/Account/Addresses" },
    { label: "My Payment Methods", href: "/Account/Payment" },
    { label: "My Wish List", href: "/Account/Wishlist" },
  ];

  return (
    <>
      <Navbar isScrolled={true} isLoggedIn={isLoggedIn}  />
      <AccountLayout navLinks={navLinks} pathname={pathname}>
        <WelcomeBlock
          firstName={profileData?.firstName}
          lastName={profileData?.lastName}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border p-4">
            <h3
              className="text-lg font-semibold mb-2"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              MY PROFILE
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <strong>Email:</strong> {profileData?.email || user?.email}
              </p>
              <p>
                <strong>Name:</strong> {profileData?.firstName || "N/A"}
              </p>
              <p>
                <strong>Last Name:</strong> {profileData?.lastName || "N/A"}
              </p>
              <p>
                <strong>Birth Date:</strong> {profileData?.birthDay}.
                {profileData?.birthMonth}.{profileData?.birthYear}
              </p>
            </div>
            <div className="mt-2">
              <a className="underline text-sm cursor-pointer">View Your Data</a>
            </div>
          </div>

          <div className="border p-4">
            <h3
              className="text-lg font-semibold mb-2"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              MY ORDERS
            </h3>
            <p className="text-sm text-gray-600">
              Check the status of your recent orders and view your order
              history.
            </p>
          </div>

          <div className="border p-4">
            <h3
              className="text-lg font-semibold mb-2"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              MY ADDRESSES
            </h3>
            <p className="text-sm text-gray-600">
              Save and manage shipping and billing addresses for quick checkout.
            </p>
          </div>

          <div className="border p-4">
            <h3
              className="text-lg font-semibold mb-2"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              MY PAYMENT METHODS
            </h3>
            <p className="text-sm text-gray-600">
              Add or remove payment methods and keep them up to date.
            </p>
          </div>

          <div className="border p-4">
            <h3
              className="text-lg font-semibold mb-2"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              MY WISH LIST
            </h3>
            <p className="text-sm text-gray-600">
              Keep track of the items you love and shop them whenever you like.
            </p>
          </div>
        </div>
      </AccountLayout>
      ;
      <Footer />
    </>
  );
}
