import { Timestamp } from "firebase/firestore";

export interface Discount {
  id: number;
  name: string;
  value: number;
  type: "percentage" | "fixed";
  targetType: "product" | "category" | "collection";
  applicableTo: number[];
  validFrom: Timestamp;
  validUntil: Timestamp;
  priority?: number;
}

export interface Category {
  id: number;
  name: string;
  //TO DO add fields
}

export interface ProductVariant {
  id: number;
  price: number;
  weight: number;
  material: string;
  materialColor: string;
  purity?: string;
  insert: string;
  insertColor: string;
  quantitySize: QuantitySize[];
  images?: string[];
}

export interface QuantitySize {
  size: number;
  quantity: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  slug: string;
  categoryId: number;
  variants: ProductVariant[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isHidden: boolean;
  additionalDescription: string;
}
