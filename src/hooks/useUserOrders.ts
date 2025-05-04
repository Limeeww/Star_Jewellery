"use client";

import { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  query,
  where,
  getDocs,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
  documentId,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebaseConfig";
import type { Order } from "@/types/order";

// Конвертер: безопасно конвертим Timestamp -> Date
const orderConverter: FirestoreDataConverter<Order> = {
  toFirestore(order) {
    return {
      ...order,
      orderDate: order.orderDate,
      updatedAt: order.updatedAt,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Order {
    const data = snapshot.data(options)! as Order;
    let orderDate: Date;
    if (data.orderDate instanceof Timestamp) {
      orderDate = data.orderDate.toDate();
    } else if (
      typeof data.orderDate === "string" ||
      typeof data.orderDate === "number"
    ) {
      orderDate = new Date(data.orderDate);
    } else {
      orderDate = data.orderDate;
    }
    let updatedAt: Date;
    if (data.updatedAt instanceof Timestamp) {
      updatedAt = data.updatedAt.toDate();
    } else if (
      typeof data.updatedAt === "string" ||
      typeof data.updatedAt === "number"
    ) {
      updatedAt = new Date(data.updatedAt);
    } else {
      updatedAt = data.updatedAt;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { orderDate: _, updatedAt: __, ...rest } = data;
    return {
      ...rest,
      orderDate,
      updatedAt,
    } as Order;
  },
};

// Разбить массив на чанки по size элементов
function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

export function useUserOrders() {
  const [user, loadingAuth] = useAuthState(auth);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (loadingAuth) return;

    if (!user) {
      setError(new Error("User is not authenticated"));
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      const db = getFirestore();

      try {
        // Читаем массив ID заказов из users/{uid}.orders
        const userSnap = await getDoc(doc(db, "users", user.uid));
        const data = userSnap.exists()
          ? (userSnap.data() as { orders?: string[] })
          : {};
        const orderIds = Array.isArray(data.orders) ? data.orders : [];

        if (orderIds.length === 0) {
          if (!cancelled) setOrders([]);
          return;
        }

        // Разбиваем на чанки и делаем запросы по documentId
        const all: Order[] = [];
        for (const chunk of chunkArray(orderIds, 10)) {
          const q = query(
            collection(db, "orders").withConverter(orderConverter),
            where(documentId(), "in", chunk)
          );
          const snap = await getDocs(q);
          snap.forEach((d) => all.push(d.data()));
        }

        if (!cancelled) {
          setOrders(all);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e : new Error(String(e)));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchOrders();
    return () => {
      cancelled = true;
    };
  }, [user, loadingAuth]);

  return { orders, loading: loadingAuth || loading, error };
}
