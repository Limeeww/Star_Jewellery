"use client";

import React from "react";
import { Product } from "@/types/product";
import { ProductCard } from "@/app/components/Item/ProductCard";

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} item={p} />
      ))}
    </div>
  );
}
