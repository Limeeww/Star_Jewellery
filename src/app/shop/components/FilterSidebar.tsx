"use client";

import React, { useState } from "react";
import { badgeLabels, ProductTag } from "@/types/product";
import { CollapsibleSection } from "@/app/shop/components/CollapsibleSection";

const TAGS: Exclude<ProductTag, "default">[] = [
  "must-have",
  "new",
  "exclusive",
  "sale",
];

const CATEGORIES = ["Rings", "Bracelets", "Necklaces", "Earrings"];
const MATERIALS = ["Gold", "Silver", "Rose Gold"];
const COLORS = ["Yellow", "White", "Rose"];
const COLLECTIONS = ["Coronation", "Opera", "Pirouette", "Vera", "Pique"];

export default function FilterSidebar() {
  const [selectedTag, setSelectedTag] = useState<ProductTag | null>(null);

  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);

  const toggle = (
    item: string,
    list: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter(
      list.includes(item) ? list.filter((x) => x !== item) : [...list, item]
    );
  };

  return (
    <aside className="w-full space-y-8">
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-3 text-sm">Filter by</h3>
          {TAGS.map((tag) => (
            <label key={tag} className="block mb-2 text-sm">
              <input
                type="radio"
                name="filterTag"
                className="mr-2"
                value={tag}
                checked={selectedTag === tag}
                onChange={() => setSelectedTag(tag)}
              />
              {badgeLabels[tag]}
            </label>
          ))}
        </div>
        <hr className="border-gray-200" />

        <CollapsibleSection title="Category" count={selectedCats.length}>
          {CATEGORIES.map((cat) => (
            <label key={cat} className="block text-sm">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedCats.includes(cat)}
                onChange={() => toggle(cat, selectedCats, setSelectedCats)}
              />
              {cat}
            </label>
          ))}
        </CollapsibleSection>

        <CollapsibleSection title="Material" count={selectedMaterials.length}>
          {MATERIALS.map((m) => (
            <label key={m} className="block text-sm">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedMaterials.includes(m)}
                onChange={() =>
                  toggle(m, selectedMaterials, setSelectedMaterials)
                }
              />
              {m}
            </label>
          ))}
        </CollapsibleSection>

        <CollapsibleSection title="Color" count={selectedColors.length}>
          {COLORS.map((c) => (
            <label key={c} className="block text-sm">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedColors.includes(c)}
                onChange={() => toggle(c, selectedColors, setSelectedColors)}
              />
              {c}
            </label>
          ))}
        </CollapsibleSection>

        <CollapsibleSection
          title="Collections"
          count={selectedCollections.length}
        >
          {COLLECTIONS.map((col) => (
            <label key={col} className="block text-sm">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedCollections.includes(col)}
                onChange={() =>
                  toggle(col, selectedCollections, setSelectedCollections)
                }
              />
              {col}
            </label>
          ))}
        </CollapsibleSection>
      </div>
    </aside>
  );
}
