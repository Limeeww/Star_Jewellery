import { Product } from "@/types/product";

export function extractUniqueAttributes(products: Product[]) {
  const materialSet = new Set<string>();
  const colorSet = new Set<string>();
  const insertSet = new Set<string>();

  for (const product of products) {
    for (const variant of product.variants) {
      materialSet.add(variant.material);
      colorSet.add(variant.materialColor);
      insertSet.add(variant.insert);
    }
  }

  return {
    materials: Array.from(materialSet),
    colors: Array.from(colorSet),
    inserts: Array.from(insertSet),
  };
}
