"use client";

import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export interface Address {
  addressLabel: string;
  title: string;
  firstName: string;
  lastName: string;
  street: string;
  houseNumber: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  mobile: string;
  additionalInfo?: string;
  preferredShippingAddress?: boolean;
  preferredBillingAddress?: boolean;
}

interface Props {
  /**
   * Опциональный колбэк,
   * срабатывает при выборе адреса
   */
  onSelect?: (address: Address) => void;
}

export default function SelectShippingAddress({ onSelect }: Props) {
  const [user, loading] = useAuthState(auth);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Загружаем addresses из Firestore
  useEffect(() => {
    if (!user || loading) return;
    (async () => {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        const data = snap.data() as { addresses?: Address[] };
        const addrs = data.addresses || [];
        setAddresses(addrs);

        // По умолчанию отметим preferredShippingAddress
        const defIdx = addrs.findIndex((a) => a.preferredShippingAddress);
        if (defIdx >= 0) setSelectedIndex(defIdx);
      }
    })();
  }, [user, loading]);

  if (loading) return <p>Loading addresses…</p>;
  if (!user) return null;
  if (addresses.length === 0) return <p>No addresses on file.</p>;

  return (
    <div className="space-y-4">
      {addresses.map((a, idx) => {
        const isSelected = idx === selectedIndex;
        return (
          <div
            key={idx}
            className={`
              border rounded-lg p-4
              ${isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200"}
            `}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-800">
                {a.addressLabel}
              </span>
              {addresses.length > 1 && (
                <button
                  onClick={() => {
                    setSelectedIndex(idx);
                    onSelect?.(a);
                  }}
                  className={`
                    text-sm font-medium px-3 py-1 rounded
                    transition-colors
                    ${
                      isSelected
                        ? "bg-gray-200 text-gray-600 cursor-default"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }
                  `}
                  disabled={isSelected}
                >
                  {isSelected ? "Selected" : "Select Address"}
                </button>
              )}
            </div>

            <div className="text-sm text-gray-700 space-y-1">
              <div>
                {a.title} {a.firstName} {a.lastName}
              </div>
              <div>
                {a.street}, {a.houseNumber}
              </div>
              <div>
                {a.city}, {a.state} {a.zipCode}
              </div>
              <div>{a.country}</div>
              <div>📞 {a.mobile}</div>
              {a.additionalInfo && (
                <div className="text-xs text-gray-500">
                  {a.additionalInfo}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
