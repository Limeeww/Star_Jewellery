import { useState, useEffect, useCallback } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNotification } from "@/hooks/useNotification";
import { useRequireAuth } from "@/app/utils/auth";
import type { Address } from "@/app/types/userTypes";

export function useAddresses() {
  const [user, loadingAuth] = useAuthState(auth);
  const { notify } = useNotification();
  useRequireAuth(user, loadingAuth);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const loadAddresses = useCallback(async () => {
    if (!user) {
      setAddresses([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        const data = snap.data() as { addresses?: Address[] };
        const list = data.addresses || [];
        setAddresses(list);
      } else {
        setAddresses([]);
      }
    } catch {
      notify({ type: "error", message: "Failed to load addresses" });
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  }, [user, notify]);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  useEffect(() => {
    if (!loading && addresses.length && selectedIndex === null) {
      const defIdx = addresses.findIndex((a) => a.preferredShippingAddress);
      setSelectedIndex(defIdx >= 0 ? defIdx : 0);
    }
  }, [loading, addresses, selectedIndex]);

  const saveAddresses = useCallback(
    async (newList: Address[]) => {
      if (!user) return;
      try {
        await updateDoc(doc(db, "users", user.uid), { addresses: newList });
        setAddresses(newList);
      } catch {
        notify({ type: "error", message: "Failed to save addresses" });
      }
    },
    [user, notify]
  );

  const prepareList = useCallback(
    (list: Address[], addr: Address, idx?: number) => {
      const newList = [...list];
      if (newList.length === 0) {
        addr.preferredShippingAddress = true;
        addr.preferredBillingAddress = true;
      } else {
        if (addr.preferredShippingAddress) {
          newList.forEach((a, i) => { if (i !== idx) a.preferredShippingAddress = false; });
        }
        if (addr.preferredBillingAddress) {
          newList.forEach((a, i) => { if (i !== idx) a.preferredBillingAddress = false; });
        }
      }
      if (idx != null) newList[idx] = addr;
      else newList.push(addr);
      return newList;
    },
    []
  );

  const add = useCallback(
    (addr: Address) => {
      const newList = prepareList(addresses, addr);
      return saveAddresses(newList);
    },
    [addresses, prepareList, saveAddresses]
  );

  const update = useCallback(
    (idx: number, addr: Address) => {
      const newList = prepareList(addresses, addr, idx);
      return saveAddresses(newList);
    },
    [addresses, prepareList, saveAddresses]
  );

  const remove = useCallback(
    (idx: number) => {
      const newList = [...addresses];
      newList.splice(idx, 1);
      return saveAddresses(newList);
    },
    [addresses, saveAddresses]
  );

  // Selection
  const selectAddress = (idx: number) => setSelectedIndex(idx);

  return {
    addresses,
    loading: loadingAuth || loading,
    add,
    update,
    remove,
    selectedIndex,
    selectAddress,
  };
}
