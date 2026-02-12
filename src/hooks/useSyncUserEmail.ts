import { useEffect } from "react";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export function useSyncUserEmail() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, { email: user.email }, { merge: true });
      }
    });
    return () => unsubscribe();
  }, []);
}