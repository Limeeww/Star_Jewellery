"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import CreateCategoryForm from "@/app/components/FormComponents/CategoryForm/CreateCategoryForm";
import { Category } from "@/types/product";
import { useUserRole } from "@/hooks/useUserRole";

export default function AddCategory() {
  const router = useRouter();
  const { user, role, loading } = useUserRole();

  useEffect(() => {
    if (!loading && (!user || role !== "admin")) {
      router.push("/");
    }
  }, [loading, role, user, router]);

  const handleCreate = async (newCategory: Omit<Category, "id">) => {
    try {
      const res = await fetch("/api/categories/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategory),
      });

      if (res.ok) {
        router.push("/Admin/Categories");
      } else {
        const errorData = await res.json();
        console.error("Ошибка при создании категории:", errorData);
      }
    } catch (error) {
      console.error("Ошибка при отправке категории:", error);
    }
  };

  return (
    <>
      <CreateCategoryForm onCreate={handleCreate} />
    </>
  );
}
