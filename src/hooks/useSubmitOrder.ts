// import { useCallback, useState } from "react";
// import { db } from "@/firebase/firebaseConfig";
// import {
//   collection,
//   addDoc,
//   doc,
//   updateDoc,
//   arrayUnion,
//   serverTimestamp,
// } from "firebase/firestore";
// import { useNotification } from "@/hooks/useNotification";
// import { useClearCart } from "./useClearCart";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { auth } from "@/firebase/firebaseConfig";
// import { useRouter } from "next/navigation";
// import type { Order, PaymentInfo } from "@/types/order";
// import { Address } from "@/types/userTypes";
// import { creditBonuses, redeemBonuses } from "@/services/bonusesService";

// interface UseSubmitOrderParams {
//   order: Order | null;
//   shipAddress: Address | null;
//   selectedPayment: PaymentInfo | null;
//   pmIdx: number | null;
//   usedBonuses: number;
//   finalTotal: number;
// }

// export function useSubmitOrder({
//   order,
//   shipAddress,
//   selectedPayment,
//   pmIdx,
//   usedBonuses,
//   finalTotal,
// }: UseSubmitOrderParams) {
//   const [user] = useAuthState(auth);
//   const { notify } = useNotification();
//   const clearCart = useClearCart();
//   const router = useRouter();
//   const [submitting, setSubmitting] = useState(false);

//   const submit = useCallback(async () => {
//     if (!order || !shipAddress || pmIdx === null || !selectedPayment || !user)
//       return;
//     setSubmitting(true);
//     try {
//       const now = serverTimestamp();
//       const paidInfo: PaymentInfo = {
//         ...selectedPayment,
//         transactionId: `TXN-${Date.now()}`,
//         paid: true,
//       };
//       const fullOrder = {
//         ...order,
//         shippingAddress: shipAddress,
//         paymentInfo: paidInfo,
//         usedBonuses,
//         total: finalTotal,
//         status: "Pending",
//         createdAt: now,
//         updatedAt: now,
//         userId: user.uid,
//       };

//       const ref = await addDoc(collection(db, "orders"), fullOrder);
//       await updateDoc(doc(db, "users", user.uid), {
//         orders: arrayUnion(ref.id),
//       });

//       if (usedBonuses > 0) {
//         await redeemBonuses(user.uid, usedBonuses);
//       }

//       await creditBonuses(user.uid, finalTotal);

//       await clearCart();
//       router.push(`/checkout/success?orderId=${ref.id}`);
//     } catch (e) {
//       notify({
//         type: "error",
//         message: (e as Error).message || "Submit failed",
//       });
//     } finally {
//       setSubmitting(false);
//     }
//   }, [
//     order,
//     shipAddress,
//     pmIdx,
//     selectedPayment,
//     user,
//     usedBonuses,
//     finalTotal,
//     clearCart,
//     router,
//     notify,
//   ]);

//   return { submit, submitting };
// }

import { useCallback, useState } from "react";
import { db, auth } from "@/firebase/firebaseConfig";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { useNotification } from "@/hooks/useNotification";
import { useClearCart } from "./useClearCart";
import { useAuthState } from "react-firebase-hooks/auth";
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
    console.log("🔔 submit() called");
    console.log("Order data:", order);
    console.log("Shipping address:", shipAddress);
    console.log("Selected payment:", selectedPayment);
    console.log("Payment method index:", pmIdx);
    console.log("Used bonuses:", usedBonuses);
    console.log("Final total:", finalTotal);
    console.log("User:", user);

    if (!order || !shipAddress || pmIdx === null || !selectedPayment || !user) {
      console.warn("🚫 Missing required data. Submit aborted.");
      return;
    }

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
        status: "pending",
        createdAt: now,
        updatedAt: now,
        userId: user.uid,
      };

      // 1. Deduct inventory, but wrap each item in its own try/catch
      await Promise.all(
        order.products.map(async (item) => {
          try {
            const productRef = doc(db, "products", String(item.productId));
            const snap = await getDoc(productRef);
            if (!snap.exists()) {
              console.warn(
                `Product ${item.productId} not found. Skipping inventory update.`,
              );
              return;
            }

            const data = snap.data();
            const variants = data.variants as {
              id: number;
              quantitySize: { size: string; quantity: number }[];
            }[];

            const variantIndex = variants.findIndex(
              (v) => String(v.id) === String(item.variantId),
            );
            if (variantIndex === -1) {
              console.warn(
                `Variant ${item.variantId} for product ${item.productId} not found. Skipping.`,
              );
              return;
            }

            const updatedSizes = variants[variantIndex].quantitySize.map(
              (q) => {
                if (String(q.size) === String(item.size)) {
                  const newQty = q.quantity - item.quantity;
                  if (newQty < 0) {
                    console.warn(
                      `Not enough stock for size ${q.size} on product ${item.productId}. Skipping.`,
                    );
                    return q;
                  }
                  return { ...q, quantity: newQty };
                }
                return q;
              },
            );

            variants[variantIndex].quantitySize = updatedSizes;
            await updateDoc(productRef, { variants });
          } catch (eItem) {
            console.error(
              `Error updating inventory for product ${item.productId}, variant ${item.variantId}:`,
              eItem,
            );
            // Do not throw further so other steps continue
          }
        }),
      );

      // 2. Create order
      const ref = await addDoc(collection(db, "orders"), fullOrder);
      console.log("✅ Order created with ID:", ref.id);

      // 3. Link order to user
      await updateDoc(doc(db, "users", user.uid), {
        orders: arrayUnion(ref.id),
      });

      // 4. Redeem bonuses if used
      if (usedBonuses > 0) {
        await redeemBonuses(user.uid, usedBonuses);
        console.log("🎯 Bonuses redeemed:", usedBonuses);
      }

      // 5. Accrue bonuses for purchase
      await creditBonuses(user.uid, finalTotal);
      console.log("💰 Bonuses credited:", finalTotal);

      // 6. Clear cart
      await clearCart();
      console.log("🧹 Cart cleared");

      // 7. Redirect to success page
      router.push(`/checkout/success?orderId=${ref.id}`);
    } catch (e) {
      console.error("❌ Submit failed:", e);
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
