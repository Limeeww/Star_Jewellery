import { Timestamp } from "firebase/firestore";

export interface Address {
  street: string;
  city: string;
  state?: string;
  zipCode: string;
  country: string;
}

export interface Order {
  orderId: string;
  items: string[];
  totalPrice: number;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  orderDate: string;
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
}
