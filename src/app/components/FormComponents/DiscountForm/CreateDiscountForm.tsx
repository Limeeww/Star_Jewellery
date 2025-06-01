"use client";

import { useEffect, useState } from "react";
import { Discount, Product, Category } from "@/types/product";
import { Collection } from "@/types/collection";
import InputField from "@/app/components/FormComponents/InputField";
import SelectVariantField from "@/app/components/FormComponents/ProductForm/SelectVariantField";
import ActionButton from "@/app/components/FormComponents/ActionButton";
import LinkButtonForm from "@/app/components/FormComponents/LinkButtonForm";
import { Timestamp } from "firebase/firestore";

const TARGET_TYPES = ["product", "category", "collection"] as const;
const DISCOUNT_TYPES = ["percentage", "fixed"] as const;

type TargetType = (typeof TARGET_TYPES)[number];
type DiscountType = (typeof DISCOUNT_TYPES)[number];

export default function CreateDiscountForm({
  onCreate,
}: {
  onCreate: (discount: Omit<Discount, "id">) => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    value: 0,
    type: "percentage" as DiscountType,
    targetType: "product" as TargetType,
    applicableTo: [] as number[],
    validFrom: Timestamp.fromDate(new Date()),
    validUntil: Timestamp.fromDate(new Date()),
    priority: 1,
  });

  const [applicableRaw, setApplicableRaw] = useState<string>("");
  const [existingProducts, setExistingProducts] = useState<number[]>([]);
  const [existingCategories, setExistingCategories] = useState<number[]>([]);
  const [existingCollections, setExistingCollections] = useState<number[]>([]);
  const [existingDiscounts, setExistingDiscounts] = useState<Discount[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [productsRes, categoriesRes, collectionsRes, discountsRes] =
        await Promise.all([
          fetch("/api/products/products").then((res) => res.json()),
          fetch("/api/categories/categories").then((res) => res.json()),
          fetch("/api/collections/collections").then((res) => res.json()),
          fetch("/api/discounts/discounts").then((res) => res.json()),
        ]);

      setExistingProducts(
        productsRes.products?.map((p: Product) => Number(p.id)) || []
      );
      setExistingCategories(
        categoriesRes.categories?.map((c: Category) => Number(c.id)) || []
      );
      setExistingCollections(
        collectionsRes.collections?.map((col: Collection) => Number(col.id)) ||
          []
      );
      setExistingDiscounts(discountsRes.discounts || []);
    };
    loadData();
  }, []);

  const handleChange = <K extends keyof typeof formData>(
    key: K,
    value: (typeof formData)[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: string[] = [];

    const ids = applicableRaw
      .split(",")
      .map((v) => parseInt(v.trim()))
      .filter((n) => !isNaN(n));

    let invalidIds: number[] = [];
    if (formData.targetType === "product") {
      invalidIds = ids.filter((id) => !existingProducts.includes(id));
    } else if (formData.targetType === "category") {
      invalidIds = ids.filter((id) => !existingCategories.includes(id));
    } else if (formData.targetType === "collection") {
      invalidIds = ids.filter((id) => !existingCollections.includes(id));
    }

    if (!formData.name.trim()) errs.push("Name is required.");
    if (isNaN(formData.value)) errs.push("Value must be a number.");
    if (!applicableRaw.trim()) errs.push("Applicable IDs required.");
    if (invalidIds.length > 0)
      errs.push(`Invalid ID(s): ${invalidIds.join(", ")}`);
    if (formData.priority < 1 || formData.priority > 10) {
      errs.push("Priority must be between 1 and 10.");
    }

    const conflicting = existingDiscounts.find(
      (d) => d.priority === formData.priority
    );

    if (errs.length > 0) {
      setErrors(errs);
      return;
    }

    if (conflicting) {
      await fetch(`/api/discounts/${conflicting.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priority: 0 }),
      });
    }

    setErrors([]);
    onCreate({
      ...formData,
      applicableTo: ids,
      validFrom: formData.validFrom,
      validUntil: formData.validUntil,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 m-5">
      <h1
        className="uppercase text-xl font-bold mb-6 text-center"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Create New Discount
      </h1>

      <InputField
        label="Name"
        value={formData.name}
        onChange={(val) => handleChange("name", val)}
        required
      />
      <InputField
        label="Value"
        type="number"
        value={formData.value.toString()}
        onChange={(val) => handleChange("value", parseFloat(val))}
        required
      />
      <SelectVariantField
        label="Discount Type"
        value={formData.type}
        onChange={(val) => handleChange("type", val as DiscountType)}
        options={[...DISCOUNT_TYPES]}
      />
      <SelectVariantField
        label="Target Type"
        value={formData.targetType}
        onChange={(val) => handleChange("targetType", val as TargetType)}
        options={[...TARGET_TYPES]}
      />
      <InputField
        label="Applicable To (IDs, comma separated)"
        value={applicableRaw}
        onChange={setApplicableRaw}
        required
      />
      <InputField
        label="Valid From"
        type="datetime-local"
        value={formData.validFrom.toDate().toISOString().slice(0, 16)}
        onChange={(val) =>
          handleChange("validFrom", Timestamp.fromDate(new Date(val)))
        }
      />
      <InputField
        label="Valid Until"
        type="datetime-local"
        value={formData.validUntil.toDate().toISOString().slice(0, 16)}
        onChange={(val) =>
          handleChange("validUntil", Timestamp.fromDate(new Date(val)))
        }
      />
      <InputField
        label="Priority"
        type="number"
        min={1}
        max={10}
        value={formData.priority.toString()}
        onChange={(val) => handleChange("priority", parseInt(val))}
        required
      />

      {errors.length > 0 && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3">
          <ul className="list-disc list-inside text-sm">
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-2">
        <ActionButton
          type="submit"
          text="Create Discount"
          className="bg-black hover:bg-gray-800 text-white font-semibold py-2 px-4 w-full"
        />
        <LinkButtonForm
          label="← Back to Discounts"
          href="/Admin/Discounts"
          className="bg-gray-600 hover:bg-gray-700"
        />
      </div>
    </form>
  );
}
