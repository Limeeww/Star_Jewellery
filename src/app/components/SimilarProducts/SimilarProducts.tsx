"use client";

import React from "react";
import EmblaCarousel from "@/app/components/EmblaCarousel/EmblaCarousel";
import Item from "../Item/Item";
import { EmblaOptionsType } from "embla-carousel";
import { useProducts } from "@/hooks/useProducts";

const SimilarProducts = () => {
  const { products, loading } = useProducts(6);

  const options: EmblaOptionsType = {
    align: "start",
    loop: false,
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div
      className="sm:px-6 lg:px-6 py-6"
      style={{ fontFamily: "var(--font-poppins)" }}
      id="similar-products"
    >
      <h1
        className="text-center text-3xl text-gray-800 mb-1"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Similar Products
      </h1>
      <EmblaCarousel options={options}>
        {products.map((product) => (
          <div key={product.id} className="flex-shrink-0 w-1/2 xl:w-1/4">
            <Item product={product} />
          </div>
        ))}
      </EmblaCarousel>
    </div>
  );
};

export default SimilarProducts;
