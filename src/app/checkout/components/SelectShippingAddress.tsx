"use client";

import React, { useState } from "react";
import LinkButton from "@/app/Account/components/LinkButton";
import AddAddressModal from "@/app/Account/components/Modals/AddAddressModal";
import type { Address } from "@/types/userTypes";
import AddressCard from "@/app/Account/components/AddressCard";
import ConfirmModal from "@/app/components/MessageHandling/ConfirmModal";
import { useNotification } from "@/hooks/useNotification";
import Notification from "@/app/components/MessageHandling/Notification";

interface Props {
  addresses: Address[];
  loading?: boolean;
  selectedIndex: number | null;
  onSelect?: (address: Address, index: number) => void;
  onAdd: (address: Address) => Promise<void>;
  onUpdate: (index: number, address: Address) => Promise<void>;
  onRemove: (index: number) => Promise<void>;
}

export default function SelectShippingAddress({
  addresses,
  loading,
  selectedIndex,
  onSelect,
  onAdd,
  onUpdate,
  onRemove,
}: Props) {
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [addressToEdit, setAddressToEdit] = useState<Address | undefined>();
  const [showDelete, setShowDelete] = useState(false);
  const { notification, notify, clearNotification } = useNotification();

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
                    onSelect?.(a, idx);
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
              await onRemove(editingIndex);
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
        onAdd={async (newAddr) => {
          await onAdd(newAddr);
          if (newAddr.preferredShippingAddress) {
            const newIdx = addresses.length;
            onSelect?.(newAddr, newIdx);
          }
          setShowModal(false);
        }}
        onUpdate={async (idx, updAddr) => {
          await onUpdate(idx, updAddr);
          if (updAddr.preferredShippingAddress) {
            onSelect?.(updAddr, idx);
          }
          setShowModal(false);
        }}
      />
    </>
  );
}
