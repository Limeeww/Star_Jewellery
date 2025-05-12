"use client";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebaseConfig";
import Loading from "@/app/components/Loading/Loading";
import { useRequireAuth } from "@/hooks/index";
import { useWishlist } from "@/hooks/useWishlist";
import Navbar from "@/app/components/Navbar/Navbar";
import AccountPageLayout from "@/app/Account/components/AccountPageLayout";
import LinkButton from "@/app/Account/components/LinkButton";
import { ProductCard } from "@/app/components/Item/ProductCard";
import { useRouter } from "next/navigation";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/app/components/PaginationControls";
import type { WishlistItem } from "@/types/userTypes";

export default function WishListPage() {
  const [user, loadingAuth] = useAuthState(auth);
  useRequireAuth(user ?? null, loadingAuth);
  const router = useRouter();
  const { items, removeItem } = useWishlist(user?.uid ?? null);

  const {
    currentPageItems,
    page,
    totalPages,
    hasPrev,
    hasNext,
    prevPage,
    nextPage,
  } = usePagination<WishlistItem>(items, 8);

  if (loadingAuth) {
    return <Loading />;
  }

  return (
    <>
      <Navbar isScrolled isLoggedIn={!!user} />

      <AccountPageLayout
        sideLinks={[]}
        title="My Wish List"
        description={
          <p>
            Create your wishlist with items you like. You can save up to 50
            items, check their availability, and add them to your cart at any
            time.
          </p>
        }
      >
        {items.length === 0 ? (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-800">Your wishlist is empty.</p>
            <LinkButton
              text="View items"
              onClick={() => router.push("/shop")}
              className="underline text-sm cursor-pointer"
              showArrow
            />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between py-2">
              <h3 className="text-sm font-medium">
                You have {items.length} {items.length > 1 ? "items" : "item"} in
                your wishlist
              </h3>
              {/* <button

              Maybe gonna add this later

                className="flex items-center gap-1 text-sm underline hover:text-gray-600"
                onClick={() => {
                }}
              >
                <LuShare2 size={16} />
                Share wishlist
              </button> */}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentPageItems.map((item) => (
                <ProductCard
                  key={makeKey(item)}
                  item={item}
                  userId={user!.uid}
                  onRemove={removeItem}
                />
              ))}
            </div>

            {items.length > 8 && (
              <PaginationControls
                page={page}
                totalPages={totalPages}
                hasPrev={hasPrev}
                hasNext={hasNext}
                prevPage={prevPage}
                nextPage={nextPage}
              />
            )}
          </>
        )}
      </AccountPageLayout>
    </>
  );
}

function makeKey(it: WishlistItem) {
  return [
    it.productId,
    it.variantId,
    it.size,
    it.insert,
    it.materialColor,
  ].join("_");
}
