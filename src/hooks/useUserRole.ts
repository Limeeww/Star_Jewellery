import { useEffect, useState } from "react";
import { auth } from "@/firebase/firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";

type UseUserRoleResult = {
  role: string | null;
  loading: boolean;
  user: User | null;
};

export function useUserRole(): UseUserRoleResult {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          const tokenResult = await user.getIdTokenResult(true); // force refresh
          const userRole = tokenResult.claims.role as string | undefined;
          setRole(userRole ?? null);
        } catch (e) {
          console.error("Error getting custom claims:", e);
          setRole(null);
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, role, loading };
}
