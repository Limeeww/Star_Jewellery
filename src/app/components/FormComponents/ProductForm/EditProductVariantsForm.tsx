"use client";

import { ProductVariant } from "@/types/product";
import QuantitySizeForm from "./QuantitySizeForm";
import VariantImagesForm from "./VariantImagesForm";

import {
  MATERIALS,
  INSERTS,
  MATERIAL_COLORS,
  INSERT_COLORS,
  PURITIES,
  Material,
  Insert,
} from "@/types/productOprtions";

interface Props {
  variants: ProductVariant[];
  onChange: (variants: ProductVariant[]) => void;
}

export default function EditProductVariantsForm({ variants, onChange }: Props) {
  const handleVariantChange = (
    index: number,
    field: keyof ProductVariant,
    value: string | number
  ) => {
    const updatedVariants = [...variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: value,
    };
    onChange(updatedVariants);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Product Variants</h3>

      {variants.map((variant, index) => (
        <div
          key={variant.id}
          className="border p-4 rounded space-y-2 bg-gray-50"
        >
          <h4 className="font-medium text-gray-700">Variant #{variant.id}</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Price (€)</label>
              <input
                type="number"
                min={1}
                value={variant.price}
                onChange={(e) =>
                  handleVariantChange(
                    index,
                    "price",
                    parseFloat(e.target.value)
                  )
                }
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Weight (g)</label>
              <input
                type="number"
                min={0.1}
                step={0.1}
                value={variant.weight}
                onChange={(e) =>
                  handleVariantChange(
                    index,
                    "weight",
                    parseFloat(e.target.value)
                  )
                }
                className="w-full border p-2 rounded"
              />
            </div>

            {/* Material */}
            <div>
              <label className="block text-sm font-medium">Material</label>
              <select
                value={variant.material}
                onChange={(e) =>
                  handleVariantChange(index, "material", e.target.value)
                }
                className="w-full border p-2 rounded"
              >
                <option value="">Select material</option>
                {MATERIALS.map((mat) => (
                  <option key={mat} value={mat}>
                    {mat}
                  </option>
                ))}
              </select>
            </div>

            {/* Material Color */}
            <div>
              <label className="block text-sm font-medium">
                Material Color
              </label>
              <select
                value={variant.materialColor}
                onChange={(e) =>
                  handleVariantChange(index, "materialColor", e.target.value)
                }
                className="w-full border p-2 rounded"
              >
                <option value="">Select color</option>
                {MATERIAL_COLORS[variant.material as Material]?.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>

            {/* Purity */}
            <div>
              <label className="block text-sm font-medium">Purity</label>
              <select
                value={variant.purity ?? ""}
                onChange={(e) =>
                  handleVariantChange(index, "purity", e.target.value)
                }
                className="w-full border p-2 rounded"
              >
                <option value="">Select purity</option>
                {PURITIES[variant.material as Material]?.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Insert */}
            <div>
              <label className="block text-sm font-medium">Insert</label>
              <select
                value={variant.insert}
                onChange={(e) =>
                  handleVariantChange(index, "insert", e.target.value)
                }
                className="w-full border p-2 rounded"
              >
                <option value="">Select insert</option>
                {INSERTS.map((ins) => (
                  <option key={ins} value={ins}>
                    {ins}
                  </option>
                ))}
              </select>
            </div>

            {/* Insert Color */}
            <div>
              <label className="block text-sm font-medium">Insert Color</label>
              <select
                value={variant.insertColor}
                onChange={(e) =>
                  handleVariantChange(index, "insertColor", e.target.value)
                }
                className="w-full border p-2 rounded"
                disabled={variant.insert === "none"}
              >
                <option value="">Select color</option>
                {INSERT_COLORS[variant.insert as Insert]?.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <QuantitySizeForm
            quantitySize={variant.quantitySize}
            onChange={(newQuantitySize) => {
              const updatedVariants = [...variants];
              updatedVariants[index] = {
                ...updatedVariants[index],
                quantitySize: newQuantitySize,
              };
              onChange(updatedVariants);
            }}
          />
          <VariantImagesForm
            images={variant.images ?? []}
            onChange={(newImages) => {
              const updated = [...variants];
              updated[index] = { ...updated[index], images: newImages };
              onChange(updated);
            }}
          />
        </div>
      ))}
    </div>
  );
}
