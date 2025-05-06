// src/app/components/Item/Item.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebaseConfig";
import { useCart } from "@/hooks/useCart";
import WishlistButton from "@/app/components/WishlistButton";
import ActionButton from "@/app/components/FormComponents/ActionButton";
import SelectField from "@/app/components/FormComponents/SelectField";

import type { Product, ProductVariant } from "@/types/product";
import type { WishlistItem } from "@/types/userTypes";
import type { CartItem } from "@/types/cartItem";

type LightProduct = {
  id: number;
  slug: string;
  name: string;
  image: string;
  variantId: number;
};

interface ItemProps {
  product: Product | LightProduct;
  displayedVariant?: ProductVariant;
  mode?: "default" | "recent";

  sizeOptions?: { value: string; label: string }[];
  insertOptions?: { value: string; label: string }[];
  materialColorOptions?: { value: string; label: string }[];

  selectedSize?: string;
  onSizeChange?: (size: string) => void;
  onInsertChange?: (insert: string) => void;
  onColorChange?: (color: string) => void;
}

export default function Item({
  product,
  displayedVariant,
  mode = "default",
  sizeOptions = [],
  insertOptions = [],
  selectedSize = "",
  onSizeChange,
  onInsertChange,
}: ItemProps) {
  const variant: ProductVariant =
    displayedVariant ??
    ("variants" in product
      ? product.variants[0]
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
  const src = variant.images?.[0] ?? "/placeholder.jpg";

  const wishlistItem: WishlistItem = {
    productId: product.id,
    variantId: variant.id,
    slug: product.slug,
    materialColor: variant.materialColor,
    insert: variant.insert,
    size: Number(selectedSize) || 0,
    price: variant.price ?? 0,
    image: src,
  };

  const [user] = useAuthState(auth);
  const userId = user?.uid ?? null;
  const { addOrIncrement } = useCart(userId);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!userId) return;

    const item: CartItem = {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      description: "description" in product ? product.description : "",
      variantId: variant.id,
      originalPrice: variant.price ?? 0,
      discountName: "",
      imageUrl: src,
      price: variant.price ?? 0,
      quantity: 1,
      size: Number(selectedSize),
      insert: variant.insert,
      materialColor: variant.materialColor,
    };

    setIsAdding(true);
    await addOrIncrement(item);
    setIsAdding(false);
  };

  const needSize = sizeOptions.length > 0;
  const needInsert = insertOptions.length > 0;

  let missingText = "";
  if (needSize && !selectedSize) missingText = "Select size";
  else if (needInsert && !variant.insert) missingText = "Select insert";

  const btnDisabled = isAdding || !!missingText;
  const btnText = isAdding ? "Adding…" : missingText || "Add to Cart";

  return (
    <div className="p-2">
      <div className="relative border p-2 bg-white text-gray-800 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
        <Link href={href} className="block flex-grow">
          <div className="relative w-full pb-[100%] overflow-hidden">
            <Image
              src={src}
              alt={product.name}
              fill
              className="absolute inset-0 object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
          <h3 className="mt-2 text-base md:text-lg font-medium break-words">
            {product.name}{" "}
            <span className="text-sm text-gray-400">#{variant.id}</span>
          </h3>
          {mode === "default" && (
            <p className="text-base md:text-lg mt-1">
              <span className="font-semibold">
                {variant.price?.toLocaleString()}
              </span>{" "}
              ₴
            </p>
          )}
        </Link>

        {mode === "default" && (
          <form className="mt-4 space-y-3">
            {needSize && (
              <SelectField
                label="Size"
                value={selectedSize}
                onChange={onSizeChange!}
                options={sizeOptions}
                placeholder="Select size"
                id="size"
              />
            )}
            {needInsert && (
              <SelectField
                label="Insert"
                value={variant.insert}
                onChange={onInsertChange!}
                options={insertOptions}
                placeholder="Select insert"
                id="insert"
              />
            )}

            <ActionButton
              text={btnText}
              disabled={btnDisabled}
              onClick={handleAddToCart}
              className="w-full bg-black text-white px-4 py-2 rounded disabled:opacity-50"
            />
          </form>
        )}

        {mode === "default" && (
          <div className="absolute top-2 right-2 z-10">
            <WishlistButton item={wishlistItem} />
          </div>
        )}
      </div>
    </div>
  );
}
