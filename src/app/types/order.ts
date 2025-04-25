import { Discount } from "./product";
import { Address } from "./userTypes";
import { CartItem } from "./cartItem";

export interface GiftOptionsForm {
  giftPackaging: boolean;
  giftMessage: boolean;
  giftReceipt: boolean;
  giftMessageText?: string;
}

interface BasePaymentInfo {
  method: "credit_card" | "paypal" | "klarna";
  transactionId: string; // transaction ID from payment provider
  paid: boolean;

  billingAddress: Address;
}


export interface CreditCardPaymentInfo extends BasePaymentInfo {
  method: "credit_card";
  // Token maybe implemented later
  cardToken: string;

  // write only last 4 digits of the card number
  cardNumberMasked: string;
  cardHolderName: string;
  cardExpiry: string; // e.g. "12/26"
  cardBrand: string; // e.g. "Visa", "MasterCard"
}

export interface PayPalPaymentInfo extends BasePaymentInfo {
  method: "paypal";
  paypalOrderId: string;
  payerEmail: string;
}

export interface KlarnaPaymentInfo extends BasePaymentInfo {
  method: "klarna";
  klarnaOrderId: string;
}

export type PaymentInfo =
  | CreditCardPaymentInfo
  | PayPalPaymentInfo
  | KlarnaPaymentInfo;

export interface Order {
  orderId: number;
  userId: string;
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
