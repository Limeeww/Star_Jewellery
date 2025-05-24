"use client";

import React, { useState, useMemo } from "react";
import Navbar from "@/app/components/Navbar/Navbar";
import Footer from "@/app/components/Footer/Footer";
import FilterSidebar from "./components/FilterSidebar";
import ProductGrid from "./components/ProductGridView";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { useProducts } from "@/hooks/useProducts";
import Image from "next/image";
import Link from "next/link";
import Loading from "../components/Loading/Loading";
import { usePagination } from "@/hooks/usePagination";
import type { Product, ProductTag } from "@/types/product";
import { PaginationControls } from "../components/PaginationControls";
import { useCategories } from "@/hooks/useCatergories";
import { useCollections } from "@/hooks/useCollection";
import { extractUniqueAttributes } from "@/utils/extractUniqueAttributes";

export default function ShopPage() {
  const { isLoggedIn } = useAuthStatus();
  const { products, loading } = useProducts(20);

  const [sortOption, setSortOption] = useState<
    "recommended" | "priceDesc" | "priceAsc"
  >("recommended");
  const [selectedTags, setSelectedTags] = useState<ProductTag[]>([]);
  const [selectedCats, setSelectedCats] = useState<number[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedInserts, setSelectedInserts] = useState<string[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<number[]>([]);

  const categories = useCategories();
  const collections = useCollections();

  const { materials, colors, inserts } = extractUniqueAttributes(products);

  const filtered = useMemo(() => {
    let list = products;

    // by tag
    if (selectedTags.length) {
      list = list.filter((p) => selectedTags.includes(p.tag));
    }
    // by category
    if (selectedCats.length) {
      list = list.filter((p) => selectedCats.includes(p.categoryId));
    }
    // by material
    if (selectedMaterials.length) {
      list = list.filter((p) =>
        p.variants.some((v) => selectedMaterials.includes(v.material))
      );
    }
    // by color
    if (selectedColors.length) {
      list = list.filter((p) =>
        p.variants.some((v) => selectedColors.includes(v.materialColor))
      );
    }
    // by insert
    if (selectedInserts.length) {
      list = list.filter((p) =>
        p.variants.some((v) => selectedInserts.includes(v.insert))
      );
    }
    // by collection membership
    if (selectedCollections.length) {
      list = list.filter((p) =>
        collections
          .filter((c) => selectedCollections.includes(Number(c.id)))
          .some((c) => c.productIds.includes(p.id))
      );
    }

    // sort Price
    if (sortOption === "priceAsc") {
      return [...list].sort(
        (a, b) => a.variants[0].price - b.variants[0].price
      );
    }
    if (sortOption === "priceDesc") {
      return [...list].sort(
        (a, b) => b.variants[0].price - a.variants[0].price
      );
    }
    return list;
  }, [
    products,
    selectedTags,
    selectedCats,
    selectedMaterials,
    selectedColors,
    selectedInserts,
    selectedCollections,
    sortOption,
    collections,
  ]);

  const {
    currentPageItems,
    page,
    totalPages,
    hasPrev,
    hasNext,
    prevPage,
    nextPage,
  } = usePagination<Product>(filtered, 4);

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ fontFamily: "var(--font-poppins)" }}
    >
      <Navbar isScrolled={true} isLoggedIn={isLoggedIn} />

      <main className="flex-1">
        <div className="flex bg-gray-50">
          <div className="relative h-[45vh]  w-1/2 mt-12 h-full">
            <Image
              src="/images/shop-hero.jpg"
              alt="Shop Hero"
              width={800}
              height={600}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="w-1/2 flex items-center justify-center">
            <h1
              className="text-5xl font-bold uppercase text-gray-800"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              All jewelry creations
            </h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6 flex justify-between items-center text-sm text-gray-600">
          <div className="flex items-center space-x-3">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <span>/</span>
            <span>View all collections</span>
          </div>

          <div className="flex items-center space-x-6">
            <div>{filtered.length} models</div>
          </div>
        </div>

        <div className="container mx-auto px-4 pb-16 lg:flex lg:space-x-8">
          <aside className="lg:w-1/4 w-full mb-8 lg:mb-0">
            <FilterSidebar
              sortOption={sortOption}
              onSortChange={setSortOption}
              selectedTags={selectedTags}
              onToggleTag={(tag) =>
                setSelectedTags((prev) =>
                  prev.includes(tag)
                    ? prev.filter((t) => t !== tag)
                    : [...prev, tag]
                )
              }
              categories={categories}
              selectedCats={selectedCats}
              onToggleCat={(id) =>
                setSelectedCats((prev) =>
                  prev.includes(id)
                    ? prev.filter((c) => c !== id)
                    : [...prev, id]
                )
              }
              materials={materials}
              selectedMaterials={selectedMaterials}
              onToggleMaterial={(m) =>
                setSelectedMaterials((prev) =>
                  prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
                )
              }
              colors={colors}
              selectedColors={selectedColors}
              onToggleColor={(c) =>
                setSelectedColors((prev) =>
                  prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
                )
              }
              inserts={inserts}
              selectedInserts={selectedInserts}
              onToggleInsert={(i) =>
                setSelectedInserts((prev) =>
                  prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
                )
              }
              collections={collections}
              selectedCollections={selectedCollections}
              onToggleCollection={(id) =>
                setSelectedCollections((prev) =>
                  prev.includes(id)
                    ? prev.filter((x) => x !== id)
                    : [...prev, id]
                )
              }
            />
          </aside>

          <div className="flex-1">
            {loading ? (
              <div className="py-20 text-center text-gray-500">
                <Loading />
              </div>
            ) : (
              <>
                <ProductGrid products={currentPageItems} />

                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <PaginationControls
                      page={page}
                      totalPages={totalPages}
                      hasPrev={hasPrev}
                      hasNext={hasNext}
                      prevPage={prevPage}
                      nextPage={nextPage}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
