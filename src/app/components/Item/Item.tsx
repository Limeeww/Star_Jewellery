"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import WishlistButton from "@/app/components/WishlistButton";
import RemoveWishlistButton from "@/app/Account/components/RemoveWishlistButton";
import ActionButton from "@/app/components/FormComponents/ActionButton";
import SelectField from "@/app/components/FormComponents/SelectField";
import type { Product, ProductVariant } from "@/types/product";
import { badgeLabels } from "@/types/product";
import type { CartItem } from "@/types/cartItem";
import TagBadge from "./TagBadge";
import { useCartContext } from "@/app/contexts/CartContent";

interface Props {
  product: Product;
  displayedVariant?: ProductVariant;
  mode?: "default" | "recent" | "wishlist";
  sizeOptions?: { value: string; label: string }[];
  insertOptions?: { value: string; label: string }[];
  materialColorOptions?: { value: string; label: string }[];
  selectedSize?: string;
  onSizeChange?: (size: string) => void;
  onInsertChange?: (insert: string) => void;
  onColorChange?: (color: string) => void;
  onRemove?: () => void;
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
  onRemove,
}: Props) {
  const { addOrIncrement } = useCartContext();
  const [isAdding, setIsAdding] = useState(false);

  const variant: ProductVariant | undefined =
    displayedVariant ??
    (product.variants && product.variants.length > 0
      ? product.variants[0]
      : undefined);

  if (!variant) return null;

  const href = `/${product.slug}${
    variant.id ? `?variantID=${variant.id}` : ""
  }`;
  const src = variant.images?.[0] ?? "/placeholder.jpg";

  const needSize = sizeOptions.length > 1;
  const needInsert = insertOptions.length > 1;

  let missingText = "";
  if (needSize && !selectedSize) missingText = "Select size";
  else if (needInsert && !variant.insert) missingText = "Select insert";

  const btnDisabled = isAdding || !!missingText;
  const btnText = isAdding ? "Adding…" : missingText || "Add to Cart";

  const handleAddToCart = async () => {
    const item: CartItem = {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      description: product.description,
      variantId: variant.id,
      originalPrice: variant.price,
      discountName: "",
      imageUrl: src,
      price: variant.price,
      quantity: 1,
      size: Number(selectedSize),
      insert: variant.insert,
      materialColor: variant.materialColor,
    };
    setIsAdding(true);
    await addOrIncrement(item);
    setIsAdding(false);
  };

  return (
    <div
      className={`${
        mode === "wishlist" ? "p-0 max-w" : "p-2"
      } h-full flex flex-col`}
    >
      <div className="relative border p-2 bg-white text-gray-800 hover:shadow-lg transition-shadow duration-300 flex flex-col flex-1">
        {product.tag && (
          <TagBadge
            variant={product.tag}
            className="absolute top-4 left-4 z-10"
          >
            {badgeLabels[product.tag]}
          </TagBadge>
        )}
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
          {mode !== "recent" && (
            <p className="text-base md:text-lg mt-1">
              <span className="font-semibold">
                {variant.price.toLocaleString()}
              </span>{" "}
              ₴
            </p>
          )}
        </Link>

        {(mode === "default" || mode === "wishlist") && (
          <div className="mt-4 space-y-3">
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
              type="button"
              text={btnText}
              disabled={btnDisabled}
              onClick={handleAddToCart}
              className="w-full bg-black text-white px-4 py-1 disabled:opacity-50"
            />
          </div>
        )}

        <div className="absolute top-2 right-2 z-10">
          {mode === "default" && (
            <WishlistButton
              item={{
                product,
                productId: product.id,
                variantId: variant.id,
                slug: product.slug,
                materialColor: variant.materialColor,
                insert: variant.insert,
                size: Number(selectedSize) || 0,
                price: variant.price,
                image: src,
              }}
            />
          )}
          {mode === "wishlist" && <RemoveWishlistButton onClick={onRemove!} />}
        </div>
      </div>
    </div>
  );
}
