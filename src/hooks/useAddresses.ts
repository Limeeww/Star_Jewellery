import { useState, useEffect, useCallback } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebaseConfig";
import { useNotification, useRequireAuth } from "@/hooks";
import { fetchUserData, updateUserProfile } from "@/utils/firebase";
import type { Address } from "@/types/userTypes";

export function useAddresses() {
  const [user, loadingAuth] = useAuthState(auth);
  const { notify } = useNotification();
  useRequireAuth(user ?? null, loadingAuth);

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
      const data = await fetchUserData(user.uid);
      setAddresses(data?.addresses ?? []);
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
        await updateUserProfile(user.uid, { addresses: newList });
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
          newList.forEach((a, i) => {
            if (i !== idx) a.preferredShippingAddress = false;
          });
        }
        if (addr.preferredBillingAddress) {
          newList.forEach((a, i) => {
            if (i !== idx) a.preferredBillingAddress = false;
          });
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
      const newList = addresses.filter((_, i) => i !== idx);
      return saveAddresses(newList);
    },
    [addresses, saveAddresses]
  );

  const selectAddress = useCallback((idx: number) => {
    setSelectedIndex(idx);
  }, []);

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
