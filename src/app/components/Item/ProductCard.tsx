import React from "react";
import { useProduct } from "@/hooks/useProduct";
import Item from "@/app/components/Item/Item";
import type { Identifier, WishlistItem } from "@/types/userTypes";

interface ProductCardProps {
  item: WishlistItem;
  userId: string;
  onRemove?: (id: Identifier) => Promise<void>;
}

export function ProductCard({ item, onRemove }: ProductCardProps) {
  const {
    displayedVariant,
    sizeOptions,
    insertOptions,
    materialColorOptions,
    selectedSize,
    handleSizeChange,
    handleInsertChange,
    handleColorChange,
  } = useProduct(item.product, item.variantId);

  return (
    <Item
      product={item.product}
      displayedVariant={displayedVariant}
      mode="wishlist"
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
