"use client";

import React from "react";
import Link from "next/link";
import { EmblaOptionsType } from "embla-carousel";
import EmblaCarousel from "@/app/components/EmblaCarousel/EmblaCarousel";
import Notification from "@/app/components/MessageHandling/Notification";
import Loading from "@/app/components/Loading/Loading";
import { useProducts } from "@/hooks/useProducts";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { ProductCard } from "@/app/components/Item/ProductCard";
import type { Product } from "@/types/product";

const OPTIONS: EmblaOptionsType = { dragFree: true };

export default function CatalogPage() {
  const { loading: authLoading } = useAuthStatus();
  const {
    products,
    loading: productsLoading,
    notification,
    clearNotification,
  } = useProducts(10);

  if (authLoading || productsLoading) {
    return <Loading />;
  }

  return (
    <div
      className="sm:px-6 lg:px-6 py-8"
      style={{ fontFamily: "var(--font-poppins)" }}
      id="catalog"
    >
      <h1
        className="text-center text-3xl text-gray-800 mb-2"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        CATALOG
      </h1>

      <div className="text-center mb-4">
        <Link
          href="/shop"
          className="text-md text-gray-600 hover:text-gray-800 underline"
        >
          VIEW ALL
        </Link>
      </div>

      <EmblaCarousel options={OPTIONS}>
        {products.map((product: Product) => (
          <div key={product.id} className="flex-shrink-0 w-1/4 xl:w-1/5">
            <ProductCard item={product} mode="default" />
          </div>
        ))}
      </EmblaCarousel>

      {notification && (
        <Notification {...notification} onClose={clearNotification} />
      )}
    </div>
  );
}
