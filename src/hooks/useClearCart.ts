import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebaseConfig";
import { useCallback } from "react";

export function useClearCart() {
  const [user] = useAuthState(auth);

  return useCallback(async () => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, { cartItems: [] });
  }, [user]);
}