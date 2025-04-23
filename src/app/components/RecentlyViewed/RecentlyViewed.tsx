"use client";

import React, { useEffect, useState, useCallback } from "react";
import EmblaCarousel from "@/app/components/EmblaCarousel/EmblaCarousel";
import Item from "@/app/components/Item/Item";
import { useNotification } from "@/hooks/useNotification";

export interface RecentEntry {
  id: number;
  slug: string;
  name: string;
  image: string;
  variantId: number;
  date: Date;
}

export default function RecentlyViewed() {
  const [recent, setRecent] = useState<RecentEntry[]>([]);
  const { notify } = useNotification();

  const loadFromStorage = useCallback(() => {
    try {
      const stored = localStorage.getItem("recentlyViewed");
      setRecent(stored ? (JSON.parse(stored) as RecentEntry[]) : []);
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

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold">Recently Viewed</h2>

      <EmblaCarousel options={{ align: "start", dragFree: true }}>
        {recent.map((p) => (
          <div key={`${p.id}-${p.variantId}`} className="min-w-[320px]">
            <Item product={p} />
          </div>
        ))}
      </EmblaCarousel>
    </div>
  );
}
