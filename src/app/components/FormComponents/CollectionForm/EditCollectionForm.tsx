// src/app/components/FormComponents/CollectionForm/EditCollectionForm.tsx
"use client";

import { useState } from "react";
import { Collection } from "@/types/collection";
import InputField from "@/app/components/FormComponents/InputField";
import CollectionImagesForm from "@/app/components/FormComponents/CollectionForm/CollectionImagesForm";
import CollectionProductIdForm from "@/app/components/FormComponents/CollectionForm/CollectionProductIdForm";
import LinkButtonForm from "@/app/components/FormComponents/LinkButtonForm";

interface Props {
  collection: Collection;
  onSave: (updated: Collection) => void;
  onDelete?: (id: string) => void;
}

export default function EditCollectionForm({
  collection,
  onSave,
  onDelete,
}: Props) {
  /* ───────── state ───────── */
  const [formData, setFormData] = useState<Collection>(collection);
  const [errors, setErrors] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);

  /* ───────── helpers ───────── */
  const handleChange = <K extends keyof Collection>(
    field: K,
    value: Collection[K],
  ) => setFormData((p) => ({ ...p, [field]: value }));

  /* ───────── submit with full validation ───────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    /* 1) basic checks */
    const newErr: string[] = [];
    if (!formData.name.trim()) newErr.push("Name is required.");
    if (!formData.description.trim()) newErr.push("Description is required.");
    if (formData.images.length === 0)
      newErr.push("At least one image is required.");
    if (formData.productIds.length === 0)
      newErr.push("At least one product must be selected.");

    if (newErr.length) {
      setErrors(newErr);
      return;
    }

    /* 2) server-side ID existence check */
    try {
      const res = await fetch("/api/products/validate-ids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: formData.productIds }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to validate IDs.");

      if (data.invalidIds?.length) {
        setErrors([`Invalid product IDs: ${data.invalidIds.join(", ")}`]);
        return;
      }

      /* 3) all good — save */
      setErrors([]);
      onSave(formData);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setErrors([msg]);
    }
  };

  /* ───────── delete helpers ───────── */
  const confirmDelete = () => setShowModal(true);
  const handleConfirmDelete = () => {
    setShowModal(false);
    onDelete?.(formData.id);
  };

  /* ───────── UI ───────── */
  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* NAME */}
        <InputField
          label="Name"
          value={formData.name}
          onChange={(v) => handleChange("name", v)}
          required
        />

        {/* DESCRIPTION */}
        <InputField
          label="Description"
          value={formData.description}
          onChange={(v) => handleChange("description", v)}
          required
        />

        {/* IMAGES */}
        <CollectionImagesForm
          images={formData.images}
          onChange={(imgs) => handleChange("images", imgs)}
        />

        {/* ACTIVE FLAG */}
        <div>
          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => handleChange("isActive", e.target.checked)}
              className="h-4 w-4 accent-black"
            />
            <span className="text-sm">Active</span>
          </label>
        </div>

        {/* PRODUCT IDS */}
        <CollectionProductIdForm
          productIds={formData.productIds}
          onChange={(ids) => handleChange("productIds", ids)}
        />

        {/* ERRORS */}
        {errors.length > 0 && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3">
            <ul className="list-disc list-inside text-sm">
              {errors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        )}

        {/* ACTION BUTTONS */}
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
            Delete Collection
          </button>

          <LinkButtonForm
            label="← Back to Collections"
            href="/Admin/Collections"
            className="bg-gray-600 hover:bg-gray-700"
          />
        </div>
      </form>

      {/* CONFIRM DELETE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white shadow-md p-6 max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-3">Confirm Deletion</h2>
            <p className="text-sm text-gray-700 mb-6">
              Are you sure you want to delete this collection?
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
