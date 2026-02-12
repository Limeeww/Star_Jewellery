// src/app/components/FormComponents/CategoryForm/CreateCategoryForm.tsx
"use client";

import { useEffect, useState } from "react";
import { Category } from "@/types/product";
import InputField from "@/app/components/FormComponents/InputField";
import ActionButton from "@/app/components/FormComponents/ActionButton";
import LinkButtonForm from "@/app/components/FormComponents/LinkButtonForm";

interface Props {
  onCreate: (newCategory: Omit<Category, "id">) => void;
}

export default function CreateCategoryForm({ onCreate }: Props) {
  const [formData, setFormData] = useState<Omit<Category, "id">>({
    name: "",
    parentCategory: null,
  });

  const [errors, setErrors] = useState<string[]>([]);

  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);

  useEffect(() => {
    fetch("/api/categories/categories")
      .then((r) => r.json())
      .then((d) => setAllCategories(d.categories))
      .catch((e) => console.error("Failed to fetch categories:", e))
      .finally(() => setLoadingCats(false));
  }, []);

  const handleChange = <K extends keyof typeof formData>(
    field: K,
    value: (typeof formData)[K],
  ) => setFormData((p) => ({ ...p, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errs: string[] = [];
    if (!formData.name.trim()) errs.push("Name is required.");

    if (errs.length) {
      setErrors(errs);
      return;
    }

    setErrors([]);
    onCreate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 m-5">
      <h1
        className="uppercase text-xl font-bold mb-6 text-center"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Create New Category
      </h1>

      {/* Name */}
      <InputField
        label="Name"
        value={formData.name}
        onChange={(v) => handleChange("name", v)}
        required
      />

      {/* Parent category (optional) */}
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
                e.target.value === "" ? null : Number(e.target.value),
              )
            }
            className="w-full border p-2 focus:outline-none focus:ring-1 focus:ring-black rounded-none"
          >
            <option value="">No parent</option>
            {allCategories.map((c) => (
              <option key={c.id} value={Number(c.id)}>
                {c.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3">
          <ul className="list-disc list-inside text-sm">
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-2">
        <ActionButton
          type="submit"
          text="Create Category"
          className="bg-black hover:bg-gray-800 text-white font-semibold py-2 px-4 w-full"
        />
        <LinkButtonForm
          label="← Back to Categories"
          href="/Admin/Categories"
          className="bg-gray-600 hover:bg-gray-700"
        />
      </div>
    </form>
  );
}
