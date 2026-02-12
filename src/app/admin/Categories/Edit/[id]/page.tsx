"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUserRole } from "@/hooks/useUserRole";
import { Category } from "@/types/product";

import Loading from "@/app/components/Loading/Loading";
import Navbar from "@/app/components/Navbar/Navbar";
import Footer from "@/app/components/Footer/Footer";
import EditCategoryForm from "@/app/components/FormComponents/CategoryForm/EditCategoryForm";

export default function EditCategoryPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const { user, role, loading: userLoading } = useUserRole();

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  const isLoggedIn = !!user && !userLoading;

  useEffect(() => {
    if (!userLoading && (!user || role !== "admin")) {
      router.push("/");
    }
  }, [userLoading, user, role, router]);

  useEffect(() => {
    if (!id || role !== "admin") return;

    const fetchCategory = async () => {
      try {
        const res = await fetch(`/api/categories/${id}`);
        if (!res.ok) throw new Error("Category not found");
        const data = await res.json();
        setCategory(data.category);
      } catch (err) {
        console.error("Error loading category:", err);
        setCategory(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id, role]);

  const handleSave = async (updated: Category) => {
    const res = await fetch(`/api/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });

    if (res.ok) {
      router.push("/admin/Categories");
    } else {
      console.error("Error updating category");
    }
  };

  const handleDelete = async (categoryId: string) => {
    try {
      await fetch(`/api/categories/${categoryId}`, { method: "DELETE" });
      router.push("/admin/Categories");
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  if (userLoading || loading) return <Loading />;
  if (!category) return <p className="text-red-500">Category not found.</p>;

  return (
    <>
      <Navbar isScrolled={true} isLoggedIn={isLoggedIn} />

      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Edit Category</h2>

        <EditCategoryForm
          category={category}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      </div>

      <Footer />
    </>
  );
}
