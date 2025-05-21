import { Timestamp } from "firebase/firestore";
import { CartItem } from "./cartItem";
import { Order, PaymentInfo } from "./order";
import { Product } from "./product";

export type Identifier = Omit<WishlistItem, "price" | "product">;

export interface Address {
  title?: "Mr" | "Mrs";
  addressLabel?: string;
  firstName?: string;
  lastName?: string;
  street: string;
  houseNumber?: string;
  additionalInfo?: string;
  city: string;
  state?: string;
  zipCode: string;
  country: string;
  mobile?: string;
  preferredShippingAddress?: boolean;
  preferredBillingAddress?: boolean;
}

export interface WishlistItem {
  product: Product;
  productId: number;
  variantId: number;
  slug: string;
  materialColor: string;
  insert: string;
  size: number;
  price: number;
  image: string;
}
export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  birthDay?: string;
  birthMonth?: string;
  birthYear?: string;
  gender?: string;
  relationshipStatus?: string;
  anniversaryDay?: string;
  anniversaryMonth?: string;
  anniversaryYear?: string;
  marketingConsent?: boolean;
  wishList?: WishlistItem[];
  orders?: Order[];
  addresses?: Address[];
  paymentMethods?: PaymentInfo[];
  bonuses?: string;
  lastBirthdayChange?: Timestamp;
  lastAnniversaryChange?: Timestamp;
  lastRelationshipStatusChange?: Timestamp;
  cartItems?: CartItem[];
  role: "admin" | "user";
}

export type UserItem = {
  uid: string;
  email: string | null;
  role: "admin" | "user" | null;
};
