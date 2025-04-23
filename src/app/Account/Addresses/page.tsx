"use client";

import React, { useState } from "react";
import Navbar from "@/app/components/Navbar/Navbar";
import Loading from "@/app/components/Loading/Loading";
import Footer from "@/app/components/Footer/Footer";

import ConfirmModal from "@/app/components/MessageHandling/ConfirmModal";
import { usePathname } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebaseConfig";
import { useRequireAuth, useProfileData } from "@/app/utils/auth";
import { useAddresses } from "@/hooks/useAddresses";
import AccountLayout from "../components/AccountLayout";
import WelcomeBlock from "../components/WelcomeBlock";
import LinkButton from "../components/LinkButton";
import AddressCard from "../components/AddressCard";
import AddAddressModal from "../components/Modals/AddAddressModal";

export default function Addresses() {
  const pathname = usePathname();

  const [user, loadingAuth] = useAuthState(auth);
  useRequireAuth(user, loadingAuth);
  const [profileData] = useProfileData(user ?? null);

  const { addresses, loading, add, update, remove } = useAddresses();

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  if (loadingAuth || loading) {
    return <Loading />;
  }

  return (
    <>
      <Navbar isScrolled isLoggedIn={!!user} />
      <AccountLayout pathname={pathname ?? ""} sideLinks={[]}>
        <WelcomeBlock
          firstName={
            (profileData as { firstName?: string; lastName?: string })
              ?.firstName
          }
          lastName={
            (profileData as { firstName?: string; lastName?: string })?.lastName
          }
        />

        <div
          className="mt-6 space-y-4 text-sm text-gray-800"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          <h2
            className="text-2xl font-semibold"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Address Book
          </h2>
          <p>
            Save your addresses to complete your purchase faster. If you
            frequently use an address, you can mark it as your preferred
            address, and it will automatically appear during checkout.
          </p>

          {addresses.length === 0 ? (
            <div className="flex items-center justify-between mt-4 py-2">
              <p className="text-sm text-gray-800">
                You haven&apos;t saved any addresses yet.
              </p>
              <LinkButton
                text="Add new address"
                className="underline text-sm cursor-pointer text-gray-700 hover:text-black transition-colors"
                showArrow
                onClick={() => {
                  setEditingIndex(null);
                  setShowModal(true);
                }}
              />
            </div>
          ) : (
            <div className="mt-4">
              <div className="flex items-center justify-between mt-4 py-2">
                <h3 className="text-sm font-medium mb-2">
                  You have {addresses.length} saved{" "}
                  {addresses.length > 1 ? "addresses" : "address"}
                </h3>
                <LinkButton
                  text="Add new address"
                  className="underline text-sm cursor-pointer text-gray-700 hover:text-black transition-colors"
                  showArrow
                  onClick={() => {
                    setEditingIndex(null);
                    setShowModal(true);
                  }}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((address, idx) => (
                  <AddressCard
                    key={idx}
                    address={address}
                    onEdit={() => {
                      setEditingIndex(idx);
                      setShowModal(true);
                    }}
                    onRemove={() => {
                      setEditingIndex(idx);
                      setShowDelete(true);
                    }}
                    index={0}
                  />
                ))}
              </div>
            </div>
          )}

          <AddAddressModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            addressToEdit={
              editingIndex !== null ? addresses[editingIndex] : undefined
            }
            addressIndex={editingIndex ?? undefined}
            onSave={async (newAddresses) => {
              if (editingIndex === null) {
                await add(newAddresses[newAddresses.length - 1]);
              } else {
                await update(editingIndex, newAddresses[editingIndex]!);
              }
              setShowModal(false);
            }}
          />

          <ConfirmModal
            isOpen={showDelete}
            title="Delete Address"
            message="Are you sure you want to delete this address?"
            cancelLabel="No, keep it"
            confirmLabel="Yes, delete"
            onClose={() => setShowDelete(false)}
            onConfirm={async () => {
              if (editingIndex !== null) await remove(editingIndex);
              setShowDelete(false);
            }}
          />
        </div>
      </AccountLayout>
      <Footer />
    </>
  );
}
