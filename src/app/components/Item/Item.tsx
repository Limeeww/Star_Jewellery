"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product, ProductVariant } from "@/types/product";
import WishlistButton from "@/app/components/WishlistButton";
import type { WishlistItem } from "@/types/userTypes";

type LightProduct = {
  id: number;
  slug: string;
  name: string;
  image: string;
  variantId: number;
};

type Props = {
  product: Product | LightProduct;
  displayedVariant?: ProductVariant;
  mode?: "default" | "recent";
};

export default function Item({
  product,
  displayedVariant,
  mode = "default",
}: Props) {
  const variant: ProductVariant =
    displayedVariant ??
    ("variants" in product
      ? (product.variants![0] as ProductVariant)
      : {
          id: product.variantId,
          images: [product.image],
          price: 0,
          weight: 0,
          material: "",
          materialColor: "",
          insert: "",
          insertColor: "",
          quantitySize: [],
        });

  const href = `/${product.slug}${
    variant.id ? `?variantID=${variant.id}` : ""
  }`;
  const src =
    variant.images?.[0] ??
    ("image" in product ? product.image : "/placeholder.jpg");

  const wishlistItem: WishlistItem = {
    productId: product.id,
    variantId: variant.id,
    slug: product.slug,
    materialColor: variant.materialColor,
    insert: variant.insert,
    size: (variant as any).size ?? 0,
    price: variant.price ?? 0,
    image: src,
  };

  return (
    <div className="p-2">
      <div className="relative">
        <Link
          href={href}
          className="
            block
            w-full max-w-xs sm:max-w-sm md:max-w-none
            border p-2 bg-white text-gray-800
            hover:shadow-lg transition-shadow duration-300
            flex flex-col h-full break-inside-avoid
          "
        >
          <div className="relative w-full pb-[100%] overflow-hidden">
            <Image
              src={src}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, 300px"
              className="
                absolute inset-0 object-cover
                transition-transform duration-300 hover:scale-105
              "
            />
          </div>

          <div className="mt-2 flex flex-col flex-grow justify-between min-h-0">
            <h3 className="text-base md:text-lg font-medium break-words">
              {product.name}{" "}
              <span className="text-sm text-gray-400">#{variant.id}</span>
            </h3>

            {variant.price != null && mode === "default" && (
              <p className="text-base md:text-lg mt-1">
                <span className="font-semibold">
                  {variant.price.toLocaleString()}
                </span>{" "}
                ₴
              </p>
            )}
          </div>
        </Link>

        {mode === "default" && (
          <div className="absolute top-2 right-2 z-10">
            <WishlistButton item={wishlistItem} />
          </div>
        )}
      </div>
    </div>
  );
}
