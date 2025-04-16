import React, { useState, useEffect } from "react";
import Link from "next/link";
import Item from "../components/Item/Item";
import { EmblaOptionsType } from "embla-carousel";
import { Product } from "../types/product";
import { fetchProducts } from "../utils/product";
import EmblaCarousel from "../components/EmblaCarousel/EmblaCarousel";

const OPTIONS: EmblaOptionsType = { dragFree: true };

export default function CollectionPage() {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts() {
      const products = await fetchProducts(10);
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

      <div className="text-center mb-">
        <Link
          href="/all-collections"
          className="text-sm text-gray-600 hover:text-gray-800 underline"
        >
          VIEW ALL
        </Link>
      </div>

      <EmblaCarousel options={OPTIONS}>
        {items.map((product) => (
          <div key={product.id} className="flex-shrink-0 w-1/2 md:w-1/4 px-2">
            <Item product={product} />
          </div>
        ))}
      </EmblaCarousel>
    </div>
  );
}
