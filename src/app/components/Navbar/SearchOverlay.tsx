"use client";

import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { LuSearch } from "react-icons/lu";

import Link from "next/link";
import { useRouter } from "next/navigation";

import Item from "../Item/Item";
import { Product } from "../../types/product";
import { fetchProducts } from "@/app/utils/product";

type SearchOverlayProps = {
  open: boolean;
  onClose: () => void;
};

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [lastSearches, setLastSearches] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("lastSearches");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });
  const router = useRouter();
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts() {
      const products = await fetchProducts(4);
      setItems(products);
    }
    loadProducts();
  }, []);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const stored = localStorage.getItem("lastSearches");
    if (stored) {
      setLastSearches(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("lastSearches", JSON.stringify(lastSearches));
  }, [lastSearches]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  useEffect(() => {
    const handleEnter = (event: KeyboardEvent) => {
      if (event.key === "Enter" && searchTerm.trim()) {
        handleCategoryClick(searchTerm);
      }
    };
    window.addEventListener("keydown", handleEnter);
    return () => {
      window.removeEventListener("keydown", handleEnter);
    };
  }, [searchTerm]);

  const handleCategoryClick = (category: string) => {
    if (!category.trim()) return;
    if (!lastSearches.includes(category)) {
      setLastSearches((prev) => [category, ...prev]);
    }
    setSearchTerm(category);
    router.push(`/products?search=${category}`);
  };

  const removeSearchTerm = (term: string) => {
    setLastSearches((prev) => prev.filter((t) => t !== term));
  };

  const itemsToDisplay = searchTerm ? filteredItems : items;

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col text-gray-800">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <button
          onClick={() => handleCategoryClick(searchTerm)}
          className="text-gray-800 mr-2 p-2 focus:outline-none"
        >
          <LuSearch size={20} />
        </button>
        <input
          type="text"
          placeholder="Search..."
          className="mx-4 text-lg text-gray-800 outline-none col-span-1 flex-grow"
          style={{ fontFamily: "var(--font-poppins)" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={onClose} className="p-2">
          <FiX size={22} />
        </button>
      </div>

      <div className="px-4">
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="text-gray-500 hover:underline mt-2 block"
          >
            reset search
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row p-4 flex-grow overflow-auto">
        <div
          className="order-2 md:order-1 w-full md:w-1/4 md:pr-4 mt-2 md:mt-0"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          <h2 className="text-lg font-semibold mb-2">Recommendations</h2>
          <ul className="space-y-1 text-gray-700">
            <li>
              <button
                onClick={() => handleCategoryClick("earrings")}
                className="hover:underline"
              >
                earrings
              </button>
            </li>
            <li>
              <button
                onClick={() => handleCategoryClick("rings")}
                className="hover:underline"
              >
                rings
              </button>
            </li>
            <li>
              <button
                onClick={() => handleCategoryClick("bracelets")}
                className="hover:underline"
              >
                bracelets
              </button>
            </li>
            <li>
              <button
                onClick={() => handleCategoryClick("necklaces")}
                className="hover:underline"
              >
                necklaces
              </button>
            </li>
          </ul>
          {lastSearches.length > 0 && (
            <div className="border-t border-gray-200 mt-4 pt-4">
              <h2 className="text-lg font-semibold mb-2">Last Searches</h2>
              <ul className="space-y-1 text-gray-700">
                {lastSearches.map((term) => (
                  <li key={term} className="flex items-center">
                    <button
                      onClick={() => handleCategoryClick(term)}
                      className="hover:underline mr-2"
                    >
                      {term}
                    </button>
                    <button
                      onClick={() => removeSearchTerm(term)}
                      className="text-sm text-gray-600 hover:underline"
                    >
                      <FiX size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div
          className="order-1 md:order-2 w-full md:w-3/4"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          <h2 className="text-lg font-semibold mb-2">
            {searchTerm ? `Top Results for "${searchTerm}"` : "Bestsellers"}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {itemsToDisplay.map((item) => (
              <Item key={item.id} product={item} />
            ))}
          </div>

          {filteredItems.length > 0 && searchTerm.length > 0 && (
            <div className="flex justify-center mt-4">
              <Link
                href="/all-products"
                className="px-4 py-2 mb-2 bg-black text-white text-sm hover:bg-gray-800 transition-colors"
              >
                View All
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
