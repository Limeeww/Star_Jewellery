"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged, signInAnonymously, User } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";

export function useAnonymousAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (current) => {
      if (current == null) {
        try {
          const { user: anon } = await signInAnonymously(auth);
          setUser(anon);
        } catch {
          setUser(null);
        }
      } else {
        setUser(current);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, loading };
}
