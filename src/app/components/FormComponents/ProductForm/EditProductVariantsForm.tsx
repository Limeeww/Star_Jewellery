"use client";

import { useState } from "react";
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
import SelectVariantField from "@/app/components/FormComponents/ProductForm/SelectVariantField";
import { v4 as uuidv4 } from "uuid";
import { uuidToNumber } from "@/hooks/uuidToNumber";

interface Props {
  variants: ProductVariant[];
  onChange: (variants: ProductVariant[]) => void;
}

export default function EditProductVariantsForm({ variants, onChange }: Props) {
  const [variantToDelete, setVariantToDelete] = useState<number | null>(null);

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

  const handleConfirmDelete = () => {
    if (variantToDelete === null) return;
    const updated = variants.filter((_, i) => i !== variantToDelete);
    onChange(updated);
    setVariantToDelete(null);
  };

  const handleAddVariant = () => {
    const newVariant: ProductVariant = {
      id: uuidToNumber(uuidv4()),
      price: 0,
      weight: 0,
      material: "",
      materialColor: "",
      purity: "",
      insert: "",
      insertColor: "",
      quantitySize: [],
      images: [],
    };
    onChange([...variants, newVariant]);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Product Variants</h3>

      {variants.map((variant, index) => (
        <div
          key={variant.id}
          className="border p-4 rounded space-y-4 bg-gray-50"
        >
          <h4 className="font-medium text-gray-700">Variant #{variant.id}</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Price (₴)</label>
              <input
                type="number"
                min={0}
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
                min={0}
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

            <SelectVariantField
              label="Material"
              value={variant.material}
              onChange={(val) => handleVariantChange(index, "material", val)}
              options={MATERIALS}
            />
            <SelectVariantField
              label="Material Color"
              value={variant.materialColor}
              onChange={(val) =>
                handleVariantChange(index, "materialColor", val)
              }
              options={MATERIAL_COLORS[variant.material as Material] || []}
            />
            <SelectVariantField
              label="Purity"
              value={variant.purity || ""}
              onChange={(val) => handleVariantChange(index, "purity", val)}
              options={PURITIES[variant.material as Material] || []}
            />
            <SelectVariantField
              label="Insert"
              value={variant.insert}
              onChange={(val) => handleVariantChange(index, "insert", val)}
              options={INSERTS}
            />
            <SelectVariantField
              label="Insert Color"
              value={variant.insertColor}
              onChange={(val) => handleVariantChange(index, "insertColor", val)}
              options={INSERT_COLORS[variant.insert as Insert] || []}
              disabled={variant.insert === "none"}
            />
          </div>

          <QuantitySizeForm
            quantitySize={variant.quantitySize}
            onChange={(newQuantitySize) => {
              const updated = [...variants];
              updated[index] = {
                ...updated[index],
                quantitySize: newQuantitySize,
              };
              onChange(updated);
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

          <button
            type="button"
            onClick={() => setVariantToDelete(index)}
            className="text-red-500 hover:underline text-sm"
          >
            Delete Variant
          </button>
        </div>
      ))}

      <div>
        <button
          type="button"
          onClick={handleAddVariant}
          className="bg-green-600 text-white px-4 py-2 rounded text-sm"
        >
          Add Variant
        </button>
      </div>

      {variantToDelete !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-md p-6 max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-3">Delete Variant</h2>
            <p className="text-sm text-gray-700 mb-6">
              Are you sure you want to delete this variant?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setVariantToDelete(null)}
                className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
