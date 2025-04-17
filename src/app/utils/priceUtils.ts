import { Discount, ProductVariant } from "../types/product";

export const calculateDiscountedPrice = (
  variant: ProductVariant,
  activeDiscount: Discount | null
): number | null => {
  if (!activeDiscount) return null;
  if (activeDiscount.type === "percentage") {
    return variant.price * (1 - activeDiscount.value / 100);
  } else if (activeDiscount.type === "fixed") {
    return variant.price - activeDiscount.value;
  }
  return null;
};

export const formatPrice = (price: number): string => price.toFixed(2);