"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUserRole } from "@/hooks/useUserRole";
import { Collection } from "@/types/collection";

import Loading from "@/app/components/Loading/Loading";
import Navbar from "@/app/components/Navbar/Navbar";
import Footer from "@/app/components/Footer/Footer";
import EditCollectionForm from "@/app/components/FormComponents/CollectionForm/EditCollectionForm";

export default function EditCollectionPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string }; // id всегда строка
  const { user, role, loading: userLoading } = useUserRole();

  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);

  const isLoggedIn = !!user && !userLoading;

  useEffect(() => {
    if (!userLoading && (!user || role !== "admin")) {
      router.push("/");
    }
  }, [userLoading, user, role, router]);

  useEffect(() => {
    if (!id || role !== "admin") return;

    const fetchCollection = async () => {
      try {
        const res = await fetch(`/api/collections/${id}`);
        if (!res.ok) throw new Error("Collection not found");
        const data = await res.json();
        setCollection(data.collection);
      } catch (err) {
        console.error("Ошибка загрузки коллекции:", err);
        setCollection(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, [id, role]);

  const handleSave = async (updated: Collection) => {
    const res = await fetch(`/api/collections/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });

    if (res.ok) {
      router.push("/Admin/Collections");
    } else {
      console.error("Error updating collection");
    }
  };

  const handleDelete = async (collectionId: string) => {
    try {
      await fetch(`/api/collections/${collectionId}`, { method: "DELETE" });
      router.push("/Admin/Collections");
    } catch (err) {
      console.error("Ошибка при удалении коллекции:", err);
    }
  };

  if (userLoading || loading) return <Loading />;
  if (!collection) return <p className="text-red-500">Collection not found.</p>;

  return (
    <>
      <Navbar isScrolled={true} isLoggedIn={isLoggedIn} />

      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Edit Collection</h2>

        <EditCollectionForm
          collection={collection}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      </div>

      <Footer />
    </>
  );
}
