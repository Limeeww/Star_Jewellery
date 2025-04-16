"use client";

import Navbar from "@/app/components/Navbar/Navbar";
import type { Address } from "../../types/userTypes";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase/firebaseConfig";
import Loading from "@/app/components/Loading/Loading";
import WelcomeBlock from "../components/WelcomeBlock";
import AccountLayout from "../components/AccountLayout";
import Footer from "@/app/components/Footer/Footer";
import { usePathname } from "next/navigation";
import LinkButton from "../components/LinkButton";
import AddAddressModal from "../components/Modals/AddAddressModal";
import {
  useRequireAuth,
  useProfileData,
  updateUserProfile,
  notify,
} from "../../utils/auth";
import AddressCard from "../components/AddressCard";
import ConfirmDeleteModal from "../components/Modals/ConfirmDeleteModal";

export default function Addresses() {
  const [showAdressModal, setShowAddressModal] = useState(false);
  const [user, loading] = useAuthState(auth);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [addressToEdit, setAddressToEdit] = useState<Address | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [removingIndex, setRemovingIndex] = useState<number | null>(null);

  const pathname = usePathname();
  const isLoggedIn = !loading && !!user;

  useRequireAuth(user, loading);

  const [profileData, setProfileData] = useProfileData(user ?? null);

  if (loading) {
    return <Loading />;
  }

  const handleEdit = (index: number) => {
    if (!profileData || !(profileData as { addresses: Address[] }).addresses)
      return;
    setEditingIndex(index);
    setAddressToEdit(
      (profileData as { addresses: Address[] }).addresses[index]
    );
    setShowAddressModal(true);
  };

  const handleRemove = (index: number) => {
    setRemovingIndex(index);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (
      removingIndex === null ||
      !profileData ||
      !profileData.addresses ||
      !user
    ) {
      setShowDeleteModal(false);
      return;
    }

    try {
      const newAddresses = [...(profileData.addresses as Address[])];
      newAddresses.splice(removingIndex, 1);

      await updateUserProfile(user.uid, { addresses: newAddresses });

      const updatedProfile = { ...profileData, addresses: newAddresses };
      setProfileData(updatedProfile);
    } catch (err) {
      if (err instanceof Error) {
        notify({ message: err.message, type: "error" });
      } else {
        notify({ message: "Failed to save address.", type: "error" });
      }
    }

    setShowDeleteModal(false);
    setRemovingIndex(null);
  };

  return (
    <>
      <Navbar isScrolled={true} isLoggedIn={isLoggedIn} />
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

          {(Array.isArray(profileData?.addresses)
            ? profileData.addresses.length
            : 0) === 0 ? (
            <div className="flex items-center justify-between mt-4 py-2">
              <p className="text-sm text-gray-800">
                You haven&apos;t saved any addresses yet.
              </p>
              <LinkButton
                text="Add new address"
                className="underline text-sm cursor-pointer text-gray-700 hover:text-black transition-colors"
                showArrow={true}
                onClick={() => {
                  setEditingIndex(null);
                  setAddressToEdit(null);
                  setShowAddressModal(true);
                }}
              />
            </div>
          ) : (
            <div className="mt-4">
              <div className="flex flex items-center justify-between mt-4 py-2">
                <h3 className="text-sm font-medium mb-2">
                  You have{" "}
                  {Array.isArray(profileData?.addresses)
                    ? (profileData.addresses as Address[]).length
                    : 0}{" "}
                  saved{" "}
                  {Array.isArray(profileData?.addresses) &&
                  (profileData.addresses as Address[]).length > 1
                    ? "addresses"
                    : "address"}
                </h3>
                <div className="flex justify-end">
                  <LinkButton
                    text="Add new address"
                    className="underline text-sm cursor-pointer text-gray-700 hover:text-black transition-colors"
                    showArrow={true}
                    onClick={() => {
                      setEditingIndex(null);
                      setAddressToEdit(null);
                      setShowAddressModal(true);
                    }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(profileData?.addresses as Address[]).map((address, index) => (
                  <AddressCard
                    key={index}
                    address={address}
                    onEdit={() => handleEdit(index)}
                    onRemove={handleRemove}
                    index={index}
                  />
                ))}
              </div>
            </div>
          )}

          <AddAddressModal
            isOpen={showAdressModal}
            onClose={() => setShowAddressModal(false)}
            addressToEdit={addressToEdit}
            addressIndex={editingIndex}
          />
          <ConfirmDeleteModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={confirmDelete}
          />
        </div>
      </AccountLayout>

      <Footer />
    </>
  );
}
