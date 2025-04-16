"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUserRole } from "@/hooks/useUserRole";
// import { Product } from "@/app/types/product";
//import Loading from "@/app/components/Loading/Loading";
//import ProductForm from "@/app/components/ProductForm"; // компонент с формой

export default function EditProductPage() {
  const router = useRouter();
  const { slug } = useParams() as { slug: string };
  const { user, role, loading } = useUserRole();

  useEffect(() => {
    if (!loading && (!user || role !== "admin")) {
      router.push("/");
    } else if (!loading && role === "admin") {
    }
  }, [loading, role, user, router]);
  //   const router = useRouter();
  //   const [product, setProduct] = useState<Product | null>(null);
  //   const [loading, setLoading] = useState(true);

  //   useEffect(() => {
  //     if (id) {
  //       fetch(`/api/products/${id}`)
  //         .then((res) => res.json())
  //         .then((data) => {
  //           setProduct(data.product);
  //         })
  //         .catch(console.error)
  //         .finally(() => setLoading(false));
  //     }
  //   }, [id]);

  //   const handleSave = async (updatedProduct: Product) => {
  //     const res = await fetch(`/api/products/${id}`, {
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(updatedProduct),
  //     });

  //     if (res.ok) {
  //       router.push("/Admin/Products");
  //     } else {
  //       console.log("Error updating product");
  //     }
  //   };

  //   if (loading) return <Loading />;

  //   if (!product) return <p>Product not found.</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
      {/* <ProductForm product={product} onSave={handleSave} /> */}
      <h1>{slug}</h1>
    </div>
  );
}
