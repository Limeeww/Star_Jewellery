import { Discount } from "./product";
import { Address } from "./userTypes";
import { CartItem } from "./cartItem";

export interface GiftOptionsForm {
  giftPackaging: boolean;
  giftMessage: boolean;
  giftReceipt: boolean;
}

export interface PaymentInfo {
  method: "credit_card" | "paypal" | "bank_transfer";
  transactionId: string;
  paid: boolean;
}

export interface Order {
  orderId: number;
  userId: number;
  products: CartItem[];
  total: number;
  orderDate: Date;
  updatedAt: Date;
  giftOptions: GiftOptionsForm;
  paymentInfo: PaymentInfo;
  shippingAddress: Address;
  discountsApplied?: Discount[];
  status: "pending" | "shipped" | "delivered" | "cancelled";
}
