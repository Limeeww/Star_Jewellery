"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "../../types/product";

type ItemProps = {
  product: Product;
};

export default function Item({ product }: ItemProps) {
  return (
    <Link
      key={product.id}
      href={
        product.slug
          ? `/${product.slug}/?variantID=${product.variants[0].id}`
          : "#" // TODO: get exact id from product that
      }
      className="
      border 
      p-2 
      text-gray-800  
      hover:shadow-lg 
      transition-shadow 
      duration-300 
      bg-white 
      flex 
      flex-col
      h-full
    "
    >
      <div className="overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={300}
          height={300}
          className="
          w-full
          object-cover
          transform
          transition
          duration-300
          hover:scale-105
          aspect-square
        "
        />
      </div>

      <div className="mt-2 flex flex-col flex-grow justify-between">
        <div>
          <h3
            className="
            text-base 
            md:text-lg 
            font-medium
          "
          >
            {product.name}
          </h3>
          <p className="text-sm text-gray-500">{product.description}</p>
        </div>

        {product.price && (
          <p
            className="
            text-base 
            md:text-lg 
            
            mt-1
          "
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            ₴<span className="font-semibold">{product.price.toLocaleString()}</span>
          </p>
        )}
      </div>
    </Link>
  );
}
