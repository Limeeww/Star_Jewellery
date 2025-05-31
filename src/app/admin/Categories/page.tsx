"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUserRole } from "@/hooks/useUserRole";

import Navbar from "@/app/components/Navbar/Navbar";
import AccountLayout from "@/app/Account/components/AccountLayout";
import Loading from "@/app/components/Loading/Loading";
import Footer from "@/app/components/Footer/Footer";
import LinkButton from "@/app/Account/components/LinkButton";
import Image from "next/image";

import { Category } from "@/types/product";

export default function AdminCategoriesPage() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, loading: authLoading } = useUserRole();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const isLoggedIn = !authLoading && !!user;

  useEffect(() => {
    if (!authLoading && (!user || role !== "admin")) {
      router.push("/");
    } else if (!authLoading && role === "admin") {
      fetchCategories();
    }
  }, [authLoading, role, user, router]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories/categories");
      const data = await res.json();
      setCategories(data.categories);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || role !== "admin" || loading) return <Loading />;

  return (
    <>
      <Navbar isScrolled={true} isLoggedIn={isLoggedIn} />

      <AccountLayout pathname={pathname ?? ""} sideLinks={[]}>
        <h3
          className="uppercase text-xl font-bold mb-6 text-center"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          MANAGING CATEGORIES
        </h3>

        {/* ADD CATEGORY */}
        <LinkButton
          text="Add Category"
          className="w-full bg-black text-white px-4 py-2 font-medium hover:bg-gray-800 transition-colors my-2"
          showArrow={false}
          onClick={() => router.push("/Admin/Categories/Add")}
        />

        {/* LIST */}
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <li
              key={cat.id}
              className="flex flex-col justify-between border p-4 sm:p-5 rounded-xl bg-white shadow-sm transition hover:shadow-md"
            >
              {/* INFO */}
              <div className="space-y-2 text-sm text-gray-800 mb-4">
                <p>
                  <strong>Name:</strong> {cat.name}
                </p>
                <p>
                  <strong>Parent ID:</strong> {cat.parentCategory ?? "-"}
                </p>

                {cat.image && (
                  <div className="relative w-full h-40 border rounded bg-gray-50 overflow-hidden">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
              </div>

              {/* EDIT */}
              <LinkButton
                text="Edit"
                className="w-full bg-black text-white px-4 py-2 font-medium hover:bg-gray-800 transition-colors"
                showArrow={false}
                onClick={() => router.push(`/Admin/Categories/Edit/${cat.id}`)}
              />
            </li>
          ))}
        </ul>
      </AccountLayout>

      <Footer />
    </>
  );
}
