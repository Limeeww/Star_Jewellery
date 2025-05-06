import React from "react";
import Link from "next/link";
import Item from "../components/Item/Item";
import { EmblaOptionsType } from "embla-carousel";
import { useProducts } from "@/hooks/useProducts";
import EmblaCarousel from "../components/EmblaCarousel/EmblaCarousel";
import Notification from "@/app/components/MessageHandling/Notification";

const OPTIONS: EmblaOptionsType = { dragFree: true };

export default function CollectionPage() {
  const {
    products: items,
    loading,
    notification,
    clearNotification,
  } = useProducts(10);


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
          className="text-sm text-gray-600 hover:text-gray-800 underline"
        >
          VIEW ALL
        </Link>
      </div>

      {loading ? (
        <div className="text-center">Loading products...</div>
      ) : (
        <EmblaCarousel options={OPTIONS}>
          {items.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-1/2 md:w-1/4">
              <Item product={product} />
            </div>
          ))}
        </EmblaCarousel>
      )}

      {notification && (
        <Notification {...notification} onClose={clearNotification} />
      )}
    </div>
  );
}
