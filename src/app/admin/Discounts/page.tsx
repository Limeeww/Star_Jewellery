// src/app/Admin/Discounts/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUserRole } from "@/hooks/useUserRole";

import Navbar from "@/app/components/Navbar/Navbar";
import AccountLayout from "@/app/Account/components/AccountLayout";
import Footer from "@/app/components/Footer/Footer";
import Loading from "@/app/components/Loading/Loading";
import ActionButton from "@/app/components/FormComponents/ActionButton";
import ConfirmModal from "@/app/components/MessageHandling/ConfirmModal";
import LinkButton from "@/app/Account/components/LinkButton";
import InputField from "@/app/components/FormComponents/InputField";
import { PaginationControls } from "@/app/components/PaginationControls";
import { usePagination } from "@/hooks/usePagination";

import { Discount } from "@/types/product";

export default function AdminDiscountsPage() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, loading } = useUserRole();

  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /* state для удаления */
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  /* state для поиска */
  const [searchTerm, setSearchTerm] = useState("");

  const isLoggedIn = !loading && !!user;

  /* ───── guard + initial fetch ───── */
  useEffect(() => {
    if (!loading && (!user || role !== "admin")) {
      router.push("/");
    } else if (!loading && role === "admin") {
      fetchDiscounts();
    }
  }, [loading, role, user, router]);

  const fetchDiscounts = async () => {
    try {
      const res = await fetch("/api/discounts/discounts");
      const data = await res.json();
      setDiscounts(data.discounts);
    } catch (err) {
      console.error("Error fetching discounts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  /* ───── helpers ───── */
  const formatTimestamp = (
    ts: { toDate?: () => Date; _seconds?: number } | null | undefined
  ) => {
    if (!ts) return "N/A";
    if (typeof ts.toDate === "function") return ts.toDate().toLocaleString();
    if (typeof ts._seconds === "number")
      return new Date(ts._seconds * 1000).toLocaleString();
    return "N/A";
  };

  /* filtered list в зависимости от searchTerm */
  const filteredDiscounts = useMemo(() => {
    if (!searchTerm.trim()) return discounts;
    const term = searchTerm.toLowerCase();
    return discounts.filter((d) => d.name.toLowerCase().includes(term));
  }, [discounts, searchTerm]);

  const {
    currentPageItems,
    page,
    totalPages,
    hasPrev,
    hasNext,
    prevPage,
    nextPage,
  } = usePagination<Discount>(filteredDiscounts, 4); // 8 orders per page

  /* ───── delete flow ───── */
  const openDeleteModal = (id: number) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedId === null) return;
    try {
      await fetch(`/api/discounts/${selectedId}`, { method: "DELETE" });
      setDiscounts((prev) => prev.filter((d) => d.id !== selectedId));
    } catch (err) {
      console.error("Failed to delete discount:", err);
    } finally {
      setShowConfirm(false);
      setSelectedId(null);
    }
  };

  /* ───── rendering guards ───── */
  if (loading || role !== "admin" || isLoading) return <Loading />;

  return (
    <>
      <Navbar isScrolled={true} isLoggedIn={isLoggedIn} />

      <AccountLayout pathname={pathname ?? ""} sideLinks={[]}>
        <h3
          className="uppercase text-xl font-bold mb-6 text-center"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          MANAGING DISCOUNTS
        </h3>

        {/* добавление новой скидки */}
        <LinkButton
          text="Add Discount"
          className="w-full bg-black text-white px-4 py-2 font-medium hover:bg-gray-800 transition-colors my-2"
          showArrow={false}
          onClick={() => router.push("/Admin/Discounts/Add")}
        />

        {/* поиск по названию */}
        <InputField
          label="Search by Name"
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Start typing…"
        />

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {currentPageItems.length ? (
            currentPageItems.map((d) => (
              <li
                key={d.id}
                className="flex flex-col justify-between border p-4 sm:p-5 rounded-xl bg-white shadow-sm transition hover:shadow-md"
              >
                {/* info */}
                <div className="mb-4 space-y-2 text-sm text-gray-800">
                  <p>
                    <strong>Name:</strong> {d.name}
                  </p>
                  <p>
                    <strong>Value:</strong> {d.value}
                    {d.type === "percentage" ? "%" : "₴"}
                  </p>
                  <p>
                    <strong>Target Type:</strong> {d.targetType}
                  </p>
                  <p>
                    <strong>Applicable To:</strong> {d.applicableTo.join(", ")}
                  </p>
                  <p>
                    <strong>Valid From:</strong> {formatTimestamp(d.validFrom)}
                  </p>
                  <p>
                    <strong>Valid Until:</strong>{" "}
                    {formatTimestamp(d.validUntil)}
                  </p>
                  {d.priority !== undefined && (
                    <p>
                      <strong>Priority:</strong> {d.priority}
                    </p>
                  )}
                </div>

                {/* delete button */}
                <ActionButton
                  text="Delete"
                  className="w-full bg-red-900 hover:bg-red-800 text-white px-4 py-2"
                  onClick={() => openDeleteModal(d.id)}
                />
              </li>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No discounts found.
            </p>
          )}
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

      {/* confirm modal */}
      <ConfirmModal
        isOpen={showConfirm}
        title="Confirm Deletion"
        message="Are you sure you want to delete this discount?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
