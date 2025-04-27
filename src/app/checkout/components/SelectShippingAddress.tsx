"use client";

import React, { useState, useEffect } from "react";
import { useAddresses } from "@/hooks/useAddresses";
import LinkButton from "@/app/Account/components/LinkButton";
import AddAddressModal from "@/app/Account/components/Modals/AddAddressModal";
import type { Address } from "@/types/userTypes";
import AddressCard from "@/app/Account/components/AddressCard";
import ConfirmModal from "@/app/components/MessageHandling/ConfirmModal";
import { useNotification } from "@/hooks/useNotification";
import Notification from "@/app/components/MessageHandling/Notification";

interface Props {
  onSelect?: (address: Address) => void;
  addresses: Address[];
  loading?: boolean;
}

export default function SelectShippingAddress({
  onSelect,
  addresses,
  loading,
}: Props) {
  const { add, update, remove } = useAddresses();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [addressToEdit, setAddressToEdit] = useState<Address | undefined>(
    undefined
  );
  const { notification, notify, clearNotification } = useNotification();

  useEffect(() => {
    if (!loading && addresses.length && selectedIndex === null) {
      const def = addresses.findIndex((a) => a.preferredShippingAddress);
      setSelectedIndex(def >= 0 ? def : 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, addresses.length, selectedIndex]);

  if (loading) return <p>Loading addresses…</p>;

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={clearNotification}
        />
      )}
      {addresses.length === 0 ? (
        <div className="space-y-4">
          <p>There are no addresses yet. Please add one.</p>
          <LinkButton
            text="Add new address"
            className="underline text-sm cursor-pointer text-gray-700 hover:text-black transition-colors"
            showArrow
            onClick={() => {
              setEditingIndex(null);
              setAddressToEdit(undefined);
              setShowModal(true);
            }}
          />
        </div>
      ) : (
        <div>
          <div
            className={`space-y-4 ${
              addresses.length > 2 ? "max-h-80 overflow-y-auto" : ""
            }`}
          >
            {addresses.map((a, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <AddressCard
                  key={idx}
                  address={a}
                  isSelected={isSelected}
                  showDeleteIcon={true}
                  onSelect={() => {
                    setSelectedIndex(idx);
                    onSelect?.(a);
                  }}
                  onEdit={() => {
                    setEditingIndex(idx);
                    setAddressToEdit(a);
                    setShowModal(true);
                  }}
                  onRemove={() => {
                    setEditingIndex(idx);
                    setShowDelete(true);
                  }}
                />
              );
            })}
          </div>
          <LinkButton
            text="Add new address"
            className="underline text-sm mt-4 cursor-pointer text-gray-700 hover:text-black transition-colors"
            showArrow
            onClick={() => {
              setEditingIndex(null);
              setAddressToEdit(undefined);
              setShowModal(true);
            }}
          />
        </div>
      )}

      <ConfirmModal
        isOpen={showDelete}
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
            const errorMessage = e instanceof Error ? e.message : "Save failed";
            notify({
              type: "error",
              message: errorMessage || "Delete failed",
            });
          }
          setShowDelete(false);
        }}
      />

      <AddAddressModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        addressToEdit={addressToEdit}
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
    </>
  );
}
