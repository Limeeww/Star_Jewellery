"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "@/firebase/firebaseConfig";
import { useUserRole } from "@/hooks/useUserRole";

import { useRequireAuth } from "@/hooks/index";
import { useProfileData } from "@/utils/index";

import Navbar from "@/app/components/Navbar/Navbar";
import Footer from "@/app/components/Footer/Footer";
import Loading from "@/app/components/Loading/Loading";
import AccountLayout from "@/app/Account/components/AccountLayout";
import ProfileCard from "@/app/Account/components/ProfileCard";
import WelcomeBlock from "@/app/Account/components/WelcomeBlock";

export default function Overview() {
  const [user, loading] = useAuthState(auth);
  const pathname = usePathname();

  const isLoggedIn = !loading && !!user;

  useRequireAuth(user ?? null, loading);

  const [profileData] = useProfileData(user ?? null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user: currentUser, role, loading: roleLoading } = useUserRole();

  if (loading || roleLoading || !profileData) {
    return <Loading />;
  }

  return (
    <>
      <Navbar isScrolled={true} isLoggedIn={isLoggedIn} />

      <AccountLayout pathname={pathname}>
        <WelcomeBlock
          firstName={profileData?.firstName as string}
          lastName={profileData?.lastName as string}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProfileCard title="MY PROFILE" linkHref="/Account/Profile">
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <strong>Email:</strong>{" "}
                {`${profileData?.email || "No email provided"}`}
              </p>
              <p>
                <strong>Name:</strong>{" "}
                {profileData?.firstName
                  ? profileData.firstName.toString()
                  : "No first name provided"}
              </p>
              <p>
                <strong>Last Name:</strong>{" "}
                {profileData?.lastName
                  ? profileData.lastName.toString()
                  : "No last name provided"}
              </p>
              <p>
                <strong>Birth Date:</strong>{" "}
                {profileData?.birthDay &&
                profileData?.birthMonth &&
                profileData?.birthYear
                  ? `${profileData.birthDay}.${profileData.birthMonth}.${profileData.birthYear}`
                  : "Birth date not provided"}
              </p>
            </div>
          </ProfileCard>

          <ProfileCard
            title="MY ORDERS"
            description={
              profileData?.orders && profileData.orders.length
                ? `You have ${profileData.orders.length} orders.`
                : "You have no orders yet."
            }
            linkHref="/Account/Orders"
          />

          <ProfileCard
            title="MY ADDRESSES"
            description={
              Array.isArray(profileData?.addresses) &&
              profileData.addresses.length
                ? `You have ${profileData.addresses.length} saved addresses.`
                : "No addresses saved. Please add your shipping or billing address."
            }
            linkHref="/Account/Addresses"
          />

          <ProfileCard
            title="MY PAYMENT METHODS"
            description={
              Array.isArray(profileData?.paymentMethods) &&
              profileData.paymentMethods.length
                ? `You have ${profileData.paymentMethods.length} saved payment methods.`
                : "No payment methods saved. Please add your credit card or PayPal account."
            }
            linkHref="/Account/PaymentMethods"
          />

          <ProfileCard
            title="MY WISH LIST"
            description={
              profileData?.wishList && profileData.wishList.length
                ? `You have ${profileData.wishList.length} items in your wish list.`
                : "Your wish list is empty."
            }
            linkHref="/Account/Wishlist"
          />

          <ProfileCard
            title="MY BONUSES"
            description={
              profileData?.bonuses && profileData.bonuses !== "0"
                ? `You have ${profileData.bonuses} bonus points.`
                : "You currently have no bonuses."
            }
            linkHref="/Account/Bonuses"
          />

          {role === "admin" ? (
            <>
              <ProfileCard
                title="MANAGE USER ROLES"
                description={"Start managing the user roles via link."}
                linkHref="/Admin/Roles"
              />
              <ProfileCard
                title="MANAGE PRODUCTS"
                description={"Start managing the products via link."}
                linkHref="/Admin/Products"
              />
            </>
          ) : (
            <></>
          )}
        </div>
      </AccountLayout>

      <Footer />
    </>
  );
}
