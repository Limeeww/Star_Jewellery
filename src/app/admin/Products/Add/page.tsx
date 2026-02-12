"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import CreateProductForm from "@/app/components/FormComponents/ProductForm/CreateProductForm";
import { Product } from "@/types/product";
import { useUserRole } from "@/hooks/useUserRole";

export default function AddProduct() {
  const router = useRouter();
  const { user, role, loading } = useUserRole();

  useEffect(() => {
    if (!loading && (!user || role !== "admin")) {
      router.push("/");
    }
  }, [loading, role, user, router]);

  const handleCreate = async (newProduct: Omit<Product, "id">) => {
    try {
      const res = await fetch("/api/products/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });

      if (res.ok) {
        router.push("/Admin/Products");
      } else {
        const errorData = await res.json();
        console.error("Error creating product:", errorData);
      }
    } catch (error) {
      console.error("Error submitting product:", error);
    }
  };

  return (
    <>
      <CreateProductForm onCreate={handleCreate} />
    </>
  );
}
