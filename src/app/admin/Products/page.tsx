"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUserRole } from "@/hooks/useUserRole";
import Navbar from "@/app/components/Navbar/Navbar";
import AccountLayout from "@/app/Account/components/AccountLayout";
import Loading from "@/app/components/Loading/Loading";
import { Product } from "@/types/product";
import Image from "next/image";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import LinkButton from "@/app/Account/components/LinkButton";
import Footer from "@/app/components/Footer/Footer";
import InputField from "@/app/components/FormComponents/InputField";
import { PaginationControls } from "@/app/components/PaginationControls";
import { usePagination } from "@/hooks/usePagination";

export default function AdminProductsPage() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, loading } = useUserRole();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isLoggedIn = !loading && !!user;
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!loading && (!user || role !== "admin")) {
      router.push("/");
    } else if (!loading && role === "admin") {
      fetchProducts();
    }
  }, [loading, role, user, router]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products/products");
      const data = await res.json();
      setProducts(data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;
    const term = searchTerm.toLowerCase();
    return products.filter((d) => d.name.toLowerCase().includes(term));
  }, [products, searchTerm]);

  const {
    currentPageItems,
    page,
    totalPages,
    hasPrev,
    hasNext,
    prevPage,
    nextPage,
  } = usePagination<Product>(filteredProducts, 2); // 8 orders per page

  const formatTimestamp = (
    timestamp: { toDate?: () => Date; _seconds?: number } | null | undefined,
  ) => {
    if (!timestamp) return "N/A";

    if (typeof timestamp.toDate === "function") {
      return timestamp.toDate().toLocaleString();
    }

    if (typeof timestamp._seconds === "number") {
      return new Date(timestamp._seconds * 1000).toLocaleString();
    }

    return "N/A";
  };
  if (loading || role !== "admin" || isLoading) return <Loading />;

  return (
    <>
      <Navbar isScrolled={true} isLoggedIn={isLoggedIn} />
      <AccountLayout pathname={pathname || ""} sideLinks={[]}>
        <h3
          className="uppercase text-xl font-bold mb-6 text-center"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          MANAGING PRODUCTS
        </h3>
        <LinkButton
          text="Add Product"
          className="w-full bg-black text-white text-md font-medium px-4 py-2 hover:bg-gray-800 transition-colors my-2"
          showArrow={false}
          onClick={() => router.push(`/admin/Products/Add`)}
        />
        {/* search by name */}
        <InputField
          label="Search by Name"
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Start typing…"
        />

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {currentPageItems.map((product) => (
            <li
              key={product.id}
              className="flex flex-col justify-between border p-4 sm:p-5 rounded-xl bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="mb-4 space-y-2 text-sm text-gray-800">
                <p>
                  <strong>Name:</strong> {product.name}
                </p>
                <p>
                  <strong>Slug:</strong> {product.slug}
                </p>
                <p>
                  <strong>Description:</strong> {product.description}
                </p>
                <p>
                  <strong>Additional Info:</strong>{" "}
                  {product.additionalDescription}
                </p>
                <p>
                  <strong>Category ID:</strong> {product.categoryId}
                </p>
                <p>
                  <strong>Tag:</strong> {product.tag || "none"}
                </p>
                <p>
                  <strong>Created At:</strong>{" "}
                  {formatTimestamp(product.createdAt)}
                </p>
                <p>
                  <strong>Updated At:</strong>{" "}
                  {formatTimestamp(product.updatedAt)}
                </p>
                <p>
                  <strong>Visibility:</strong>{" "}
                  <span
                    className={
                      product.isHidden ? "text-red-600" : "text-green-600"
                    }
                  >
                    {product.isHidden ? "Hidden" : "Visible"}
                  </span>
                </p>

                {product.variants.length > 0 && (
                  <div className="grid grid-cols-1 gap-6 pt-2">
                    {product.variants.map((variant, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-gray-200 p-4 shadow-sm bg-gray-50"
                      >
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                          <span>
                            <strong>Material:</strong> {variant.material}
                          </span>
                          <span>
                            <strong>Color:</strong> {variant.materialColor}
                          </span>
                          <span>
                            <strong>Insert:</strong> {variant.insert}
                          </span>
                          <span>
                            <strong>Insert Color:</strong> {variant.insertColor}
                          </span>
                          <span>
                            <strong>Weight:</strong> {variant.weight} g
                          </span>
                          <span>
                            <strong>Price:</strong> {variant.price}₴
                          </span>
                        </div>

                        {variant.quantitySize?.length > 0 && (
                          <div className="mt-4">
                            <p className="font-medium text-sm text-gray-800 mb-1">
                              Quantity by Size:
                            </p>
                            <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                              {variant.quantitySize.map((item, i) => (
                                <div
                                  key={i}
                                  className="px-2 py-1 border border-gray-300 rounded-md bg-white"
                                >
                                  Size {item.size}: {item.quantity} pcs
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {variant.images && variant.images.length > 0 && (
                          <div className="mt-4">
                            <Carousel
                              showThumbs={false}
                              showStatus={false}
                              infiniteLoop
                              className="mt-2"
                              renderArrowPrev={(
                                onClickHandler,
                                hasPrev,
                                label,
                              ) =>
                                hasPrev && (
                                  <button
                                    type="button"
                                    onClick={onClickHandler}
                                    title={label}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow hover:bg-white hidden md:block"
                                  >
                                    <svg
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                    >
                                      <path
                                        d="M15 18l-6-6 6-6"
                                        stroke="black"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  </button>
                                )
                              }
                              renderArrowNext={(
                                onClickHandler,
                                hasNext,
                                label,
                              ) =>
                                hasNext && (
                                  <button
                                    type="button"
                                    onClick={onClickHandler}
                                    title={label}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow hover:bg-white hidden md:block"
                                  >
                                    <svg
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                    >
                                      <path
                                        d="M9 6l6 6-6 6"
                                        stroke="black"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  </button>
                                )
                              }
                            >
                              {variant.images.map((photo, idx) => (
                                <div key={idx} className="w-full h-64 relative">
                                  <Image
                                    src={photo}
                                    alt={`Variant Image ${idx + 1}`}
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                              ))}
                            </Carousel>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <LinkButton
                text="Edit"
                className="w-full bg-black text-white text-md font-medium px-4 py-2 hover:bg-gray-800 transition-colors"
                showArrow={false}
                onClick={() =>
                  router.push(`/admin/Products/Edit/${product.id}`)
                }
              />
            </li>
          ))}
        </ul>
        {/* Pagination controls */}
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
      </AccountLayout>
      <Footer />
    </>
  );
}
