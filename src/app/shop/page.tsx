"use client";

import React from "react";
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
import { Product } from "@/types/product";
import { PaginationControls } from "../components/PaginationControls";

export default function ShopPage() {
  const { isLoggedIn } = useAuthStatus();
  const { products, loading } = useProducts(20);

  const {
    currentPageItems,
    page,
    totalPages,
    hasPrev,
    hasNext,
    prevPage,
    nextPage,
  } = usePagination<Product>(products, 4);

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ fontFamily: "var(--font-poppins)" }}
    >
      <Navbar isScrolled={true} isLoggedIn={isLoggedIn} />

      <main className="flex-1">
        <div className="flex h-[60vh] bg-gray-50">
          <div className="relative w-1/2 mt-12 h-full">
            <Image
              src="/images/shop-hero.jpg"
              alt="Shop Hero"
              width={1000}
              height={800}
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
            <div>{products.length} models</div>
          </div>
        </div>

        <div className="container mx-auto px-4 pb-16 lg:flex lg:space-x-8">
          <aside className="lg:w-1/4 w-full mb-8 lg:mb-0">
            <FilterSidebar />
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
