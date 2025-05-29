"use client";

import { useState } from "react";
import { Product, ProductVariant } from "@/types/product";
import {
  MATERIALS,
  MATERIAL_COLORS,
  PURITIES,
  INSERTS,
  INSERT_COLORS,
} from "@/types/productOptions";
import QuantitySizeForm from "@/app/components/FormComponents/ProductForm/QuantitySizeForm";
import VariantImagesForm from "@/app/components/FormComponents/ProductForm/VariantImagesForm";
import LinkButtonForm from "@/app/components/FormComponents/LinkButtonForm";
import { v4 as uuidv4 } from "uuid";
import { uuidToNumber } from "@/hooks/uuidToNumber";
import SelectVariantField from "@/app/components/FormComponents/ProductForm/SelectVariantField";
import { useCategories } from "@/hooks/useCategories";
import InputField from "@/app/components/FormComponents/InputField";
import ActionButton from "@/app/components/FormComponents/ActionButton";

export default function CreateProductForm({
  onCreate,
}: {
  onCreate: (newProduct: Omit<Product, "id">) => void;
}) {
  const { categories, loading: loadingCategories } = useCategories();

  const [formData, setFormData] = useState<Omit<Product, "id">>({
    name: "",
    slug: "",
    description: "",
    additionalDescription: "",
    categoryId: 0,
    isHidden: false,
    variants: [],
  });

  const handleChange = <T extends keyof typeof formData>(
    field: T,
    value: (typeof formData)[T]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleVariantChange = (index: number, updated: ProductVariant) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index] = updated;
    setFormData((prev) => ({ ...prev, variants: updatedVariants }));
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
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, newVariant],
    }));
  };

  const handleRemoveVariant = (index: number) => {
    const updated = formData.variants.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, variants: updated }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedVariants = formData.variants.map((variant) => ({
      ...variant,
      insertColor:
        variant.insert === "none" || !variant.insert
          ? "none"
          : variant.insertColor || "none",
    }));

    onCreate({
      ...formData,
      variants: normalizedVariants,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 m-5"
      style={{ fontFamily: "var(--font-poppins)" }}
    >
      <h1
        className="uppercase text-xl font-bold mb-6 text-center"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Create New Product
      </h1>

      <InputField
        label="Name"
        value={formData.name}
        onChange={(val) => handleChange("name", val)}
        required
      />

      <InputField
        label="Slug"
        value={formData.slug}
        onChange={(val) => handleChange("slug", val)}
        required
      />

      <InputField
        label="Description"
        value={formData.description}
        onChange={(val) => handleChange("description", val)}
        required
      />

      <InputField
        label="Additional Info"
        value={formData.additionalDescription}
        onChange={(val) => handleChange("additionalDescription", val)}
      />

      <div>
        <label className="block text-m font-medium">Category</label>
        {loadingCategories ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : (
          <select
            value={formData.categoryId}
            onChange={(e) => handleChange("categoryId", Number(e.target.value))}
            className="w-full border p-2"
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.isHidden}
            onChange={(e) => handleChange("isHidden", e.target.checked)}
          />
          <span className="text-sm">Hide this product</span>
        </label>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Variants</h3>

        {formData.variants.map((variant, index) => (
          <div key={index} className="border rounded p-4 bg-gray-50 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Price"
                type="number"
                value={variant.price}
                onChange={(val) =>
                  handleVariantChange(index, {
                    ...variant,
                    price: parseFloat(val),
                  })
                }
                required
              />

              <InputField
                label="Weight"
                type="number"
                value={variant.weight}
                onChange={(val) =>
                  handleVariantChange(index, {
                    ...variant,
                    weight: parseFloat(val),
                  })
                }
                required
              />

              <SelectVariantField
                label="Material"
                value={variant.material}
                onChange={(val) =>
                  handleVariantChange(index, {
                    ...variant,
                    material: val,
                    materialColor: "",
                    purity: "",
                  })
                }
                options={MATERIALS}
              />

              <SelectVariantField
                label="Material Color"
                value={variant.materialColor}
                onChange={(val) =>
                  handleVariantChange(index, {
                    ...variant,
                    materialColor: val,
                  })
                }
                options={
                  MATERIAL_COLORS[
                    variant.material as keyof typeof MATERIAL_COLORS
                  ] || []
                }
              />

              <SelectVariantField
                label="Purity"
                value={variant.purity || ""}
                onChange={(val) =>
                  handleVariantChange(index, {
                    ...variant,
                    purity: val,
                  })
                }
                options={
                  PURITIES[variant.material as keyof typeof PURITIES] || []
                }
              />

              <SelectVariantField
                label="Insert"
                value={variant.insert}
                onChange={(val) =>
                  handleVariantChange(index, {
                    ...variant,
                    insert: val,
                    insertColor: "",
                  })
                }
                options={INSERTS}
              />

              <SelectVariantField
                label="Insert Color"
                value={variant.insertColor}
                onChange={(val) =>
                  handleVariantChange(index, {
                    ...variant,
                    insertColor: val,
                  })
                }
                options={
                  INSERT_COLORS[variant.insert as keyof typeof INSERT_COLORS] ||
                  []
                }
                disabled={variant.insert === "none"}
              />
            </div>

            <QuantitySizeForm
              quantitySize={variant.quantitySize}
              onChange={(newSize) =>
                handleVariantChange(index, {
                  ...variant,
                  quantitySize: newSize,
                })
              }
            />

            <VariantImagesForm
              images={variant.images ?? []}
              onChange={(newImages) =>
                handleVariantChange(index, {
                  ...variant,
                  images: newImages,
                })
              }
            />

            <ActionButton
              type="button"
              text="Delete Variant"
              onClick={() => handleRemoveVariant(index)}
              className="text-red-500 text-sm hover:underline"
            />
          </div>
        ))}

        <ActionButton
          type="button"
          text="Add Variant"
          onClick={handleAddVariant}
          className="bg-green-600 text-white px-4 py-2 rounded text-sm"
        />
      </div>

      <div className="space-y-2">
        <LinkButtonForm
          label="← Back to Products"
          href="/Admin/Products"
          className="bg-gray-600 hover:bg-gray-700"
        />

        <ActionButton
          type="submit"
          text="Create Product"
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        />
      </div>
    </form>
  );
}
