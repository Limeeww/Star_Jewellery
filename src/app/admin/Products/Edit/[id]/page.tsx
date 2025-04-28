"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUserRole } from "@/hooks/useUserRole";
import { Product } from "@/app/types/product";
import Loading from "@/app/components/Loading/Loading";
import EditProductForm from "@/app/components/FormComponents/ProductForm/EditProductForm";
import Footer from "@/app/components/Footer/Footer";
import Navbar from "@/app/components/Navbar/Navbar";

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams() as { id: number | string };
  const { user, role, loading: userLoading } = useUserRole();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const isLoggedIn = !loading && !!user;

  useEffect(() => {
    if (!userLoading && (!user || role !== "admin")) {
      router.push("/");
    }
  }, [userLoading, user, role, router]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data.product);
      } catch (err) {
        console.error("Ошибка загрузки товара:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (role === "admin") {
      fetchProduct();
    }
  }, [id, role]);

  const handleSave = async (updatedProduct: Product) => {
    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProduct),
    });

    if (res.ok) {
      router.push("/Admin/Products");
    } else {
      console.log("Error updating product");
    }
  };

  const handleDelete = async (productId: number) => {
    try {
      await fetch(`/api/products/${productId}`, { method: "DELETE" });
      router.push("/Admin/Products");
    } catch (error) {
      console.error("Ошибка при удалении продукта:", error);
    }
  };

  if (userLoading || loading) return <Loading />;

  if (!product) return <p className="text-red-500">Product not found.</p>;

  return (
    <>
      <Navbar isScrolled={true} isLoggedIn={isLoggedIn} />
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
        <EditProductForm
          product={product}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      </div>
      <Footer />
    </>
  );
}
