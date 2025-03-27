export interface Discount {
  id: number;
  name: string;
  value: number;
  type: "percentage" | "fixed";
  applicableTo: number[]; // Array of Product IDs or Category IDs
  validFrom: Date;
  validUntil: Date;
}

export interface ProductVariant {
  id: number;
  // sku: string;
  price: number;
  materialColor: string;
  insert: string;
  insertColor: string;
  weight: number;
  quantity: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  slug: string;
  imageUrl: string;
  categoryId: number;
  variants: ProductVariant[];
  discounts?: Discount[]; // Optional array of applicable discounts
  createdAt: Date;
  updatedAt: Date;
  price: number;
}
