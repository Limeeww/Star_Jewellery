import React from "react";
import { badgeLabels, ProductTag } from "@/types/product";
import { CollapsibleSection } from "@/app/shop/components/CollapsibleSection";
import type { Category } from "@/types/product";
import type { Collection } from "@/types/collection";

export type SortOption = "recommended" | "priceDesc" | "priceAsc";

interface FilterSidebarProps {
  sortOption: SortOption;
  onSortChange: (opt: SortOption) => void;

  selectedTags: ProductTag[];
  onToggleTag: (tag: ProductTag) => void;

  categories: Category[];
  selectedCats: number[];
  onToggleCat: (id: number) => void;

  materials: string[];
  selectedMaterials: string[];
  onToggleMaterial: (m: string) => void;

  colors: string[];
  selectedColors: string[];
  onToggleColor: (c: string) => void;

  inserts: string[];
  selectedInserts: string[];
  onToggleInsert: (i: string) => void;

  collections: Collection[];
  selectedCollections: number[];
  onToggleCollection: (id: number) => void;
}

const TAGS: Exclude<ProductTag, "default">[] = [
  "must-have",
  "new",
  "exclusive",
  "sale",
];

export default function FilterSidebar({
  sortOption,
  onSortChange,
  selectedTags,
  onToggleTag,
  categories,
  selectedCats,
  onToggleCat,
  materials,
  selectedMaterials,
  onToggleMaterial,
  colors,
  selectedColors,
  onToggleColor,
  inserts,
  selectedInserts,
  onToggleInsert,
  collections,
  selectedCollections,
  onToggleCollection,
}: FilterSidebarProps) {
  return (
    <aside className="w-full space-y-8">
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-3 text-sm">Sort by</h3>
          <label className="block mb-2 text-sm">
            <input
              type="radio"
              name="sort"
              className="mr-2"
              value="recommended"
              checked={sortOption === "recommended"}
              onChange={() => onSortChange("recommended")}
            />
            Recommended
          </label>
          <label className="block mb-2 text-sm">
            <input
              type="radio"
              name="sort"
              className="mr-2"
              value="priceDesc"
              checked={sortOption === "priceDesc"}
              onChange={() => onSortChange("priceDesc")}
            />
            Price High to Low
          </label>
          <label className="block mb-2 text-sm">
            <input
              type="radio"
              name="sort"
              className="mr-2"
              value="priceAsc"
              checked={sortOption === "priceAsc"}
              onChange={() => onSortChange("priceAsc")}
            />
            Price Low to High
          </label>
        </div>

        <hr className="border-gray-200" />

        <div>
          <h3 className="font-semibold mb-3 text-sm">Filter by</h3>
          {TAGS.map((tag) => (
            <label key={tag} className="block mb-2 text-sm">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedTags.includes(tag)}
                onChange={() => onToggleTag(tag)}
              />
              {badgeLabels[tag]}
            </label>
          ))}
        </div>

        <hr className="border-gray-200" />

        <CollapsibleSection title="Category" count={selectedCats.length}>
          {categories.map((cat) => (
            <label key={cat.id} className="block text-sm">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedCats.includes(Number(cat.id))}
                onChange={() => onToggleCat(Number(cat.id))}
              />
              {cat.name}
            </label>
          ))}
        </CollapsibleSection>

        <CollapsibleSection title="Material" count={selectedMaterials.length}>
          {materials.map((m) => (
            <label key={m} className="block text-sm">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedMaterials.includes(m)}
                onChange={() => onToggleMaterial(m)}
              />
              {m}
            </label>
          ))}
        </CollapsibleSection>

        <CollapsibleSection title="Color" count={selectedColors.length}>
          {colors.map((c) => (
            <label key={c} className="block text-sm">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedColors.includes(c)}
                onChange={() => onToggleColor(c)}
              />
              {c}
            </label>
          ))}
        </CollapsibleSection>

        <CollapsibleSection title="Insert" count={selectedInserts.length}>
          {inserts.map((i) => (
            <label key={i} className="block text-sm">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedInserts.includes(i)}
                onChange={() => onToggleInsert(i)}
              />
              {i}
            </label>
          ))}
        </CollapsibleSection>

        <CollapsibleSection
          title="Collections"
          count={selectedCollections.length}
        >
          {collections.map((col) => (
            <label key={col.id} className="block text-sm">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedCollections.includes(Number(col.id))}
                onChange={() => onToggleCollection(Number(col.id))}
              />
              {col.name}
            </label>
          ))}
        </CollapsibleSection>
      </div>
    </aside>
  );
}
