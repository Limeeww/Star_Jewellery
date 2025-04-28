"use client";

import React, { useState, useEffect, useCallback } from "react";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import LinkButton from "@/app/Account/components/LinkButton";
import AddPaymentMethodModal from "@/app/Account/components/Modals/AddPaymentMethodModal";
import type { PaymentInfo } from "@/types/order";
import PaymentMethodCard from "@/app/Account/components/PaymentMethodCard";
import ConfirmModal from "@/app/components/MessageHandling/ConfirmModal";
import { useNotification } from "@/hooks/useNotification";
import Notification from "@/app/components/MessageHandling/Notification";

export default function SelectPaymentMethod() {
  const { paymentMethods, loading, add, update, remove } = usePaymentMethods();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
  const { notification, notify, clearNotification } = useNotification();

  
  useEffect(() => {
    if (!loading && paymentMethods.length > 0 && selectedIndex === null) {
      const def = paymentMethods.findIndex((pm) => pm.isDefault);
      setSelectedIndex(def >= 0 ? def : 0);
    }
  }, [loading, paymentMethods, selectedIndex]);

  const handleSetDefault = useCallback(
    async (idx: number) => {
      const prev = paymentMethods.findIndex((pm) => pm.isDefault);
      if (prev >= 0 && prev !== idx) {
        await update(prev, { ...paymentMethods[prev], isDefault: false });
      }
      await update(idx, { ...paymentMethods[idx], isDefault: true });
      setSelectedIndex(idx);
    },
    [paymentMethods, update]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (deletingIndex === null) return;
    try {
      await remove(deletingIndex);
      notify({ type: "success", message: "Payment method removed!" });
      if (selectedIndex === deletingIndex) {
        setSelectedIndex(null);
      }
    } catch (e) {
      notify({ type: "error", message: (e as Error).message || "Delete failed" });
    }
    setShowDelete(false);
  }, [deletingIndex, remove, notify, selectedIndex]);

  if (loading) return <p>Loading payment methods…</p>;

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

      {paymentMethods.length === 0 ? (
        <div className="space-y-4">
          <p>There are no payment methods yet. Please add one.</p>
          <LinkButton
            text="Add new payment method"
            className="underline text-sm cursor-pointer text-gray-700 hover:text-black transition-colors"
            showArrow
            onClick={() => setShowModal(true)}
          />
        </div>
      ) : (
        <div>
          <div
            className={`space-y-4 ${
              paymentMethods.length > 2 ? "max-h-80 overflow-y-auto" : ""
            }`}
          >
            {paymentMethods.map((pm, idx) => (
              <PaymentMethodCard
                key={pm.id}
                paymentMethod={pm}
                showDeleteIcon={true}
                isDefault={idx === selectedIndex}
                onSetDefault={() => handleSetDefault(idx)}
                onRemove={() => {
                  setDeletingIndex(idx);
                  setShowDelete(true);
                }}

              />
            ))}
          </div>
          <LinkButton
            text="Add new payment method"
            className="underline text-sm mt-4 cursor-pointer text-gray-700 hover:text-black transition-colors"
            showArrow
            onClick={() => setShowModal(true)}
          />
        </div>
      )}

      <ConfirmModal
        isOpen={showDelete}
        title="Delete Payment Method"
        message="Are you sure you want to delete this payment method?"
        cancelLabel="No, keep it"
        confirmLabel="Yes, delete"
        onClose={() => setShowDelete(false)}
        onConfirm={handleDeleteConfirm}
      />

      <AddPaymentMethodModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={async (newMethods: PaymentInfo[]) => {
          try {
            const last = newMethods[newMethods.length - 1];
            await add(last);
            notify({ type: "success", message: "Payment method added!" });
          } catch (e) {
            notify({ type: "error", message: (e as Error).message || "Save failed" });
          }
          setShowModal(false);
        }}
      />
    </>
  );
}
