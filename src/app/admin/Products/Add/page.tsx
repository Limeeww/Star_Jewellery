"use client";
import { useRouter } from "next/navigation";
import CreateProductForm from "@/app/components/FormComponents/ProductForm/CreateProductForm";
import { Product } from "@/types/product";

export default function AddProduct() {
  const router = useRouter();

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
        console.error("Ошибка при создании продукта:", errorData);
      }
    } catch (error) {
      console.error("Ошибка при отправке продукта:", error);
    }
  };

  return (
    <>
      <CreateProductForm onCreate={handleCreate} />
    </>
  );
}
