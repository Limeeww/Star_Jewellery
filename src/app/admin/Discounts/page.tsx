"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUserRole } from "@/hooks/useUserRole";
import Navbar from "@/app/components/Navbar/Navbar";
import AccountLayout from "@/app/Account/components/AccountLayout";
import Loading from "@/app/components/Loading/Loading";
import { Discount } from "@/types/product";
import LinkButton from "@/app/Account/components/LinkButton";
import Footer from "@/app/components/Footer/Footer";

export default function AdminDiscountsPage() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, loading } = useUserRole();

  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isLoggedIn = !loading && !!user;

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
    } catch (error) {
      console.error("Error fetching discounts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (
    timestamp: { toDate?: () => Date; _seconds?: number } | null | undefined
  ) => {
    if (!timestamp) return "N/A";
    if (typeof timestamp.toDate === "function") {
      return timestamp.toDate().toLocaleString();
    }
    if (typeof timestamp._seconds === "number") {
      return new Date(timestamp._seconds * 1000).toLocaleString();
    }
    return "N/A";
  };

  if (loading || role !== "admin" || isLoading) return <Loading />;

  return (
    <>
      <Navbar isScrolled={true} isLoggedIn={isLoggedIn} />
      <AccountLayout pathname={pathname || ""} sideLinks={[]}>
        <h3
          className="uppercase text-xl font-bold mb-6 text-center"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          MANAGING DISCOUNTS
        </h3>

        <LinkButton
          text="Add Discount"
          className="w-full bg-black text-white text-md font-medium px-4 py-2 hover:bg-gray-800 transition-colors my-2"
          showArrow={false}
          onClick={() => router.push(`/Admin/Discounts/Add`)}
        />

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {discounts.map((discount) => (
            <li
              key={discount.id}
              className="flex flex-col justify-between border p-4 sm:p-5 rounded-xl bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="mb-4 space-y-2 text-sm text-gray-800">
                <p>
                  <strong>Name:</strong> {discount.name}
                </p>
                <p>
                  <strong>Value:</strong> {discount.value}{" "}
                  {discount.type === "percentage" ? "%" : "₴"}
                </p>
                <p>
                  <strong>Target Type:</strong> {discount.targetType}
                </p>
                <p>
                  <strong>Applicable To:</strong>{" "}
                  {discount.applicableTo.join(", ")}
                </p>
                <p>
                  <strong>Valid From:</strong>{" "}
                  {formatTimestamp(discount.validFrom)}
                </p>
                <p>
                  <strong>Valid Until:</strong>{" "}
                  {formatTimestamp(discount.validUntil)}
                </p>
                {discount.priority !== undefined && (
                  <p>
                    <strong>Priority:</strong> {discount.priority}
                  </p>
                )}
              </div>
              <LinkButton
                text="Edit"
                className="w-full bg-black text-white text-md font-medium px-4 py-2 hover:bg-gray-800 transition-colors"
                showArrow={false}
                onClick={() =>
                  router.push(`/Admin/Discounts/Edit/${discount.id}`)
                }
              />
            </li>
          ))}
        </ul>
      </AccountLayout>
      <Footer />
    </>
  );
}
