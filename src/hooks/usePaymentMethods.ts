import { useState, useEffect, useCallback } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNotification } from "@/hooks/useNotification";
import { fetchUserData } from "@/utils/firebase";
import { useRequireAuth } from "@/hooks/index";
import type { PaymentInfo } from "@/types/order";

export function usePaymentMethods() {
  const [user, loadingAuth] = useAuthState(auth);
  const { notify } = useNotification();
  useRequireAuth(user ?? null, loadingAuth);

  const [paymentMethods, setPaymentMethods] = useState<PaymentInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const loadMethods = useCallback(async () => {
    if (!user) {
      setPaymentMethods([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        const data = snap.data() as { paymentMethods?: PaymentInfo[] };
        setPaymentMethods(data.paymentMethods ?? []);
      } else {
        setPaymentMethods([]);
      }
    } catch {
      notify({ type: "error", message: "Failed to load payment methods" });
      setPaymentMethods([]);
    } finally {
      setLoading(false);
    }
  }, [user, notify]);

  useEffect(() => {
    loadMethods();
  }, [loadMethods]);

  useEffect(() => {
    if (!loading && paymentMethods.length && selectedIndex === null) {
      const defIdx = paymentMethods.findIndex((pm) => pm.isDefault);
      setSelectedIndex(defIdx >= 0 ? defIdx : 0);
    }
  }, [loading, paymentMethods, selectedIndex]);

  const saveMethods = useCallback(
    async (newList: PaymentInfo[]) => {
      if (!user) return;
      try {
        await updateDoc(doc(db, "users", user.uid), {
          paymentMethods: newList,
        });
        setPaymentMethods(newList);
      } catch {
        notify({ type: "error", message: "Failed to save payment methods" });
      }
    },
    [user, notify]
  );

  const add = useCallback(
    async (method: PaymentInfo) => {
      // reset defaults, then push new
      const newList = paymentMethods.map((m) => ({ ...m, isDefault: false }));
      newList.push({ ...method, isDefault: method.isDefault ?? false });
      await saveMethods(newList);
    },
    [paymentMethods, saveMethods]
  );

  const update = useCallback(
    async (idx: number, pm: PaymentInfo) => {
      let newList: PaymentInfo[];
      if (pm.isDefault) {
        newList = paymentMethods.map((m, i) => ({
          ...m,
          isDefault: i === idx,
        }));
      } else {
        newList = [...paymentMethods];
        newList[idx] = pm;
      }

      if (pm.method === "credit_card" && pm.isDefault) {
        const userData = await fetchUserData(user!.uid);
        const customerId = userData?.stripeCustomerId;
        await fetch("/api/stripe/set-default-payment-method", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customerId, paymentMethodId: pm.cardToken }),
        });
      }

      return saveMethods(newList);
    },
    [user, paymentMethods, saveMethods]
  );
  const remove = useCallback(
    async (idx: number) => {
      const pm = paymentMethods[idx];
      if (pm.method === "credit_card") {
        await fetch("/api/stripe/detach-payment-method", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentMethodId: pm.cardToken }),
        });
      }
      const newList = paymentMethods.filter((_, i) => i !== idx);
      await saveMethods(newList);
    },
    [paymentMethods, saveMethods]
  );

  // new select callback
  const selectPayment = useCallback((idx: number) => {
    setSelectedIndex(idx);
  }, []);

  return {
    paymentMethods,
    loading: loadingAuth || loading,
    add,
    update,
    remove,
    selectedIndex,
    selectPayment,
  };
}
