import { useEffect, useState } from "react";
import { signInAnonymously, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";

export function useAnonymousAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        await signInAnonymously(auth);
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { user, loading };
}
