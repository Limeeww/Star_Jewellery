"use client";

import React, { useState, useEffect } from "react";
// import Link from "next/link";
import Item from "../Item/Item";
// import EmblaCarousel from "../EmblaCarousel/EmblaCarousel";
// import { EmblaOptionsType } from "embla-carousel";
import { Product } from "../../types/product";
import { fetchProducts } from "../../utils/product";

// const OPTIONS: EmblaOptionsType = { dragFree: true };
// const SLIDE_COUNT = 10;
// const SLIDES = Array.from(Array(SLIDE_COUNT).keys());

const SimilarProducts = () => {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    async function loadSimilarProducts() {
      const products = await fetchProducts(4);
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((product) => (
          <Item key={product.id} product={product} />
        ))}
      </div>

      {/* <EmblaCarousel slides={SLIDES} options={OPTIONS} /> */}
    </div>
  );
};

export default SimilarProducts;
