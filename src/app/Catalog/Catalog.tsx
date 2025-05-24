"use client";

import React from "react";
import Link from "next/link";
import { EmblaOptionsType } from "embla-carousel";
import EmblaCarousel from "@/app/components/EmblaCarousel/EmblaCarousel";
import Notification from "@/app/components/MessageHandling/Notification";
import Loading from "@/app/components/Loading/Loading";
import { useProducts } from "@/hooks/useProducts";
import { useProduct } from "@/hooks/useProduct";
import Item from "@/app/components/Item/Item";
import { Product } from "@/types/product";
import { useAuthStatus } from "@/hooks";

const OPTIONS: EmblaOptionsType = { dragFree: true };

//DELETE IT
function ProductCard({ product }: { product: Product }) {
  const {
    displayedVariant,
    sizeOptions,
    insertOptions,
    selectedSize,
    handleSizeChange,
    handleInsertChange,
  } = useProduct(product);

  return (
    <Item
      product={product}
      displayedVariant={displayedVariant}
      mode="default"
      sizeOptions={sizeOptions}
      insertOptions={insertOptions}
      selectedSize={selectedSize}
      onSizeChange={handleSizeChange}
      onInsertChange={handleInsertChange}
    />
  );
}

export default function CatalogPage() {
  const { user, loading: authLoading } = useAuthStatus();
  const {
    products,
    loading: productsLoading,
    notification,
    clearNotification,
  } = useProducts(10);

  if (authLoading) return <Loading />;

  if (productsLoading) return <Loading />;

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
          href="/all-collections"
          className="text-md text-gray-600 hover:text-gray-800 underline"
        >
          VIEW ALL
        </Link>
      </div>

      <EmblaCarousel options={OPTIONS}>
        {products.map((product) => (
          <div key={product.id} className="flex-shrink-0 w-1/2 xl:w-1/3">
            <ProductCard product={product} />
          </div>
        ))}
      </EmblaCarousel>

      {notification && (
        <Notification {...notification} onClose={clearNotification} />
      )}
    </div>
  );
}
