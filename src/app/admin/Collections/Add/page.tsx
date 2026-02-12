"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import CreateCollectionForm from "@/app/components/FormComponents/CollectionForm/CreateCollectionForm";
import { Collection } from "@/types/collection";
import { useUserRole } from "@/hooks/useUserRole";

export default function AddCollection() {
  const router = useRouter();
  const { user, role, loading } = useUserRole();

  useEffect(() => {
    if (!loading && (!user || role !== "admin")) {
      router.push("/");
    }
  }, [loading, role, user, router]);

  const handleCreate = async (newCollection: Omit<Collection, "id">) => {
    try {
      const res = await fetch("/api/collections/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCollection),
      });

      if (res.ok) {
        router.push("/Admin/Collections");
      } else {
        const errorData = await res.json();
        console.error("Error creating collection:", errorData);
      }
    } catch (error) {
      console.error("Error submitting collection:", error);
    }
  };

  return (
    <>
      <CreateCollectionForm onCreate={handleCreate} />
    </>
  );
}
