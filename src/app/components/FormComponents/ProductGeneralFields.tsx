import React, { useEffect, useState } from "react";
import { Product, Category } from "@/app/types/product";

interface ProductGeneralFieldsProps {
  formData: Product;
  onChange: (field: keyof Product, value: string | number | undefined) => void;
}

export default function ProductGeneralFields({
  formData,
  onChange,
}: ProductGeneralFieldsProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data.categories); // предполагается, что categories — массив
      } catch (err) {
        console.error("Ошибка при загрузке категорий:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          value={formData.name}
          onChange={(e) => onChange("name", e.target.value)}
          className="w-full border p-2 rounded"
        />

        <label className="block text-sm font-medium mt-2">Description</label>
        <input
          value={formData.description}
          onChange={(e) => onChange("description", e.target.value)}
          className="w-full border p-2 rounded"
        />

        <label className="block text-sm font-medium mt-2">Slug</label>
        <input
          value={formData.slug}
          onChange={(e) => onChange("slug", e.target.value)}
          className="w-full border p-2 rounded"
        />

        <label className="block text-sm font-medium mt-2">Category</label>
        {loading ? (
          <p className="text-sm text-gray-500">Loading categories...</p>
        ) : (
          <select
            value={formData.categoryId}
            onChange={(e) => onChange("categoryId", Number(e.target.value))}
            className="w-full border p-2 rounded"
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
    </div>
  );
}
