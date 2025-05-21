"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStatus } from "./useAuthStatus";

export function useProtectRoute(redirectTo = "/sign-in") {
  const { isLoggedIn, loading } = useAuthStatus();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.replace(redirectTo);
    }
  }, [loading, isLoggedIn, redirectTo, router]);
}
