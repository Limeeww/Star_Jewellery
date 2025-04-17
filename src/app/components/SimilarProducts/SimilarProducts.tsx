// components/SimilarProducts.tsx
"use client";

import React, { useEffect, useState } from "react";
import EmblaCarousel from "../../components/EmblaCarousel/EmblaCarousel";
import Item from "../Item/Item";
import { Product } from "../../types/product";
import { fetchProducts } from "../../utils/product";
import { EmblaOptionsType } from "embla-carousel";

const SimilarProducts = () => {
  const [items, setItems] = useState<Product[]>([]);

  const options: EmblaOptionsType = {
    align: "start",
    loop: false,
  };

  useEffect(() => {
    async function loadSimilarProducts() {
      const products = await fetchProducts(6);
      setItems(products);
    }
    loadSimilarProducts();
  }, []);

  return (
    <div
      className="sm:px-6 lg:px-6 py-8"
      style={{ fontFamily: "var(--font-poppins)" }}
      id="similar-products"
    >
      <h1
        className="text-center text-3xl text-gray-800 mb-4"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Similar Products
      </h1>
      <EmblaCarousel options={options}>
        {items.map((product) => (
          <div key={product.id} className="flex-shrink-0 w-1/2 xl:w-1/4 px-2">
            <Item product={product} />
          </div>
        ))}
      </EmblaCarousel>
    </div>
  );
};

export default SimilarProducts;
