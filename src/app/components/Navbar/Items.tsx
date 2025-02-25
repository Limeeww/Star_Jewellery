"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  description: string;
  image: string;
  slug: string;
  variantID: string;
};

type ItemsProps = {
  items: Product[];
};

export default function Items({ items }: ItemsProps) {
  if (items.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500">No products found</p>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-3 pb-6 gap-2"
      style={{ fontFamily: "var(--font-poppins)" }}
    >
      {items.map((product) => (
        <Link
          key={product.id}
          href={`/${product.slug}/?variantID=${product.variantID}`}
          className="border p-2 text-gray-800 hover:shadow"
        >
          <Image
            src={product.image}
            alt={product.name}
            width={200}
            height={200}
            className="w-full h-auto object-cover"
          />
          <h3 className="text-sm font-medium mt-2">{product.name}</h3>
          <p className="text-xs text-gray-500">{product.description}</p>
        </Link>
      ))}
    </div>
  );
}
