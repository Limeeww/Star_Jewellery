"use client";

import React, { useEffect, useState, useCallback } from "react";
import EmblaCarousel from "@/app/components/EmblaCarousel/EmblaCarousel";
import Item from "@/app/components/Item/Item";
import { Product } from "@/app/types/product";
import { useNotification } from "@/app/utils/useNotification";



export default function RecentlyViewed() {
  const [recent, setRecent] = useState<Product[]>([]);
  const { notify } = useNotification();

  const loadFromStorage = useCallback(() => {
    try {
      const stored = localStorage.getItem("recentlyViewed");
      setRecent(stored ? (JSON.parse(stored) as Product[]) : []);
    } catch (e) {
      notify({ type: "error", message: `Error reading recently viewed: ${e}` });
    }
  }, [notify]);

  useEffect(() => {
    loadFromStorage();

    const handler = (e: StorageEvent) => {
      if (e.key === "recentlyViewed") loadFromStorage();
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [loadFromStorage]);

  if (recent.length === 0) return null;

  console.log("recently viewed", recent);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Recently Viewed</h2>

      <EmblaCarousel options={{ align: "start", dragFree: true }}>
        {recent.map((p) => (
          <div key={p.id} className="min-w-[220px] pr-4">
            <Item product={p} />
          </div>
        ))}
      </EmblaCarousel>
    </div>
  );
}
