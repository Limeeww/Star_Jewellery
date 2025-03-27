// utilities/cartUtils.ts
import { CartItem } from "../types/cartItem";
import { GiftOptionsForm } from "../types/order";

export const getTotalCount = (cartItems: CartItem[]): number =>
  cartItems.reduce((acc, item) => acc + item.quantity, 0);

export const getSubtotal = (cartItems: CartItem[]): number =>
  cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

export const getShippingCost = (subtotal: number): number =>
  subtotal > 100 ? 0 : 10;

export const getGiftOptionsTotal = (giftOptions: GiftOptionsForm): number => {

  const giftPackagingCost = giftOptions.giftPackaging ? 3.5 : 0;
  const giftMessageCost = giftOptions.giftMessage ? 0 : 0;
  const giftReceiptCost = giftOptions.giftReceipt ? 0 : 0;

  const giftOptionsTotal = giftPackagingCost + giftMessageCost + giftReceiptCost;
  
  return giftOptionsTotal;
};

export const getTotal = (subtotal: number, shipping: number, giftOptionsTotal: number): number =>
  subtotal + shipping + giftOptionsTotal;
