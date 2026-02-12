"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import LinkButtonForm from "@/app/components/FormComponents/LinkButtonForm";
import EditProductVariantsForm from "@/app/components/FormComponents/ProductForm/EditProductVariantsForm";
import { useCategories } from "@/hooks/useCategories";
import InputField from "@/app/components/FormComponents/InputField";
import SelectVariantField from "./SelectVariantField";
import { ProductTag, TAG_OPTIONS } from "@/types/product";

interface ProductFormProps {
  product: Product;
  onSave: (updatedProduct: Product) => void;
  onDelete?: (productId: number) => void;
}

export default function EditProductForm({
  product,
  onSave,
  onDelete,
}: ProductFormProps) {
  const [formData, setFormData] = useState<Product>(product);
  const { categories, loading: loadingCategories } = useCategories();
  const [showModal, setShowModal] = useState(false);

  const handleChange = <T extends keyof Product>(
    field: T,
    value: Product[T],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const confirmDelete = () => setShowModal(true);
  const handleConfirmDelete = () => {
    setShowModal(false);
    onDelete?.(formData.id);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Name"
          value={formData.name}
          placeholder={product.name}
          onChange={(val: string) => handleChange("name", val)}
          required
        />

        <InputField
          label="Slug"
          value={formData.slug}
          placeholder={product.slug}
          onChange={(val: string) => handleChange("slug", val)}
          required
        />

        <InputField
          label="Description"
          value={formData.description}
          placeholder={product.description}
          onChange={(val: string) => handleChange("description", val)}
          required
        />

        <InputField
          label="Additional Info"
          value={formData.additionalDescription}
          placeholder={product.additionalDescription}
          onChange={(val: string) => handleChange("additionalDescription", val)}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          {loadingCategories ? (
            <p className="text-sm text-gray-500">Loading categories...</p>
          ) : (
            <select
              value={formData.categoryId}
              onChange={(e) =>
                handleChange("categoryId", Number(e.target.value))
              }
              className="w-full border mt-2 p-2 focus:outline-none focus:ring-1 focus:ring-black rounded-none"
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <SelectVariantField
          label="Product Tag"
          value={formData.tag}
          onChange={(val) => handleChange("tag", val as ProductTag)}
          options={[...TAG_OPTIONS]}
        />

        <div>
          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.isHidden}
              onChange={(e) => handleChange("isHidden", e.target.checked)}
              className="h-4 w-4 accent-black"
            />
            <span className="text-sm">Hide this product</span>
          </label>
        </div>

        <EditProductVariantsForm
          variants={formData.variants}
          onChange={(updatedVariants) =>
            handleChange("variants", updatedVariants)
          }
        />

        <div className="flex flex-col space-y-2">
          <button
            type="submit"
            className="bg-black hover:bg-gray-800 text-white font-semibold py-2 px-4"
          >
            Save
          </button>

          <button
            type="button"
            onClick={confirmDelete}
            className="bg-red-900 hover:bg-red-800 text-white font-semibold py-2 px-4"
          >
            Delete Product
          </button>

          <LinkButtonForm
            label="← Back to Products"
            href="/admin/Products"
            className="bg-gray-600 hover:bg-gray-700"
          />
        </div>
      </form>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white shadow-md p-6 max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-3">Confirm Deletion</h2>
            <p className="text-sm text-gray-700 mb-6">
              Are you sure you want to delete this product?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
