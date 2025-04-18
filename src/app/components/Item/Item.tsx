"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product, ProductVariant } from "../../types/product";

type LightProduct = {
  id: number;
  slug: string;
  name: string;
  image: string;     // единичная картинка
  variantId: number; // id варианта
};

type ItemProps = {
  product: Product | LightProduct;
  displayedVariant?: ProductVariant;
};

export default function Item({ product, displayedVariant }: ItemProps) {
  // 1. Если передали конкретный вариант — используем его
  const fullVariant = displayedVariant;

  // 2. Если это LightProduct (нет поля variants), строим «вариант» вручную
  const lightVariant = !("variants" in product)
    ? ({
      id: product.variantId,
      images: [product.image],
      price: undefined, // если цена не передаёте в light-модель
    } as unknown as ProductVariant)
    : undefined;

  // 3. Иначе — берём первый вариант из полного продукта
  const fallbackVariant = ("variants" in product && product.variants?.[0]) || undefined;

  // Итоговый вариант
  const variant = fullVariant ?? lightVariant ?? fallbackVariant;

  // --- Ссылка на товар + вариант ---
  const href = variant
    ? `/${product.slug}?variantID=${variant.id}`
    : `/${product.slug}`;

  // --- src картинки (как раньше) ---
  // Предпочитаем images[0] из variant; иначе — поле light image; иначе плейсхолдер
  const src =
    variant?.images?.[0] ??
    // @ts-expect-error: у lightProduct есть поле image
    (product as LightProduct).image ??
    "/placeholder.jpg";

  return (
    <Link
      href={href}
      className="
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
          {product.name}
        </h3>

        {variant?.price != null && (
          <p className="text-base md:text-lg mt-1" style={{ fontFamily: "var(--font-poppins)" }}>
            ₴ <span className="font-semibold">{variant.price.toLocaleString()}</span>
          </p>
        )}
      </div>
    </Link>
  );
}
