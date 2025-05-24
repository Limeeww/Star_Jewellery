import React from "react";
import { useProduct } from "@/hooks/useProduct";
import Item from "@/app/components/Item/Item";
import type { Identifier, WishlistItem } from "@/types/userTypes";
import type { Product } from "@/types/product";

export type ProductCardProps =
  | {
      item: WishlistItem;
      onRemove: (id: Identifier) => Promise<void>;
      mode?: "wishlist";
    }
  | {
      item: Product;
      onRemove?: undefined;
      mode?: "default";
    };

export function ProductCard({ item, onRemove, mode }: ProductCardProps) {
  const product = "product" in item ? item.product : item;
  const variantId = "variantId" in item ? item.variantId : item.variants[0].id;

  const {
    displayedVariant,
    sizeOptions,
    insertOptions,
    materialColorOptions,
    selectedSize,
    handleSizeChange,
    handleInsertChange,
    handleColorChange,
  } = useProduct(product, variantId);

  return (
    <Item
      product={product}
      displayedVariant={displayedVariant}
      mode={mode}
      sizeOptions={sizeOptions}
      insertOptions={insertOptions}
      materialColorOptions={materialColorOptions}
      selectedSize={selectedSize}
      onSizeChange={handleSizeChange}
      onInsertChange={handleInsertChange}
      onColorChange={handleColorChange}
      onRemove={
        onRemove
          ? () =>
              onRemove({
                productId: item.productId,
                variantId: item.variantId,
                slug: item.slug,
                materialColor: item.materialColor,
                insert: item.insert,
                size: item.size,
                image: item.image,
              })
          : undefined
      }
    />
  );
}
