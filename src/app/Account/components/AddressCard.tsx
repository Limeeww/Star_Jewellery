"use client";

import React from "react";
import ActionButton from "@/app/components/FormComponents/ActionButton";
import type { Address } from "@/types/userTypes";

interface AddressCardProps {
  address: Address;
  isSelected?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  onRemove?: () => void;
  className?: string;
  showDeleteIcon?: boolean;
}

export default function AddressCard({
  address,
  isSelected = false,
  onSelect,
  onEdit,
  onRemove,
  showDeleteIcon = false,
  className = "",
}: AddressCardProps) {
  return (
    <div
      className={`
      relative             
      border rounded-lg p-4 flex flex-col justify-between
      ${isSelected ? "border-gray-500 bg-gray-50" : "border-gray-200"}
      ${className}
    `}
    >
      {showDeleteIcon && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-3 right-2 p-1 text-gray-400 hover:text-red-600 transition"
          aria-label="Delete address"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      <div>
        {address.addressLabel && (
          <h4 className="font-semibold text-gray-800 mb-2">
            {address.addressLabel}
          </h4>
        )}
        <div className="text-sm text-gray-700 space-y-1">
          <div>
            {address.title} {address.firstName} {address.lastName}
          </div>
          <div>
            {address.street}, {address.houseNumber}
            {address.additionalInfo && `, ${address.additionalInfo}`}
          </div>
          <div>
            {address.city}
            {address.state && `, ${address.state}`} {address.zipCode}
          </div>
          <div>{address.country}</div>
          {address.mobile && <div>+{address.mobile}</div>}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        {onSelect && (
          <ActionButton
            text={isSelected ? "Selected" : "Select Address"}
            onClick={onSelect}
            disabled={isSelected}
            className={`text-sm font-medium px-3 py-1 rounded flex-1 transition-colors ${
              {
                true: "bg-gray-200 text-gray-600 cursor-default",
                false: "bg-gray-900 text-white hover:bg-gray-700",
              }[String(isSelected)]
            }`}
          />
        )}
        {onEdit && (
          <ActionButton
            text="Edit Address"
            onClick={onEdit}
            className="text-sm font-medium px-3 py-1 rounded flex-1 bg-gray-900 text-white hover:bg-gray-700 transition"
          />
        )}
        {!showDeleteIcon && onRemove && (
          <ActionButton
            text="Remove Address"
            onClick={onRemove}
            className="text-sm font-medium px-3 py-1 rounded flex-1 bg-red-700 text-white hover:bg-red-700 transition"
          />
        )}
      </div>
    </div>
  );
}
