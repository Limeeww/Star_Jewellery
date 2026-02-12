"use client";

import React, { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUserRole } from "@/hooks/useUserRole";
import Navbar from "@/app/components/Navbar/Navbar";
import AccountLayout from "@/app/Account/components/AccountLayout";
import Loading from "@/app/components/Loading/Loading";
import Footer from "@/app/components/Footer/Footer";
import LinkButton from "@/app/Account/components/LinkButton";
import InputField from "@/app/components/FormComponents/InputField";
import { Order, PaymentStatusLabel, PaymentMethodLabel } from "@/types/order";
import { PaginationControls } from "@/app/components/PaginationControls";
import { usePagination } from "@/hooks/usePagination";

interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
}

export default function AdminOrdersPage() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, loading } = useUserRole();

  const [orders, setOrders] = useState<Order[]>([]);
  const [userMap, setUserMap] = useState<Record<string, UserInfo>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const isLoggedIn = !loading && !!user;

  /* ───── Fetch orders + related users ───── */
  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders/orders");
      const data = await res.json();
      setOrders(data.orders);

      const uniqueIds: string[] = Array.from(
        new Set((data.orders as Order[]).map((o) => o.userId)),
      );
      fetchUsers(uniqueIds);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  /* ───── Guard + fetch ───── */
  useEffect(() => {
    if (!loading && (!user || role !== "admin")) {
      router.push("/");
    } else if (!loading && role === "admin") {
      fetchOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, role, user, router]);

  /* ───── Fetch users by ids ───── */
  const fetchUsers = async (ids: string[]) => {
    const toLoad = ids.filter((id) => !(id in userMap));
    if (toLoad.length === 0) return;

    try {
      const results = await Promise.all(
        toLoad.map(async (id) => {
          const res = await fetch(`/api/users/${id}`);
          if (!res.ok) return null;
          const data = await res.json();
          return { id, info: data.user as UserInfo };
        }),
      );
      setUserMap((prev) => {
        const next = { ...prev };
        for (const r of results) if (r) next[r.id] = r.info;
        return next;
      });
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const filteredOrders = useMemo(() => {
    if (!searchTerm.trim()) return orders;
    const term = searchTerm.toLowerCase();
    return orders.filter((o) => {
      const user = userMap[o.userId];
      const name = user
        ? `${user.firstName} ${user.lastName}`.toLowerCase()
        : "";
      const email = user?.email?.toLowerCase() ?? "";
      return (
        o.orderId.toString().includes(term) ||
        email.includes(term) ||
        name.includes(term)
      );
    });
  }, [orders, searchTerm, userMap]);

  const {
    currentPageItems,
    page,
    totalPages,
    hasPrev,
    hasNext,
    prevPage,
    nextPage,
  } = usePagination<Order>(filteredOrders, 4); // 8 orders per page

  /* ───── Helper date formatter ───── */
  const formatTimestamp = (ts: unknown): string => {
    if (!ts) return "N/A";

    if (ts instanceof Date) return ts.toLocaleString();

    if (typeof ts === "string") {
      const d = new Date(ts);
      if (!isNaN(d.getTime())) return d.toLocaleString();
    }

    if (typeof ts === "number") {
      const ms = ts > 1e12 ? ts : ts * 1000;
      return new Date(ms).toLocaleString();
    }

    if (typeof ts === "object" && ts !== null) {
      const obj = ts as {
        toDate?: () => Date;
        _seconds?: number;
        seconds?: number;
      };
      if (typeof obj.toDate === "function")
        return obj.toDate().toLocaleString();
      const secs = obj._seconds ?? obj.seconds;
      if (typeof secs === "number")
        return new Date(secs * 1000).toLocaleString();
    }

    return "N/A";
  };

  /* ───── Loading states ───── */
  if (loading || role !== "admin" || isLoading) return <Loading />;

  /* ───── Render ───── */
  return (
    <>
      <Navbar isScrolled={true} isLoggedIn={isLoggedIn} />

      <AccountLayout pathname={pathname ?? ""} sideLinks={[]}>
        <h3
          className="uppercase text-xl font-bold mb-6 text-center"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          MANAGING ORDERS
        </h3>

        {/* Search */}
        <InputField
          label="Search by Name, Email, or Order ID"
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Start typing…"
        />

        {/* Orders grid */}
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {currentPageItems.map((order) => {
            const u = userMap[order.userId];
            return (
              <li
                key={order.orderId}
                className="flex flex-col justify-between border p-4 sm:p-5 rounded-xl bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="mb-4 space-y-2 text-sm text-gray-800">
                  <p>
                    <strong>Order ID:</strong> {order.orderId}
                  </p>
                  <p>
                    <strong>User:</strong>{" "}
                    {u ? (
                      <span>
                        {u.firstName} {u.lastName} — {u.email}
                      </span>
                    ) : (
                      <span className="italic text-gray-500">Loading…</span>
                    )}
                  </p>
                  <p>
                    <strong>Total:</strong> {order.total}₴
                  </p>
                  <p>
                    <strong>Status:</strong> {String(order.status)}
                  </p>
                  <p>
                    <strong>Order Date:</strong>{" "}
                    {formatTimestamp(order.orderDate)}
                  </p>
                  <p>
                    <strong>Updated At:</strong>{" "}
                    {formatTimestamp(order.updatedAt)}
                  </p>
                  <p>
                    <strong>Used Bonuses:</strong> {order.usedBonuses}
                  </p>

                  {/* Payment info */}
                  {order.paymentInfo && (
                    <div className="pt-2 text-sm text-gray-700 space-y-1">
                      <p className="font-medium">
                        <strong>Payment</strong>
                      </p>
                      <p>
                        <strong>Method:</strong>{" "}
                        {(PaymentMethodLabel as Record<string, string>)[
                          (order.paymentInfo as { paymentMethod?: string })
                            .paymentMethod ?? ""
                        ] ?? "-"}
                      </p>
                      {"paid" in order.paymentInfo && (
                        <p>
                          <strong>Paid:</strong>{" "}
                          {order.paymentInfo.paid ? "Yes" : "No"}
                        </p>
                      )}
                      {"paymentStatus" in order.paymentInfo && (
                        <p>
                          <strong>Status:</strong>{" "}
                          {
                            PaymentStatusLabel[
                              (
                                order.paymentInfo as {
                                  paymentStatus?: keyof typeof PaymentStatusLabel;
                                }
                              ).paymentStatus ?? "pending"
                            ]
                          }
                        </p>
                      )}
                      {order.paymentInfo?.transactionId && (
                        <p>
                          <strong>Transaction ID:</strong>{" "}
                          {order.paymentInfo.transactionId}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Shipping address */}
                  <div className="pt-2 text-sm text-gray-700 space-y-1">
                    <p className="font-medium">
                      <strong>Shipping Address</strong>
                    </p>
                    <p>
                      {order.shippingAddress.street}{" "}
                      {order.shippingAddress.houseNumber}
                    </p>
                    <p>
                      {order.shippingAddress.zipCode}{" "}
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.country}
                    </p>
                  </div>
                </div>

                <LinkButton
                  text="Edit"
                  className="w-full bg-black text-white text-md font-medium px-4 py-2 hover:bg-gray-800 transition-colors"
                  showArrow={false}
                  onClick={() =>
                    router.push(`/admin/Orders/Edit/${order.orderId}`)
                  }
                />
              </li>
            );
          })}
        </ul>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <PaginationControls
              page={page}
              totalPages={totalPages}
              hasPrev={hasPrev}
              hasNext={hasNext}
              prevPage={prevPage}
              nextPage={nextPage}
            />
          </div>
        )}
      </AccountLayout>

      <Footer />
    </>
  );
}
