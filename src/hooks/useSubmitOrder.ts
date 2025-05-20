import { useCallback, useState } from "react";
import { db } from "@/firebase/firebaseConfig";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import { useNotification } from "@/hooks/useNotification";
import { useClearCart } from "./useClearCart";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebaseConfig";
import { useRouter } from "next/navigation";
import type { Order, PaymentInfo } from "@/types/order";
import { Address } from "@/types/userTypes";
import { creditBonuses, redeemBonuses } from "@/services/bonusesService";

interface UseSubmitOrderParams {
  order: Order | null;
  shipAddress: Address | null;
  selectedPayment: PaymentInfo | null;
  pmIdx: number | null;
  usedBonuses: number;
  finalTotal: number;
}

export function useSubmitOrder({
  order,
  shipAddress,
  selectedPayment,
  pmIdx,
  usedBonuses,
  finalTotal,
}: UseSubmitOrderParams) {
  const [user] = useAuthState(auth);
  const { notify } = useNotification();
  const clearCart = useClearCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const submit = useCallback(async () => {
    if (!order || !shipAddress || pmIdx === null || !selectedPayment || !user)
      return;
    setSubmitting(true);
    try {
      const now = serverTimestamp();
      const paidInfo: PaymentInfo = {
        ...selectedPayment,
        transactionId: `TXN-${Date.now()}`,
        paid: true,
      };
      const fullOrder = {
        ...order,
        shippingAddress: shipAddress,
        paymentInfo: paidInfo,
        usedBonuses,
        total: finalTotal,
        status: "Pending",
        createdAt: now,
        updatedAt: now,
        userId: user.uid,
      };

      const ref = await addDoc(collection(db, "orders"), fullOrder);
      await updateDoc(doc(db, "users", user.uid), {
        orders: arrayUnion(ref.id),
      });

      if (usedBonuses > 0) {
        await redeemBonuses(user.uid, usedBonuses);
      }

      await creditBonuses(user.uid, finalTotal);

      await clearCart();
      router.push(`/checkout/success?orderId=${ref.id}`);
    } catch (e) {
      notify({
        type: "error",
        message: (e as Error).message || "Submit failed",
      });
    } finally {
      setSubmitting(false);
    }
  }, [
    order,
    shipAddress,
    pmIdx,
    selectedPayment,
    user,
    usedBonuses,
    finalTotal,
    clearCart,
    router,
    notify,
  ]);

  return { submit, submitting };
}
