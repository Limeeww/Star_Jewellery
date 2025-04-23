"use client";
import React from "react";
import { Address } from "@/app/types/userTypes";

interface AddressCardProps {
  address: Address;
  index: number;
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
}

export default function AddressCard({
  address,
  index,
  onEdit,
  onRemove,
}: AddressCardProps) {
  return (
    <div className="border border-gray-400 p-6 rounded-md flex flex-col h-full">
      <h3 className="text-lg font-semibold mb-1">
        {address.addressLabel || "Address"}
      </h3>

      <div className="flex-grow mb-2">
        <div className="my-6">
          {address.preferredShippingAddress && (
            <p className="text-sm text-gray-600">Default shipping address</p>
          )}
          {address.preferredBillingAddress && (
            <p className="text-sm text-gray-600">Default billing address</p>
          )}
        </div>
        <p className="mt-2">
          {address.title === "Mr"
            ? "Mr."
            : address.title === "Mrs"
            ? "Mrs."
            : ""}{" "}
          {address.firstName} {address.lastName}
        </p>

        <p>
          {address.street} {address.houseNumber}
          {address.additionalInfo && `, ${address.additionalInfo}`}
        </p>
        <p>
          {address.city}
          {address.state ? `, ${address.state}` : ""}
          {", "}
          {address.zipCode} {address.country}
        </p>

        {address.mobile && <p>+{address.mobile}</p>}
      </div>

      <div className="flex gap-2 mt-auto">
        <button
          onClick={() => onEdit(index)}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-800 hover:text-white border border-gray-800 w-full"
        >
          Change
        </button>
        <button
          onClick={() => onRemove(index)}
          className="px-4 py-2 text-white bg-gray-800 hover:bg-gray-100 hover:text-black border border-gray-800 w-full"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
