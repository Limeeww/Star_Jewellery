"use client";

import { useState } from "react";
import { Collection } from "@/types/collection";
import InputField from "@/app/components/FormComponents/InputField";
import LinkButtonForm from "@/app/components/FormComponents/LinkButtonForm";
import ActionButton from "@/app/components/FormComponents/ActionButton";
import CollectionImagesForm from "@/app/components/FormComponents/CollectionForm/CollectionImagesForm";
import CollectionProductIdForm from "@/app/components/FormComponents/CollectionForm/CollectionProductIdForm";

export default function CreateCollectionForm({
  onCreate,
}: {
  onCreate: (newCollection: Omit<Collection, "id">) => void;
}) {
  const [formData, setFormData] = useState<Omit<Collection, "id">>({
    name: "",
    description: "",
    images: [],
    isActive: true,
    productIds: [],
  });

  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = <K extends keyof typeof formData>(
    field: K,
    value: (typeof formData)[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImagesChange = (newImages: string[]) =>
    handleChange("images", newImages);

  const handleProductIdsChange = (ids: number[]) =>
    handleChange("productIds", ids);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: string[] = [];

    if (!formData.name.trim()) newErrors.push("Name is required.");
    if (!formData.description.trim())
      newErrors.push("Description is required.");
    if (formData.images.length === 0)
      newErrors.push("At least one image is required.");
    if (formData.productIds.length === 0)
      newErrors.push("At least one product must be selected.");

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await fetch("/api/products/validate-ids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: formData.productIds }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to validate product IDs.");
      }

      if (data.invalidIds?.length > 0) {
        setErrors([`Invalid product IDs: ${data.invalidIds.join(", ")}`]);
        return;
      }

      setErrors([]);
      onCreate(formData);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      setErrors([msg]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 m-5">
      <h1
        className="uppercase text-xl font-bold mb-6 text-center"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
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
        required
      />

      <CollectionImagesForm
        images={formData.images}
        onChange={handleImagesChange}
      />

      <div>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => handleChange("isActive", e.target.checked)}
            className="accent-black"
          />
          <span className="text-sm">Active</span>
        </label>
      </div>

      <CollectionProductIdForm
        productIds={formData.productIds}
        onChange={handleProductIdsChange}
      />

      {errors.length > 0 && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4">
          <ul className="list-disc list-inside text-sm">
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-2">
        <ActionButton
          type="submit"
          text="Create Collection"
          className="bg-black hover:bg-gray-800 text-white font-semibold py-2 px-4 w-full"
        />
        <LinkButtonForm
          label="← Back to Collections"
          href="/Admin/Collections"
          className="bg-gray-600 hover:bg-gray-700"
        />
      </div>
    </form>
  );
}
