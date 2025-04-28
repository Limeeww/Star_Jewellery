"use client";

import React, { useState, useEffect, useCallback } from "react";
import LinkButton from "@/app/Account/components/LinkButton";
import AddPaymentMethodModal from "@/app/Account/components/Modals/AddPaymentMethodModal";
import PaymentMethodCard from "@/app/Account/components/PaymentMethodCard";
import ConfirmModal from "@/app/components/MessageHandling/ConfirmModal";
import Notification from "@/app/components/MessageHandling/Notification";
import { useNotification } from "@/hooks/useNotification";
import type { PaymentInfo } from "@/types/order";

interface SelectPaymentMethodProps {
  paymentMethods: PaymentInfo[];
  loading: boolean;
  add: (method: PaymentInfo) => Promise<void>;
  update: (idx: number, pm: PaymentInfo) => Promise<void>;
  remove: (idx: number) => Promise<void>;
  selectedIndex: number | null;
  onSelect: (pm: PaymentInfo, idx: number) => void;
}

export default function SelectPaymentMethod({
  paymentMethods,
  loading,
  add,
  update,
  remove,
  selectedIndex,
  onSelect,
}: SelectPaymentMethodProps) {
  const { notification, notify, clearNotification } = useNotification();

  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!loading && paymentMethods.length > 0 && selectedIndex === null) {
      const def = paymentMethods.findIndex((pm) => pm.isDefault);
      onSelect(paymentMethods[def >= 0 ? def : 0], def >= 0 ? def : 0);
    }
  }, [loading, onSelect, selectedIndex, paymentMethods]);

  const handleSetDefault = useCallback(
    async (idx: number) => {
      const prev = paymentMethods.findIndex((pm) => pm.isDefault);
      if (prev >= 0 && prev !== idx) {
        await update(prev, { ...paymentMethods[prev], isDefault: false });
      }
      await update(idx, { ...paymentMethods[idx], isDefault: true });
      onSelect(paymentMethods[idx], idx);
    },
    [paymentMethods, update, onSelect]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (deletingIndex === null) return;
    try {
      await remove(deletingIndex);
      notify({ type: "success", message: "Payment method removed!" });
      if (selectedIndex === deletingIndex) {
        onSelect(null as unknown as PaymentInfo, null as unknown as number);
      }
    } catch (e) {
      notify({
        type: "error",
        message: (e as Error).message || "Delete failed",
      });
    } finally {
      setShowDelete(false);
    }
  }, [deletingIndex, remove, notify, selectedIndex, onSelect]);

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
            onClick={() => {
              setEditingIndex(null);
              setShowModal(true);
            }}
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
                isDefault={pm.isDefault}
                isChosed={idx === selectedIndex}
                showDeleteIcon
                showSelectButton
                onSelect={() => onSelect(pm, idx)}
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
            onClick={() => {
              setEditingIndex(null);
              setShowModal(true);
            }}
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
        paymentMethodToEdit={
          editingIndex !== null ? paymentMethods[editingIndex] : undefined
        }
        onSave={async (newMethods) => {
          try {
            if (editingIndex === null) {
              const last = newMethods[newMethods.length - 1];
              await add(last);
              notify({ type: "success", message: "Payment method added!" });
            } else {
              await update(editingIndex, newMethods[editingIndex]!);
              notify({ type: "success", message: "Payment method updated!" });
            }
          } catch (e) {
            notify({
              type: "error",
              message: (e as Error).message || "Save failed",
            });
          } finally {
            setShowModal(false);
          }
        }}
      />
    </>
  );
}
