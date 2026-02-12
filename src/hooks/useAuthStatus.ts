import { useAuthContext } from "@/app/contexts/AuthContext";

export function useAuthStatus() {
  const { user, loading } = useAuthContext();
  const isLoggedIn = !loading && !!user && !user.isAnonymous;
  const isAnonymous = !loading && !!user && user.isAnonymous;
  return { user, loading, isLoggedIn, isAnonymous };
}
