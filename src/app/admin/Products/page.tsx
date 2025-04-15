"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUserRole } from "@/hooks/useUserRole";
import Navbar from "@/app/components/Navbar/Navbar";
import AccountLayout from "@/app/Account/components/AccountLayout";
import Loading from "@/app/components/Loading/Loading";
import { Product } from "@/app/types/product";

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

  if (loading || role !== "admin" || isLoading) return <Loading />;

  return (
    <>
      <Navbar isScrolled={true} isLoggedIn={isLoggedIn} />
      <AccountLayout pathname={pathname}>
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
                  <span className="font-semibold">Name:</span> {product.name}
                </p>
                <p>
                  <span className="font-semibold">Price:</span> $
                  {product.price.toFixed(2)}
                </p>
                <p>
                  <span className="font-semibold">Slug:</span> {product.slug}
                </p>
                <p>
                  <span className="font-semibold">Category:</span>{" "}
                  {product.categoryId}
                </p>
                <p>
                  <span className="font-semibold">Visibility:</span>{" "}
                  <span
                    className={`font-semibold ${
                      product.isHidden ? "text-red-500" : "text-green-600"
                    }`}
                  >
                    {product.isHidden ? "Hidden" : "Visible"}
                  </span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </AccountLayout>
    </>
  );
}
