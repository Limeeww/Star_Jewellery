import { Discount } from "./product";
import { Address } from "./userTypes";
import { CartItem } from "./cartItem";
import { PaymentMethod } from "@stripe/stripe-js";

export interface GiftOptionsForm {
  giftPackaging: boolean;
  giftMessage: boolean;
  giftReceipt: boolean;
  giftMessageText?: string;
}

interface BasePaymentInfo {
  id: string;
  paymentInfo: BasePaymentInfo;
  transactionId: string; // transaction ID from payment provider
  paid: boolean;
  isDefault?: boolean;
  billingAddress: Address;
  createdAt: Date;
}

export interface CreditCardPaymentInfo extends BasePaymentInfo {
  paymentInfo: BasePaymentInfo;
  // Token maybe implemented later
  cardToken: PaymentMethod | string;
  // write only last 4 digits of the card number
  cardNumberMasked: string;
  cardHolderName: string;
  cardExpiry: string; // e.g. "12/26"
  cardBrand: string; // e.g. "Visa", "MasterCard"
}

export interface PayPalPaymentInfo extends BasePaymentInfo {
  paymentInfo: BasePaymentInfo;
  paypalOrderId: string;
  payerEmail: string;
}

export interface KlarnaPaymentInfo extends BasePaymentInfo {
  paymentInfo: BasePaymentInfo;
  klarnaOrderId: string;
}

export type PaymentInfo =
  | CreditCardPaymentInfo
  | PayPalPaymentInfo
  | KlarnaPaymentInfo;

export enum PaymentMethodValue {
  CREDIT_CARD = "credit_card",
  PAYPAL = "paypal",
  KLARNA = "klarna",
}

export enum PaymentStatusValue {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  REFUNDED = "refunded",
}
export const PaymentMethodLabel: Record<PaymentMethodValue, string> = {
  [PaymentMethodValue.CREDIT_CARD]: "Credit Card",
  [PaymentMethodValue.PAYPAL]: "PayPal",
  [PaymentMethodValue.KLARNA]: "Klarna",
};

export const PaymentStatusLabel: Record<PaymentStatusValue, string> = {
  [PaymentStatusValue.PENDING]: "Pending",
  [PaymentStatusValue.COMPLETED]: "Completed",
  [PaymentStatusValue.FAILED]: "Failed",
  [PaymentStatusValue.REFUNDED]: "Refunded",
};
export enum OrderStatusValue {
  PENDING = "pending",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export const OrderStatusLabel: Record<OrderStatusValue, string> = {
  [OrderStatusValue.PENDING]: "Pending",
  [OrderStatusValue.SHIPPED]: "Shipped",
  [OrderStatusValue.DELIVERED]: "Delivered",
  [OrderStatusValue.CANCELLED]: "Cancelled",
};
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
  status: OrderStatusValue;
  usedBonuses: number;
}
