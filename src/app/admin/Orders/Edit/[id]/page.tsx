"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUserRole } from "@/hooks/useUserRole";
import type { Order } from "@/types/order";
import Loading from "@/app/components/Loading/Loading";
import Footer from "@/app/components/Footer/Footer";
import Navbar from "@/app/components/Navbar/Navbar";
import EditOrderForm from "@/app/components/FormComponents/OrderForm/EditOrderForm";

export default function EditOrderPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const { user, role, loading: userLoading } = useUserRole();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const isLoggedIn = !userLoading && !!user;

  useEffect(() => {
    if (!userLoading && (!user || role !== "admin")) {
      router.push("/");
    }
  }, [userLoading, user, role, router]);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      try {
        const res = await fetch(`/api/orders/${id}`);
        if (!res.ok) throw new Error("Order not found");
        const data = await res.json();
        setOrder(data.order);
      } catch (err) {
        console.error("Error loading order:", err);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    if (role === "admin") fetchOrder();
  }, [id, role]);

  const handleSave = async (updated: Order) => {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });

    if (res.ok) {
      router.push("/admin/Orders");
    } else {
      console.error("Error updating order");
    }
  };

  if (userLoading || loading) return <Loading />;
  if (!order) return <p className="text-red-500">Order not found.</p>;

  return (
    <>
      <Navbar isScrolled={true} isLoggedIn={isLoggedIn} />
      <div className="p-6 max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">
          Edit Order #{order.orderId}
        </h2>

        <EditOrderForm order={order} onSave={handleSave} />
      </div>
      <Footer />
    </>
  );
}
