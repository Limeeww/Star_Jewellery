"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  QueryDocumentSnapshot,
  FirestoreDataConverter,
  SnapshotOptions,
  Timestamp,
  getDoc,
  doc,
  documentId,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebaseConfig";
import type { Order } from "@/types/order";

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

function paginateArray<T>(arr: T[], pageSize: number): T[][] {
  const pages: T[][] = [];
  for (let i = 0; i < arr.length; i += pageSize) {
    pages.push(arr.slice(i, i + pageSize));
  }
  return pages;
}

export function usePaginatedUserOrders(pageSize: number = 5) {
  const [user, loadingAuth] = useAuthState(auth);
  const [orderIds, setOrderIds] = useState<string[] | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(0);

  const db = getFirestore();

  useEffect(() => {
    if (loadingAuth) return;
    if (!user) {
      setError(new Error("Not authenticated"));
      return;
    }
    const loadIds = async () => {
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        const data = snap.exists()
          ? (snap.data() as { orders?: string[] })
          : {};
        setOrderIds(Array.isArray(data.orders) ? data.orders : []);
      } catch (e) {
        setError(e instanceof Error ? e : new Error(String(e)));
      }
    };
    loadIds();
  }, [user, loadingAuth, db]);

  const fetchPage = useCallback(async () => {
    if (orderIds === null) return;
    const pages = paginateArray(orderIds, pageSize);
    if (page < 0 || page >= pages.length) return;

    setLoading(true);
    setError(null);

    try {
      const chunk = pages[page];
      if (chunk.length === 0) {
        setOrders([]);
        return;
      }

      const q = query(
        collection(db, "orders").withConverter(orderConverter),
        where(documentId(), "in", chunk)
      );

      const snap = await getDocs(q);
      setOrders(snap.docs.map((d) => d.data()));
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false);
    }
  }, [db, orderIds, page, pageSize]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  const totalPages = orderIds ? Math.ceil(orderIds.length / pageSize) : 0;
  const hasPrev = page > 0;
  const hasNext = page + 1 < totalPages;

  const prevPage = () => {
    if (hasPrev) setPage((p) => p - 1);
  };
  const nextPage = () => {
    if (hasNext) setPage((p) => p + 1);
  };

  return {
    orders,
    loading: loadingAuth || loading,
    error,
    page,
    totalPages,
    hasPrev,
    hasNext,
    prevPage,
    nextPage,
  };
}
