import { useState, useEffect, useCallback } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebaseConfig";
import { useNotification, useRequireAuth } from "@/hooks";
import { fetchUserData, updateUserProfile } from "@/utils/firebase";
import type { PaymentInfo } from "@/types/order";


export function usePaymentMethods() {
  const [user, loadingAuth] = useAuthState(auth);
  const { notify } = useNotification();
  useRequireAuth(user ?? null, loadingAuth);

  const [paymentMethods, setPaymentMethods] = useState<PaymentInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMethods = useCallback(async () => {
    if (!user) {
      setPaymentMethods([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await fetchUserData(user.uid);
      setPaymentMethods(data?.paymentMethods ?? []);
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

  const saveMethods = useCallback(
    async (newList: PaymentInfo[]) => {
      if (!user) return;

      try {
        await updateUserProfile(user.uid, { paymentMethods: newList });
        setPaymentMethods(newList);
      } catch {
        notify({ type: "error", message: "Failed to save payment methods" });
      }
    },
    [user, notify]
  );

  const add = useCallback(
    async (method: PaymentInfo) => {
      const list = paymentMethods.map((m) => ({ ...m, isDefault: false }));
      list.push({ ...method, isDefault: method.isDefault ?? false });
      await saveMethods(list);
    },
    [paymentMethods, saveMethods]
  );

  const update = useCallback(
    async (idx: number, pm: PaymentInfo) => {
      if (pm.method === "credit_card" && pm.isDefault) {
        const userData = await fetchUserData(user!.uid);
        const customerId = userData?.stripeCustomerId;
        await fetch("/api/stripe/set-default-payment-method", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerId,
            paymentMethodId: pm.cardToken,
          }),
        });
      }

      const list = [...paymentMethods];
      list[idx] = pm;
      return saveMethods(list);
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

      const list = paymentMethods.filter((_, i) => i !== idx);
      await saveMethods(list);
    },
    [paymentMethods, saveMethods]
  );

  return {
    paymentMethods,
    loading: loadingAuth || loading,
    add,
    update,
    remove,
  };
}
