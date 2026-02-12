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
import { LuSparkles } from "react-icons/lu";

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
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              Earn bonus points on every purchase and redeem them for discounts:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Earn Rate:</strong> 0.3% of each order’s total price.
              </li>
              <li>
                <strong>Minimum to Redeem:</strong> 100 points.
              </li>
              <li>
                <strong>Redemption Rate:</strong> 100 points = 5% off your
                order. Proportional discount for other point balances.
              </li>
              <li>
                <strong>Validity:</strong> Points expire 12 months after
                issuance.
              </li>
            </ul>
            <p>
              You can stack bonus discounts with promotional offers (unless
              stated otherwise). Points are non-transferable and cannot be
              exchanged for cash.
            </p>
          </div>
        }
      >
        <div className="bg-white p-4 rounded shadow flex items-center gap-4 max-w-xs">
          <LuSparkles size={32} className="text-cyan-600" />
          <div>
            <p className="text-xs text-gray-500 uppercase">Bonus Points</p>
            <p className="text-2xl font-bold text-gray-800">{bonuses}</p>
          </div>
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
