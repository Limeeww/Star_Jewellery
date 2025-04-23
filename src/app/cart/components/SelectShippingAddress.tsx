"use client";

import React, { useState, useEffect } from "react";
import { useAddresses } from "@/hooks/useAddresses";
import ActionButton from "@/app/components/FormComponents/ActionButton";
import LinkButton from "@/app/Account/components/LinkButton";
import AddAddressModal from "@/app/Account/components/Modals/AddAddressModal";
import type { Address } from "@/app/types/userTypes";

interface Props {
  onSelect?: (address: Address) => void;
}

export default function SelectShippingAddress({ onSelect }: Props) {
  const { addresses, loading, add, update } = useAddresses();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [addressToEdit, setAddressToEdit] = useState<Address | undefined>(
    undefined
  );

  useEffect(() => {
    if (!loading && addresses.length) {
      const def = addresses.findIndex((a) => a.preferredShippingAddress);
      setSelectedIndex(def >= 0 ? def : 0);
    }
  }, [loading, addresses]);

  if (loading) return <p>Loading addresses…</p>;

  return (
    <>
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
                <div
                  key={idx}
                  className={`border rounded-lg p-4 flex flex-col justify-between ${
                    isSelected
                      ? "border-gray-500 bg-gray-50"
                      : "border-gray-200"
                  }`}
                >
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      {a.addressLabel}
                    </h4>
                    <div className="text-sm text-gray-700 space-y-1">
                      <div>
                        {a.title} {a.firstName} {a.lastName}
                      </div>
                      <div>
                        {a.street}, {a.houseNumber}
                        {a.additionalInfo && `, ${a.additionalInfo}`}
                      </div>
                      <div>
                        {a.city}, {a.state} {a.zipCode}
                      </div>
                      <div>{a.country}</div>
                      <div>+{a.mobile}</div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <ActionButton
                      text={isSelected ? "Selected" : "Select Address"}
                      onClick={() => {
                        setSelectedIndex(idx);
                        onSelect?.(a);
                      }}
                      className={`text-sm font-medium px-3 py-1 rounded flex-1 transition-colors ${
                        isSelected
                          ? "bg-gray-200 text-gray-600 cursor-default"
                          : "bg-gray-900 text-white hover:bg-gray-700"
                      }`}
                      disabled={isSelected}
                    />
                    <ActionButton
                      text="Edit Address"
                      onClick={() => {
                        setEditingIndex(idx);
                        setAddressToEdit(a);
                        setShowModal(true);
                      }}
                      className="text-sm font-medium px-3 py-1 rounded flex-1 bg-gray-900 text-white hover:bg-gray-700 transition"
                    />
                  </div>
                </div>
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
