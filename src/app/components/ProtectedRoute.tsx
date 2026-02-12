"use client";

import { ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthContext } from "@/app/contexts/AuthContext";
import Loading from "./Loading/Loading";

interface Props {
  children: ReactNode;
  redirectTo?: string;
}

const PUBLIC_PATHS = ["/sign-in", "/sign-up"];
const PROTECTED_PREFIX = "/account";

export default function ProtectedRoute({
  children,
  redirectTo = "/no-access",
}: Props) {
  const { user, loading } = useAuthContext();
  const router = useRouter();
  const path = usePathname();

  const lcPath = (path || "").toLowerCase();
  const isProtectedRoute = lcPath.startsWith(PROTECTED_PREFIX);
  const isPublicRoute = PUBLIC_PATHS.includes(lcPath);

  useEffect(() => {
    if (!loading && user?.isAnonymous && isProtectedRoute && !isPublicRoute) {
      router.replace(redirectTo);
    }
  }, [
    user,
    loading,
    path,
    router,
    redirectTo,
    isProtectedRoute,
    isPublicRoute,
  ]);

  if (loading || (user?.isAnonymous && isProtectedRoute && !isPublicRoute)) {
    return <Loading />;
  }

  return <>{children}</>;
}
