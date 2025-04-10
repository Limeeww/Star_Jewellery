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


export interface ProductVariant {
  id: number;
  // sku: string;
  price: number;
  material: string;
  materialColor: string;
  insert: string;
  insertColor: string;
  weight: number;
  quantity: number;

}

export interface quantitySize {
  size:number;
  quantity:number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  slug: string;
  imageUrl: string;
  categoryId: number;
  variants: ProductVariant[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  price: number;
  isHidden: boolean; 
  additionalDescription: string; 
  quantitySize: quantitySize[];
}
