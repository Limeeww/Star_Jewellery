import { useAuthState } from "react-firebase-hooks/auth";
import { useCallback } from "react";
import { auth, db } from "@/firebase/firebaseConfig";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import type { Address } from "@/types/userTypes";

export function useAddressModal(onSave: (addresses: Address[]) => void) {
  const [user] = useAuthState(auth);

  const save = useCallback(
    async (addresses: Address[]) => {
      if (!user) throw new Error("Not authenticated");
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { addresses });
      onSave(addresses);
    },
    [user, onSave]
  );

  const load = useCallback(async (): Promise<Address[]> => {
    if (!user) return [];
    const snap = await getDoc(doc(db, "users", user.uid));
    if (!snap.exists()) return [];
    return snap.data().addresses || [];
  }, [user]);

  const prepare = useCallback(
    (existing: Address[], data: Address, idx?: number) => {
      const addrs = [...existing];
      if (addrs.length === 0) {
        data.preferredShippingAddress = true;
        data.preferredBillingAddress = true;
      } else {
        if (data.preferredShippingAddress)
          addrs.forEach((a) => (a.preferredShippingAddress = false));
        if (data.preferredBillingAddress)
          addrs.forEach((a) => (a.preferredBillingAddress = false));
      }
      if (idx != null) addrs[idx] = data;
      else addrs.push(data);
      return addrs;
    },
    []
  );

  return { load, prepare, save };
}
