import { Discount, Product } from "../types/product";

export const calculateDiscountedPrice = (
  product: Product,
  activeDiscount: Discount | null
): number | null => {
  if (!activeDiscount) return null;
  if (activeDiscount.type === "percentage") {
    return product.price * (1 - activeDiscount.value / 100);
  } else if (activeDiscount.type === "fixed") {
    return product.price - activeDiscount.value;
  }
  return null;
};

export const formatPrice = (price: number): string => price.toFixed(2);
