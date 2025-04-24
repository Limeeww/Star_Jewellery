import { useState, useEffect, useCallback } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import type { Address } from "@/app/types/userTypes";

export function useShippingAddresses() {
  const [user, loadingAuth] = useAuthState(auth);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const loadAddresses = useCallback(async () => {
    if (!user) {
      setAddresses([]);
      setLoading(false);
      return;
    }
    try {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        const data = snap.data() as { addresses?: Address[] };
        const list = data.addresses || [];
        setAddresses(list);
        const defIdx = list.findIndex((a) => a.preferredShippingAddress);
        setSelectedIndex(defIdx >= 0 ? defIdx : null);
      } else {
        setAddresses([]);
      }
    } catch (e) {
      console.error("Failed to load addresses", e);
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  const selectAddress = (index: number) => {
    setSelectedIndex(index);
  };

  return {
    addresses,
    selectedIndex,
    selectAddress,
    loading: loadingAuth || loading,
  };
}
