import { useState, useEffect, useCallback } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNotification } from "@/hooks/useNotification";
import { fetchUserData } from "@/utils/firebase";
import { useRequireAuth } from "@/hooks/index";
import type { PaymentInfo } from "@/types/order";

/**
 * Hook to manage user's saved payment methods.
 */
export function usePaymentMethods() {
  const [user, loadingAuth] = useAuthState(auth);
  const { notify } = useNotification();
  useRequireAuth(user ?? null, loadingAuth);

  const [paymentMethods, setPaymentMethods] = useState<PaymentInfo[]>([]);
  const [loading, setLoading] = useState(true);

  // Load methods from Firestore
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
      const newList = paymentMethods.map((m) => ({ ...m, isDefault: false }));
      newList.push({ ...method, isDefault: method.isDefault ?? false });
      await saveMethods(newList);
    },
    [paymentMethods, saveMethods]
  );

  const update = useCallback(
    async (idx: number, pm: PaymentInfo) => {
      if (pm.method === "credit_card") {
        if (pm.isDefault) {
          const userSnap = await fetchUserData(user!.uid);
          const customerId = userSnap!.data()?.stripeCustomerId;
          await fetch("/api/stripe/set-default-payment-method", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ customerId, paymentMethodId: pm.cardToken }),
          });
        }
      }
      const newList = [...paymentMethods];
      newList[idx] = pm;
      return saveMethods(newList);
    },
    [user, paymentMethods, saveMethods]
  );

  const remove = useCallback(
    async (idx: number) => {
      const pm = paymentMethods[idx];

      if (pm.method === "credit_card") {
        const paymentMethodId = pm.cardToken;

        await fetch("/api/stripe/detach-payment-method", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentMethodId }),
        });
      }

      const newList = paymentMethods.filter((_, i) => i !== idx);
      await saveMethods(newList);
      console.log("Removed", newList);
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
