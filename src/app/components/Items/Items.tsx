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
  price?: number;
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
      className="grid grid-cols-2 md:grid-cols-4 gap-4"
      style={{ fontFamily: "var(--font-poppins)" }}
    >
      {items.map((product) => (
        <Link
          key={product.id}
          href={`/${product.slug}/?variantID=${product.variantID}`}
          className="border p-2 text-gray-800 hover:shadow transition duration-300 bg-white "
        >
          <div className="overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              width={150}    
              height={150}
              className="
                w-full
                h-auto
                object-cover
                transform
                transition
                duration-300
                hover:scale-105
              "
            />
          </div>
          <h3 className="text-md font-medium mt-2">{product.name}</h3>
          <p className="text-sm text-gray-500">{product.description}</p>
          {product.price && (
            <p className="text-md font-semibold mt-1" style={{ fontFamily: "var(--font-poppins)" }}>
              €{product.price.toLocaleString()}
            </p>
          )}
        </Link>
      ))}
    </div>
  );
}
