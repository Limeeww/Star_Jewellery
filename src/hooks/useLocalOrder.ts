import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useNotification } from "@/hooks/useNotification";
import type { Order } from "@/types/order";

export function useLocalOrder() {
  const [order, setOrder] = useState<Order | null>(null);
  const { notify } = useNotification();
  const router = useRouter();

  useEffect(() => {
    const raw = localStorage.getItem("currentOrder");
    if (!raw) {
      notify({ type: "error", message: "No order in progress." });
      return void router.replace("/cart");
    }
    try {
      setOrder(JSON.parse(raw));
    } catch {
      notify({ type: "error", message: "Failed to parse order." });
      router.replace("/cart");
    }
  }, [notify, router]);

  return order;
}