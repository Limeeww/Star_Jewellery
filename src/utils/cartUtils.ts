  import { CartItem } from "@/types/cartItem";
import { GiftOptionsForm } from "@/types/order";

export const FREE_SHIPPING_THRESHOLD = 100;
export const SHIPPING_FLAT_RATE = 50;

export const GIFT_PACKAGING_COST = 50;
export const GIFT_MESSAGE_COST = 0;
export const GIFT_RECEIPT_COST = 0;

export const getTotalCount = (cartItems: CartItem[]): number =>
  cartItems.reduce((acc, item) => acc + item.quantity, 0);

export const getSubtotal = (cartItems: CartItem[]): number =>
  cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

export const getShippingCost = (subtotal: number): number =>
  subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE;

export const getGiftOptionsTotal = (giftOptions: GiftOptionsForm): number => {
  const giftPackagingCost = giftOptions.giftPackaging ? GIFT_PACKAGING_COST : 0;
  const giftMessageCost = giftOptions.giftMessage ? GIFT_MESSAGE_COST : 0;
  const giftReceiptCost = giftOptions.giftReceipt ? GIFT_RECEIPT_COST : 0;

  return giftPackagingCost + giftMessageCost + giftReceiptCost;
};

export function calculateOriginalPriceSum(cartItems: CartItem[]): number {
  return cartItems.reduce((total, item) => {
    return total + (item.originalPrice ?? item.price) * item.quantity;
  }, 0);
}

export const getTotal = (
  subtotal: number,
  shipping: number,
  giftOptionsTotal: number
): number => subtotal + shipping + giftOptionsTotal;
