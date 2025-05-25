"use client";

import { useState } from "react";
import { Collection } from "@/types/collection";
import InputField from "@/app/components/FormComponents/InputField";
import LinkButtonForm from "@/app/components/FormComponents/LinkButtonForm";
import ActionButton from "@/app/components/FormComponents/ActionButton";
import CollectionImagesForm from "@/app/components/FormComponents/CollectionForm/CollectionImagesForm";

export default function CreateCollectionForm({
  onCreate,
}: {
  onCreate: (newCollection: Omit<Collection, "id" | "createdAt">) => void;
}) {
  const [formData, setFormData] = useState<
    Omit<Collection, "id" | "createdAt">
  >({
    name: "",
    description: "",
    images: [],
    isActive: true,
    productIds: [],
  });

  const handleChange = <K extends keyof typeof formData>(
    field: K,
    value: (typeof formData)[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImagesChange = (newImages: string[]) =>
    handleChange("images", newImages);

  const handleProductIdChange = (idx: number, id: number) => {
    const ids = [...formData.productIds];
    ids[idx] = id;
    setFormData((prev) => ({ ...prev, productIds: ids }));
  };
  const handleAddProductId = () =>
    handleChange("productIds", [...formData.productIds, 0]);
  const handleRemoveProductId = (idx: number) =>
    handleChange(
      "productIds",
      formData.productIds.filter((_, i) => i !== idx)
    );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 m-5">
      <h1 className="uppercase text-xl font-bold mb-6 text-center">
        Create New Collection
      </h1>

      <InputField
        label="Name"
        value={formData.name}
        onChange={(val) => handleChange("name", val)}
        required
      />

      <InputField
        label="Description"
        value={formData.description}
        onChange={(val) => handleChange("description", val)}
      />

      {/* Images */}
      <CollectionImagesForm
        images={formData.images}
        onChange={handleImagesChange}
      />

      {/* Active */}
      <div>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => handleChange("isActive", e.target.checked)}
          />
          <span className="text-sm">Active</span>
        </label>
      </div>

      {/* Product IDs */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Product IDs</h3>
        {formData.productIds.map((id, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <InputField
              label={`Product ID #${idx + 1}`}
              type="number"
              value={id}
              onChange={(val) => handleProductIdChange(idx, Number(val) || 0)}
              placeholder="0"
            />
            <ActionButton
              type="button"
              text="Delete"
              onClick={() => handleRemoveProductId(idx)}
              className="text-red-500 hover:underline text-sm"
            />
          </div>
        ))}
        <ActionButton
          type="button"
          text="Add Product ID"
          onClick={handleAddProductId}
          className="bg-green-600 text-white px-4 py-2 rounded text-sm"
        />
      </div>

      <div className="space-y-2">
        <LinkButtonForm
          label="← Back to Collections"
          href="/Admin/Collections"
          className="bg-gray-600 hover:bg-gray-700"
        />
        <ActionButton
          type="submit"
          text="Create Collection"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        />
      </div>
    </form>
  );
}
