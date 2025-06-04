"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUserRole } from "@/hooks/useUserRole";
import Navbar from "@/app/components/Navbar/Navbar";
import AccountLayout from "@/app/Account/components/AccountLayout";
import Loading from "@/app/components/Loading/Loading";
import Footer from "@/app/components/Footer/Footer";
import LinkButton from "@/app/Account/components/LinkButton";
import InputField from "@/app/components/FormComponents/InputField";
import { Order, OrderStatusLabel, PaymentStatusLabel, PaymentMethodLabel } from "@/types/order";

export default function AdminOrdersPage() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, loading } = useUserRole();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const isLoggedIn = !loading && !!user;

  /* ───── guard + fetch ───── */
  useEffect(() => {
    if (!loading && (!user || role !== "admin")) {
      router.push("/");
    } else if (!loading && role === "admin") {
      fetchOrders();
    }
  }, [loading, role, user, router]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders/orders");
      const data = await res.json();
      setOrders(data.orders);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  /* ───── search filter ───── */
  const filteredOrders = useMemo(() => {
    if (!searchTerm.trim()) return orders;
    const term = searchTerm.toLowerCase();
    return orders.filter((o) =>
      o.orderId.toString().includes(term) || o.userId.toLowerCase().includes(term)
    );
  }, [orders, searchTerm]);

  /* ───── helper date formatter ───── */
  const formatTimestamp = (
    ts: Date | { toDate?: () => Date; _seconds?: number } | null | undefined
  ) => {
    if (!ts) return "N/A";
    if (typeof ts.toDate === "function") return ts.toDate().toLocaleString();
    if (typeof ts._seconds === "number") return new Date(ts._seconds * 1000).toLocaleString();
    if (ts instanceof Date) return ts.toLocaleString();
    return "N/A";
  };

  if (loading || role !== "admin" || isLoading) return <Loading />;

  return (
    <>
      <Navbar isScrolled={true} isLoggedIn={isLoggedIn} />
      <AccountLayout pathname={pathname ?? ""} sideLinks={[]}>        
        <h3 className="uppercase text-xl font-bold mb-6 text-center" style={{ fontFamily: "var(--font-playfair)" }}>
          MANAGING ORDERS
        </h3>

        {/* поиск по orderId или userId */}
        <InputField
          label="Search by Order ID or User ID"
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Start typing…"
        />

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {filteredOrders.map((order) => (
            <li key={order.orderId} className="flex flex-col justify-between border p-4 sm:p-5 rounded-xl bg-white shadow-sm transition hover:shadow-md">
              <div className="mb-4 space-y-2 text-sm text-gray-800">
                <p><strong>Order ID:</strong> {order.orderId}</p>
                <p><strong>User ID:</strong> {order.userId}</p>
                <p><strong>Total:</strong> {order.total}₴</p>
                <p><strong>Status:</strong> {(PaymentStatusLabel as Record<string, string>)[(order.paymentInfo as { paymentStatus?: string }).paymentStatus ?? ""] ?? "-"}</p>
                <p><strong>Order Date:</strong> {formatTimestamp(order.orderDate)}</p>
                <p><strong>Updated At:</strong> {formatTimestamp(order.updatedAt)}</p>
                <p><strong>Used Bonuses:</strong> {order.usedBonuses}</p>

                {/* Payment Info */}
                {order.paymentInfo && (
                  <div className="pt-2 text-sm text-gray-700 space-y-1">
                    <p className="font-medium">Payment</p>
                    <p><strong>Method:</strong> {(PaymentMethodLabel as Record<string, string>)[(order.paymentInfo as { paymentMethod?: string }).paymentMethod ?? ""] ?? "-"}</p>
                    {"paid" in order.paymentInfo && <p><strong>Paid:</strong> {order.paymentInfo.paid ? "Yes" : "No"}</p>}
                    {"paymentStatus" in order.paymentInfo && (
                      <p><strong>Status:</strong> {PaymentStatusLabel[(order.paymentInfo as any).paymentStatus] ?? "-"}</p>
                    )}
                    {"transactionId" in order.paymentInfo && (
                      <p><strong>Transaction ID:</strong> {(order.paymentInfo as any).transactionId}</p>
                    )}
                  </div>
                )}

                {/* Shipping Address */}
                <div className="pt-2 text-sm text-gray-700 space-y-1">
                  <p className="font-medium">Shipping Address</p>
                  <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                  <p>{order.shippingAddress.street} {order.shippingAddress.houseNumber}</p>
                  {order.shippingAddress.additionalInfo && <p>{order.shippingAddress.additionalInfo}</p>}
                  <p>{order.shippingAddress.zipCode} {order.shippingAddress.city}</p>
                  <p>{order.shippingAddress.country}</p>
                  {order.shippingAddress.mobile && <p>📞 {order.shippingAddress.mobile}</p>}
                </div>

                {/* Products */}
                {order.products && order.products.length > 0 && (
                  <div className="pt-2 text-sm text-gray-700 space-y-1">
                    <p className="font-medium">Items</p>
                    {order.products.map((item, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-md p-2 bg-gray-50 mb-1">
                        <p><strong>Product ID:</strong> {item.productId}</p>
                        <p><strong>Variant ID:</strong> {item.variantId}</p>
                        <p><strong>Quantity:</strong> {item.quantity}</p>
                        <p><strong>Price:</strong> {item.price}₴</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Discounts */}
                {order.discountsApplied && order.discountsApplied.length > 0 && (
                  <div className="pt-2 text-sm text-gray-700 space-y-1">
                    <p className="font-medium">Discounts Applied</p>
                    {order.discountsApplied.map((disc) => (
                      <p key={disc.id}>#{disc.id} - {disc.name} ({disc.value}{disc.type === "percentage" ? "%" : "₴"})</p>
                    ))}
                  </div>
                )}
              </div>

              <LinkButton
                text="Edit"
                className="w-full bg-black text-white text-md font-medium px-4 py-2 hover:bg-gray-800 transition-colors"
                showArrow={false}
                onClick={() => router.push(`/Admin/Orders/Edit/${order.orderId}`)}
              />
            </li>
          ))}
        </ul>
      </AccountLayout>
      <Footer />
    </>
  );
}
