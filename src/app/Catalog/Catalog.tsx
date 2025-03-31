// pages/CollectionPage.tsx

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Item from "../components/Item/Item";
import EmblaCarousel from "../components/EmblaCarousel/EmblaCarousel";
import { EmblaOptionsType } from "embla-carousel";
import { Product } from "../types/product";
import { fetchProducts } from "../utils/product";

const OPTIONS: EmblaOptionsType = { dragFree: true };
const SLIDE_COUNT = 10;
const SLIDES = Array.from(Array(SLIDE_COUNT).keys());

export default function CollectionPage() {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts() {
      const products = await fetchProducts(4);
      setItems(products);
    }
    loadProducts();
  }, []);

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

      <div className="text-center mb-6">
        <Link
          href="/all-collections"
          className="text-sm text-gray-600 hover:text-gray-800 underline"
        >
          VIEW ALL
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((product) => (
          <Item key={product.id} product={product} />
        ))}
      </div>
      <EmblaCarousel slides={SLIDES} options={OPTIONS} />
    </div>
  );
}
