import { useEffect, useState } from "react";
import { Product, Category } from "@/types/product";
import LinkButtonForm from "@/app/components/FormComponents/LinkButtonForm";
import EditProductVariantsForm from "@/app/components/FormComponents/ProductForm/EditProductVariantsForm";

interface ProductFormProps {
  product: Product;
  onSave: (updatedProduct: Product) => void;
}

export default function EditProductForm({ product, onSave }: ProductFormProps) {
  const [formData, setFormData] = useState<Product>(product);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data.categories);
      } catch (error) {
        console.error("Ошибка при загрузке категорий:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = <T extends keyof Product>(
    field: T,
    value: Product[T]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    console.log("SUBMIT", formData);
    e.preventDefault();
    onSave(formData);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            value={formData.name}
            placeholder={product.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Slug</label>
          <input
            value={formData.slug}
            placeholder={product.slug}
            onChange={(e) => handleChange("slug", e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <input
            value={formData.description}
            placeholder={product.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Additional Info</label>
          <input
            value={formData.additionalDescription}
            placeholder={product.additionalDescription}
            onChange={(e) =>
              handleChange("additionalDescription", e.target.value)
            }
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Category</label>
          {loadingCategories ? (
            <p className="text-sm text-gray-500">Loading categories...</p>
          ) : (
            <select
              value={formData.categoryId}
              onChange={(e) =>
                handleChange("categoryId", Number(e.target.value))
              }
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

        <div>
          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.isHidden}
              onChange={(e) => handleChange("isHidden", e.target.checked)}
              className="h-4 w-4"
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
          <LinkButtonForm
            label="← Back to Products"
            href="/Admin/Products"
            className="bg-gray-600 hover:bg-gray-700"
          />

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            Save
          </button>
        </div>
      </form>
    </>
  );
}
