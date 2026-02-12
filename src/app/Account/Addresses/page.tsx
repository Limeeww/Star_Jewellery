"use client";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebaseConfig";
import { useRequireAuth } from "@/hooks/index";
import { useAddresses } from "@/hooks/useAddresses";
import Navbar from "@/app/components/Navbar/Navbar";
import Loading from "@/app/components/Loading/Loading";
import Footer from "@/app/components/Footer/Footer";
import AccountPageLayout from "@/app/Account/components/AccountPageLayout";
import LinkButton from "@/app/Account/components/LinkButton";
import AddressCard from "@/app/Account/components/AddressCard";
import AddAddressModal from "@/app/Account/components/Modals/AddAddressModal";
import ConfirmModal from "@/app/components/MessageHandling/ConfirmModal";
import Notification from "@/app/components/MessageHandling/Notification";
import { useNotification } from "@/hooks/useNotification";

export default function Addresses() {
  const [user, loadingAuth] = useAuthState(auth);
  useRequireAuth(user ?? null, loadingAuth);
  const { notification, notify, clearNotification } = useNotification();
  const {
    addresses,
    add,
    update,
    remove,
    loading: loadingAddrs,
  } = useAddresses();

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  if (loadingAuth) {
    return <Loading />;
  }

  return (
    <>
      <Navbar isScrolled isLoggedIn={!!user} />
      <AccountPageLayout
        sideLinks={[]}
        title="Address Book"
        description={
          <p>
            Save your addresses to complete your purchase faster. If you
            frequently use an address, you can mark it as your preferred
            address, and it will automatically appear during checkout.
          </p>
        }
      >
        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
            duration={notification.duration}
            onClose={clearNotification}
          />
        )}

        {loadingAddrs ? (
          <p>Loading addresses…</p>
        ) : addresses.length === 0 ? (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-800">
              You have no saved addresses. Please add one.
            </p>
            <LinkButton
              text="Add new address"
              onClick={() => {
                setEditingIndex(null);
                setShowModal(true);
              }}
              className="underline text-sm cursor-pointer"
              showArrow
            />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between py-1">
              <h3 className="text-sm font-medium mb-2">
                You have {addresses.length} saved{" "}
                {addresses.length > 1 ? "addresses" : "address"}
              </h3>
              <LinkButton
                text="Add new address"
                onClick={() => {
                  setEditingIndex(null);
                  setShowModal(true);
                }}
                className="underline text-sm cursor-pointer"
                showArrow
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((address, idx) => (
                <AddressCard
                  key={idx}
                  address={address}
                  isSelected={!!address.preferredShippingAddress}
                  onEdit={() => {
                    setEditingIndex(idx);
                    setShowModal(true);
                  }}
                  onRemove={() => {
                    setEditingIndex(idx);
                    setShowDelete(true);
                  }}
                />
              ))}
            </div>
          </>
        )}

        {showModal && (
          <AddAddressModal
            isOpen
            onClose={() => setShowModal(false)}
            addressToEdit={
              editingIndex !== null ? addresses[editingIndex] : undefined
            }
            addressIndex={editingIndex ?? undefined}
            onAdd={async (newAddr) => {
              try {
                await add(newAddr);
                notify({ type: "success", message: "Address added!" });
                setShowModal(false);
              } catch (e) {
                notify({
                  type: "error",
                  message: (e as Error).message || "Add failed",
                });
              }
            }}
            onUpdate={async (idx, updAddr) => {
              try {
                await update(idx, updAddr);
                setShowModal(false);
              } catch (e) {
                notify({
                  type: "error",
                  message: (e as Error).message || "Update failed",
                });
              }
            }}
          />
        )}

        {showDelete && (
          <ConfirmModal
            isOpen
            title="Delete Address"
            message="Are you sure you want to delete this address?"
            cancelLabel="No, keep it"
            confirmLabel="Yes, delete"
            onClose={() => setShowDelete(false)}
            onConfirm={async () => {
              try {
                if (editingIndex !== null) {
                  await remove(editingIndex);
                  notify({ type: "success", message: "Address removed!" });
                }
              } catch (e) {
                notify({
                  type: "error",
                  message: (e as Error).message || "Delete failed",
                });
              }
              setShowDelete(false);
            }}
          />
        )}
      </AccountPageLayout>
      <Footer />
    </>
  );
}
