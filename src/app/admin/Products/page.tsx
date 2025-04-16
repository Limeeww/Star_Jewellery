"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUserRole } from "@/hooks/useUserRole";
import Navbar from "@/app/components/Navbar/Navbar";
import AccountLayout from "@/app/Account/components/AccountLayout";
import Loading from "@/app/components/Loading/Loading";
import { Product } from "@/app/types/product";
import Image from "next/image";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import LinkButton from "@/app/Account/components/LinkButton";

export default function AdminProductsPage() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, loading } = useUserRole();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isLoggedIn = !loading && !!user;

  useEffect(() => {
    if (!loading && (!user || role !== "admin")) {
      router.push("/");
    } else if (!loading && role === "admin") {
      fetchProducts();
    }
  }, [loading, role, user, router]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (timestamp: { toDate?: () => Date; _seconds?: number } | null | undefinedd) => {
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
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((product) => (
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
                  <div className="pt-2">
                    <p className="font-semibold underline">Variants:</p>
                    <ul className="pl-4 list-disc">
                      {product.variants.map((variant, i) => (
                        <li key={i}>
                          <span className="block">
                            Material: {variant.material}
                          </span>
                          <span className="block">
                            Color: {variant.materialColor}
                          </span>
                          <span className="block">
                            Insert: {variant.insert}
                          </span>
                          <span className="block">
                            Insert Color: {variant.insertColor}
                          </span>
                          <span className="block">
                            Weight: {variant.weight}
                          </span>
                          <span className="block">Price: ${variant.price}</span>
                          {variant.quantitySize.length > 0 && (
                            <div className="pt-2">
                              <p className="font-semibold underline">
                                Quantity by Size:
                              </p>
                              <ul className="pl-4 list-disc">
                                {variant.quantitySize.map((item, i) => (
                                  <li key={i}>
                                    Size {item.size}: {item.quantity} pcs
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {variant.images && variant.images.length > 0 && (
                            <Carousel
                              showThumbs={false}
                              showStatus={false}
                              infiniteLoop
                              className="mt-2"
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
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <LinkButton
                text="Edit"
                className="w-full bg-black text-white text-md font-medium px-4 py-2 hover:bg-gray-800 transition-colors"
                showArrow={false}
                onClick={() =>
                  router.push(`/Admin/Products/Edit/${product.id}`)
                }
              />
            </li>
          ))}
        </ul>
      </AccountLayout>
    </>
  );
}
