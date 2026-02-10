import { useState, useMemo, useCallback, useEffect } from "react";
import { findByVariantAttributes } from "@/utils/product";
import type { Product, ProductVariant } from "@/types/product";

export function useProduct(product: Product, initialVariantId?: number) {
  const defaultVariantId = initialVariantId ?? product.variants[0]?.id ?? 0;
  const [currentVariantId, setCurrentVariantId] =
    useState<number>(defaultVariantId);
  const [selectedSize, setSelectedSize] = useState<string>("");

  useEffect(() => {
    if (initialVariantId != null && initialVariantId !== currentVariantId) {
      setCurrentVariantId(initialVariantId);
      setSelectedSize("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialVariantId]);

  const displayedVariant = useMemo<ProductVariant | undefined>(
    () => product.variants.find((v) => v.id === currentVariantId),
    [product, currentVariantId],
  );

  const sizeOptions = useMemo(
    () =>
      (displayedVariant?.quantitySize ?? []).map((q) => ({
        value: String(q.size),
        label: `Size ${q.size}${
          q.quantity > 0 ? ` (${q.quantity} available)` : ""
        }`,
      })),
    [displayedVariant],
  );

  const insertOptions = useMemo(
    () =>
      Array.from(new Set(product.variants.map((v) => v.insert))).map((i) => ({
        value: i,
        label: i,
      })),
    [product.variants],
  );

  const materialColorOptions = useMemo(
    () =>
      Array.from(
        new Set(product.variants.map((v) => v.materialColor.trim())),
      ).map((c) => ({ value: c, label: c })),
    [product.variants],
  );

  const handleInsertChange = useCallback(
    (insert: string) => {
      const next = findByVariantAttributes(
        product.variants,
        insert,
        displayedVariant?.materialColor ?? "",
      );
      if (next && next.id !== currentVariantId) {
        setCurrentVariantId(next.id);
        setSelectedSize("");
      }
    },
    [product.variants, displayedVariant, currentVariantId],
  );

  const handleColorChange = useCallback(
    (materialColor: string) => {
      const next = findByVariantAttributes(
        product.variants,
        displayedVariant?.insert ?? "",
        materialColor,
      );
      if (next && next.id !== currentVariantId) {
        setCurrentVariantId(next.id);
        setSelectedSize("");
      }
    },
    [product.variants, displayedVariant, currentVariantId],
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
