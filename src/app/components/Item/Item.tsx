"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "../../types/product";

type ItemProps = {
  product: Product;
};

export default function Item({ product }: ItemProps) {
  const defaultVariant = product.variants[0];

  const href = defaultVariant
    ? `/${product.slug ?? `product/${product.id}`}?variantID=${
        defaultVariant.id
      }`
    : product.slug
    ? `/${product.slug}`
    : `/product/${product.id}`;

  return (
    <Link
      href={href}
      className="
        w-full
        max-w-xs sm:max-w-sm md:max-w-none
        border p-2 bg-white text-gray-800
        hover:shadow-lg transition-shadow duration-300
        flex flex-col h-full
        break-inside-avoid
      "
    >
      <div className="relative w-full pb-[100%] overflow-hidden">
        <Image
          src={defaultVariant?.images?.[0] ?? "/placeholder.jpg"}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, 300px"
          className="
            absolute inset-0
            object-cover
            transition-transform duration-300
            hover:scale-105
          "
        />
      </div>

      <div className="mt-2 flex flex-col flex-grow justify-between min-h-0">
        <div>
          <h3 className="text-base md:text-lg font-medium break-words">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-sm text-gray-500 overflow-hidden text-ellipsis">
              {product.description}
            </p>
          )}
        </div>

        {defaultVariant?.price != null && (
          <p
            className="text-base md:text-lg mt-1"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            ₴{" "}
            <span className="font-semibold">
              {defaultVariant.price.toLocaleString()}
            </span>
          </p>
        )}
      </div>
    </Link>
  );
}
