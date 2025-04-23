"use client";

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
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  useRequireAuth(user, loadingAuth);

  const load = useCallback(async () => {
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
        setAddresses(data.addresses ?? []);
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

  const save = useCallback(
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

  const add = useCallback(
    (addr: Address) => save([...addresses, addr]),
    [addresses, save]
  );

  const update = useCallback(
    (idx: number, addr: Address) => {
      const list = [...addresses];
      list[idx] = addr;
      return save(list);
    },
    [addresses, save]
  );

  const remove = useCallback(
    (idx: number) => {
      const list = [...addresses];
      list.splice(idx, 1);
      return save(list);
    },
    [addresses, save]
  );

  useEffect(() => {
    load();
  }, [load]);

  return {
    addresses,
    loading: loadingAuth || loading,
    add,
    update,
    remove,
  };
}
