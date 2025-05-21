"use client";

import React, { useEffect, useState, useCallback } from "react";
import EmblaCarousel from "@/app/components/EmblaCarousel/EmblaCarousel";
import Item from "@/app/components/Item/Item";
import { useNotification } from "@/hooks/useNotification";
import { Timestamp } from "firebase/firestore";
import type { Product } from "@/types/product";

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
  const [mounted, setMounted] = useState(false);

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

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // на сервере и до первого client-effect вообще не рендерим
    return null;
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Recently Viewed</h2>

      {recent.length === 0 ? (
        <p className="text-gray-600 text-sm">No recently viewed items yet.</p>
      ) : (
        <EmblaCarousel options={{ align: "start", dragFree: true }}>
          {recent.map((p) => {
            const fakeProduct: Product = {
              id: p.id,
              name: p.name,
              description: "",
              slug: p.slug,
              categoryId: 0,
              variants: [
                {
                  id: p.variantId,
                  price: 0,
                  weight: 0,
                  material: "",
                  materialColor: "",
                  purity: undefined,
                  insert: "",
                  insertColor: "",
                  quantitySize: [],
                  images: [p.image],
                },
              ],
              createdAt: Timestamp.now(),
              updatedAt: Timestamp.now(),
              isHidden: false,
              additionalDescription: "",
            };

            return (
              <div
                key={`${p.id}-${p.variantId}`}
                className="flex-shrink-0 w-1/2 xl:w-1/3 mr-6"
              >
                <Item product={fakeProduct} mode="recent" />
              </div>
            );
          })}
        </EmblaCarousel>
      )}
    </div>
  );
}
