"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import CreateDiscountForm from "@/app/components/FormComponents/DiscountForm/CreateDiscountForm";
import { Discount } from "@/types/product";
import { useUserRole } from "@/hooks/useUserRole";

export default function AddCollection() {
  const router = useRouter();
  const { user, role, loading } = useUserRole();

  useEffect(() => {
    if (!loading && (!user || role !== "admin")) {
      router.push("/");
    }
  }, [loading, role, user, router]);

  const handleCreate = async (newDiscount: Omit<Discount, "id">) => {
    try {
      const res = await fetch("/api/discounts/discounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDiscount),
      });

      if (res.ok) {
        router.push("/admin/Discounts");
      } else {
        const errorData = await res.json();
        console.error("Error creating discount:", errorData);
      }
    } catch (error) {
      console.error("Error submitting discount:", error);
    }
  };

  return (
    <>
      <CreateDiscountForm onCreate={handleCreate} />
    </>
  );
}
