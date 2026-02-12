import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import type { Order } from "@/types/order";
import { User } from "firebase/auth";

export default function useOrder(orderId: string | null, user: User | null) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId || !user) return;
    (async () => {
      setLoading(true);
      const snap = await getDoc(doc(db, "orders", orderId));
      if (!snap.exists()) {
        setError("Order not found.");
      } else {
        const data = snap.data() as Order & { userId: string };
        if (data.userId !== user.uid) {
          setError("You are not authorized to view this order.");
        } else {
          setOrder(data);
        }
      }
      setLoading(false);
    })();
  }, [orderId, user]);

  return { order, loading, error };
}
