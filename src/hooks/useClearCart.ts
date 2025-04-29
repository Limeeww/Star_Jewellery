import { useCallback } from "react";
import { db } from "@/firebase/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebaseConfig";

export function useClearCart() {
  const [user] = useAuthState(auth);

  return useCallback(async () => {
    if (!user) return;
    const q = query(
      collection(db, "cartItems"),
      where("userId", "==", user.uid)
    );
    const snap = await getDocs(q);
    const batch = writeBatch(db);
    snap.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
  }, [user]);
}
