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

type ItemProps = {
  product: Product;
};

export default function Item({ product }: ItemProps) {
  
  return (
    <Link
      key={product.id}
      href={product.slug ? `/${product.slug}/?variantID=${product.variantID}` : "#"}
      className="border p-2 text-gray-800 hover:shadow transition duration-300 bg-white"
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
        <p
          className="text-md font-semibold mt-1"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          €{product.price.toLocaleString()}
        </p>
      )}
    </Link>
  );
}
