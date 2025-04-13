import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";

export function useUserRole() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const tokenResult = await user.getIdTokenResult(true);
        const userRole = tokenResult.claims.role as string | undefined;
        setRole(userRole ?? null);
      } else {
        setRole(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return role;
}
