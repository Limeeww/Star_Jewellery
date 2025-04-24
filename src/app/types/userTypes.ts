import { Timestamp } from "firebase/firestore";
import { CartItem } from "./cartItem";
import { Order } from "./order";

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
  wishList?: string[];
  orders?: Order[];
  addresses?: Address[];
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
