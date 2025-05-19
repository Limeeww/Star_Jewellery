// app/Account/MyBonusesPage.tsx
"use client";

import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebaseConfig";
import Loading from "@/app/components/Loading/Loading";
import { useRequireAuth } from "@/hooks/index";
import { useBonuses } from "@/hooks";
import Navbar from "@/app/components/Navbar/Navbar";
import AccountPageLayout from "@/app/Account/components/AccountPageLayout";
import LinkButton from "@/app/Account/components/LinkButton";
import { useRouter } from "next/navigation";

export default function MyBonusesPage() {
  const [user, loadingAuth] = useAuthState(auth);
  useRequireAuth(user ?? null, loadingAuth);
  const router = useRouter();

  const { bonuses, loading: loadingBonuses } = useBonuses(user?.uid ?? null);

  if (loadingAuth || loadingBonuses) {
    return <Loading />;
  }

  return (
    <>
      <Navbar isScrolled isLoggedIn={!!user} />

      <AccountPageLayout
        sideLinks={[]}
        title="My Bonuses"
        description={
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Bonuses are credited after each purchase: you receive 0.3% of the
              item&apos;s price as points. You can use your bonus points for a
              discount on your next order.
            </p>
          </div>
        }
      >
        <div>
          <p className="text-sm text-gray-800">
            Your balance is <span className="font-medium">{bonuses}</span> bonus
            points.
          </p>
        </div>
        <div className="mt-4">
          <LinkButton
            text="Go to Shop"
            onClick={() => router.push("/shop")}
            className="underline text-sm"
            showArrow
          />
        </div>
      </AccountPageLayout>
    </>
  );
}
