import React, { useState } from "react";
import { badgeLabels, Product, ProductTag } from "@/types/product";
import { CollapsibleSection } from "@/app/shop/components/CollapsibleSection";
import { useCategories } from "@/hooks/useCatergories";
import { extractUniqueAttributes } from "@/utils/extractUniqueAttributes";
import { useCollections } from "@/hooks/useCollection";

const TAGS: Exclude<ProductTag, "default">[] = [
  "must-have",
  "new",
  "exclusive",
  "sale",
];

interface FilterSidebarProps {
  products: Product[];
}

export default function FilterSidebar({ products }: FilterSidebarProps) {
  const [sortOption, setSortOption] = useState<
    "recommended" | "priceDesc" | "priceAsc"
  >("recommended");

  const collections = useCollections();
  const categories = useCategories();
  
  const { materials, colors, inserts } = extractUniqueAttributes(products);
  const [selectedTags, setSelectedTags] = useState<ProductTag[]>([]);
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);

  function toggleItem<T>(
    item: T,
    list: T[],
    setter: React.Dispatch<React.SetStateAction<T[]>>
  ) {
    setter((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  }

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
              onChange={() => setSortOption("recommended")}
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
              onChange={() => setSortOption("priceDesc")}
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
              onChange={() => setSortOption("priceAsc")}
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
                value={tag}
                checked={selectedTags.includes(tag)}
                onChange={() =>
                  toggleItem<ProductTag>(tag, selectedTags, setSelectedTags)
                }
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
                checked={selectedCats.includes(cat.id)}
                onChange={() =>
                  toggleItem<string>(cat.id, selectedCats, setSelectedCats)
                }
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
                onChange={() =>
                  toggleItem<string>(m, selectedMaterials, setSelectedMaterials)
                }
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
                onChange={() =>
                  toggleItem<string>(c, selectedColors, setSelectedColors)
                }
              />
              {c}
            </label>
          ))}
        </CollapsibleSection>

        <CollapsibleSection title="Insert" count={selectedColors.length}>
          {inserts.map((c) => (
            <label key={c} className="block text-sm">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedColors.includes(c)}
                onChange={() =>
                  toggleItem<string>(c, selectedColors, setSelectedColors)
                }
              />
              {c}
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
                checked={selectedCollections.includes(col.id)}
                onChange={() =>
                  toggleItem<string>(
                    col.id,
                    selectedCollections,
                    setSelectedCollections
                  )
                }
              />
              {col.name}
            </label>
          ))}
        </CollapsibleSection>
      </div>
    </aside>
  );
}
