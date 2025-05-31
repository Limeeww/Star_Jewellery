"use client";

import { useEffect, useState } from "react";
import { Category } from "@/types/product";
import InputField from "@/app/components/FormComponents/InputField";
import LinkButtonForm from "@/app/components/FormComponents/LinkButtonForm";

interface Props {
  category: Category;
  onSave: (updated: Category) => void;
  onDelete?: (id: string) => void;
}

export default function EditCategoryForm({
  category,
  onSave,
  onDelete,
}: Props) {
  const [formData, setFormData] = useState<Category>(category);
  const [errors, setErrors] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [allCats, setAllCats] = useState<Category[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setAllCats(d.categories))
      .catch((e) => console.error("Failed to fetch categories:", e))
      .finally(() => setLoadingCats(false));
  }, []);

  const handleChange = <K extends keyof Category>(
    field: K,
    value: Category[K]
  ) => setFormData((p) => ({ ...p, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const err: string[] = [];
    if (!formData.name.trim()) err.push("Name is required.");
    if (!formData.image.trim()) err.push("Image URL is required.");

    if (err.length) {
      setErrors(err);
      return;
    }

    setErrors([]);
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
        {/* NAME */}
        <InputField
          label="Name"
          value={formData.name}
          onChange={(v) => handleChange("name", v)}
          required
        />

        {/* IMAGE URL */}
        <InputField
          label="Image URL"
          value={formData.image}
          onChange={(v) => handleChange("image", v)}
          required
        />

        {/* PARENT CATEGORY */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Parent Category (optional)
          </label>
          {loadingCats ? (
            <p className="text-sm text-gray-500">Loading…</p>
          ) : (
            <select
              value={formData.parentCategory ?? ""}
              onChange={(e) =>
                handleChange(
                  "parentCategory",
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
              className="w-full border p-2 focus:outline-none focus:ring-1 focus:ring-black rounded-none"
            >
              <option value="">No parent</option>
              {allCats
                .filter((c) => c.id !== formData.id)
                .map((c) => (
                  <option key={c.id} value={Number(c.id)}>
                    {c.name}
                  </option>
                ))}
            </select>
          )}
        </div>

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
            Delete Category
          </button>

          <LinkButtonForm
            label="← Back to Categories"
            href="/Admin/Categories"
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
              Are you sure you want to delete this category?
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
