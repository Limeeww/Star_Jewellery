import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

interface UseBonusesReturn {
  bonuses: number;
  loading: boolean;
}

export function useBonuses(userId: string | null): UseBonusesReturn {
  const [bonuses, setBonuses] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!userId) {
      setBonuses(0);
      setLoading(false);
      return;
    }

    const ref = doc(db, "users", userId);

    const unsubscribe = onSnapshot(
      ref,
      (snap) => {
        const data = snap.data() as { bonuses?: number } | undefined;
        setBonuses(data?.bonuses ?? 0);
        setLoading(false);
      },
      (error) => {
        console.error("useBonuses error:", error);
        setBonuses(0);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return { bonuses, loading };
}
