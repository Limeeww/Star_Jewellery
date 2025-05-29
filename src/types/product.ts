import { Timestamp } from "firebase/firestore";

export type ProductTag = "must-have" | "new" | "exclusive" | "sale" | "default";

export const badgeLabels: Record<NonNullable<ProductTag>, string> = {
  "must-have": "Must have",
  new: "New",
  exclusive: "Exclusive",
  sale: "Sale",
  default: "",
};

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
  id: string;
  name: string;
  image: string;
  parentCategory: number | null;
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
  size?: number;
  quantity: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  slug: string;
  categoryId: number;
  variants: ProductVariant[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  isHidden: boolean;
  additionalDescription: string;
  tag: ProductTag;
}
