import { useState, useEffect, useCallback } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNotification, useRequireAuth } from "@/hooks";

// T = Address, PaymentInfo, etc.
// field = "addresses" | "paymentMethods" | whatever your user doc field is
export function useUserList<T>(field: string) {
  const [user, loadingAuth] = useAuthState(auth);
  const { notify } = useNotification();
  useRequireAuth(user ?? null, loadingAuth);

  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return setItems([]), setLoading(false);
    setLoading(true);
    try {
      const snap = await getDoc(doc(db, "users", user.uid));
      const data = snap.data() as { [key: string]: T[] } | undefined;
      setItems(data?.[field] || []);
    } catch {
      notify({ type: "error", message: `Failed to load ${field}` });
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [user, field, notify]);

  const save = useCallback(
    async (newList: T[]) => {
      if (!user) throw new Error("Not authenticated");
      try {
        await updateDoc(doc(db, "users", user.uid), { [field]: newList });
        setItems(newList);
      } catch {
        notify({ type: "error", message: `Failed to save ${field}` });
      }
    },
    [user, field, notify]
  );

  useEffect(() => {
    load();
  }, [load]);

  return { items, loading: loadingAuth || loading, load, save };
}
