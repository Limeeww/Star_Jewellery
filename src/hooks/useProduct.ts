import { useState, useMemo, useCallback } from "react";
import { findByVariantAttributes } from "@/utils/product";
import type { Product, ProductVariant } from "@/types/product";

export function useProduct(product: Product) {
  const [currentVariantId, setCurrentVariantId] = useState<number>(
    product.variants[0]?.id ?? 0
  );
  const [selectedSize, setSelectedSize] = useState<string>("");

  const displayedVariant = useMemo<ProductVariant | undefined>(() => {
    return product.variants.find((v) => v.id === currentVariantId);
  }, [product.variants, currentVariantId]);

  const sizeOptions = useMemo(() => {
    if (!displayedVariant?.quantitySize) return [];
    return displayedVariant.quantitySize.map((q) => ({
      value: String(q.size),
      label: `Size ${q.size}${q.quantity > 0 ? ` (${q.quantity} available)` : ""}`,
    }));
  }, [displayedVariant]);

  const insertOptions = useMemo(() => {
    const setInserts = new Set<string>();
    product.variants.forEach((v) => setInserts.add(v.insert));
    return Array.from(setInserts).map((i) => ({ value: i, label: i }));
  }, [product.variants]);

  const materialColorOptions = useMemo(() => {
    const setColors = new Set<string>();
    product.variants.forEach((v) => setColors.add(v.materialColor.trim()));
    return Array.from(setColors).map((c) => ({ value: c, label: c }));
  }, [product.variants]);

  const handleInsertChange = useCallback(
    (insert: string) => {
      if (!displayedVariant) return;
      const v = findByVariantAttributes(
        product.variants,
        insert,
        displayedVariant.materialColor
      );
      if (v && v.id !== currentVariantId) {
        setCurrentVariantId(v.id);
        setSelectedSize("");
      }
    },
    [product.variants, displayedVariant, currentVariantId]
  );

  const handleColorChange = useCallback(
    (materialColor: string) => {
      if (!displayedVariant) return;
      const v = findByVariantAttributes(
        product.variants,
        displayedVariant.insert,
        materialColor
      );
      if (v && v.id !== currentVariantId) {
        setCurrentVariantId(v.id);
        setSelectedSize("");
      }
    },
    [product.variants, displayedVariant, currentVariantId]
  );

  const handleSizeChange = useCallback((size: string) => {
    setSelectedSize(size);
  }, []);

  return {
    displayedVariant,
    sizeOptions,
    insertOptions,
    materialColorOptions,
    selectedSize,
    handleSizeChange,
    handleInsertChange,
    handleColorChange,
    setCurrentVariantId,
  };
}
