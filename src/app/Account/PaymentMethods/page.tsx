"use client";

import React, { useState } from "react";
import Navbar from "@/app/components/Navbar/Navbar";
import Loading from "@/app/components/Loading/Loading";
import Footer from "@/app/components/Footer/Footer";
import ConfirmModal from "@/app/components/MessageHandling/ConfirmModal";
import { usePathname } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebaseConfig";
import { useProfileData } from "@/utils/index";
import { useRequireAuth } from "@/hooks/index";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import AccountLayout from "@/app/Account/components/AccountLayout";
import WelcomeBlock from "@/app/Account/components/WelcomeBlock";
import LinkButton from "@/app/Account/components/LinkButton";
import PaymentMethodCard from "@/app/Account/components/PaymentMethodCard";
import AddPaymentMethodModal from "@/app/Account/components/Modals/AddPaymentMethodModal";
import Notification from "@/app/components/MessageHandling/Notification";
import { useNotification } from "@/hooks/useNotification";
import type { PaymentInfo } from "@/types/order";

export default function PaymentMethods() {
  const pathname = usePathname();
  const [user, loadingAuth] = useAuthState(auth);
  useRequireAuth(user ?? null, loadingAuth);
  const [profileData] = useProfileData(user ?? null);
  const { notification, notify, clearNotification } = useNotification();

  const {
    paymentMethods,
    loading: loadingPM,
    add,
    update,
    remove,
  } = usePaymentMethods();

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  if (loadingAuth) {
    return <Loading />;
  }

  const handleSetDefault = async (idx: number) => {
    const updated = paymentMethods.map((pm, i) => ({
      ...pm,
      isDefault: i === idx,
    }));
    await update(idx, { ...updated[idx], isDefault: true });
  };

  const handleRemoveConfirm = async () => {
    try {
      if (editingIndex !== null) {
        await remove(editingIndex);
        notify({
          type: "success",
          message: "Payment method removed!",
        });
      }
    } catch (e) {
      notify({
        type: "error",
        message: (e as Error).message || "Delete failed",
      });
    }
    setShowDelete(false);
  };

  return (
    <>
      <Navbar isScrolled isLoggedIn={!!user} />
      <AccountLayout pathname={pathname ?? ""} sideLinks={[]}>
        <WelcomeBlock
          firstName={(profileData as { firstName?: string })?.firstName}
          lastName={(profileData as { lastName?: string })?.lastName}
        />

        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            duration={notification.duration}
            onClose={clearNotification}
          />
        )}

        <div
          className="mt-6 space-y-4 text-sm text-gray-800"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          <h2
            className="text-2xl font-semibold"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            My Payment Methods
          </h2>
          <p>
            Save your payment methods to complete your purchase faster. You can
            set one as default and select it during checkout.
          </p>

          {loadingPM ? (
            <p>Loading payment methods…</p>
          ) : paymentMethods.length === 0 ? (
            <div className="flex items-center justify-between mt-4 py-2">
              <p className="text-sm text-gray-800">
                You have no saved payment methods. Please add one.
              </p>
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
            <div className="mt-4">
              <div className="flex items-center justify-between mt-4 py-2">
                <h3 className="text-sm font-medium mb-2">
                  You have {paymentMethods.length} saved{" "}
                  {paymentMethods.length > 1
                    ? "payment methods"
                    : "payment method"}
                </h3>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentMethods.map((pm, idx) => (
                  <PaymentMethodCard
                    key={pm.id}
                    paymentMethod={pm}
                    isDefault={pm.isDefault}
                    onSetDefault={() => handleSetDefault(idx)}
                    onRemove={() => {
                      setEditingIndex(idx);
                      setShowDelete(true);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <AddPaymentMethodModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            paymentMethodToEdit={
              editingIndex !== null ? paymentMethods[editingIndex] : undefined
            }
            paymentMethodIndex={editingIndex ?? undefined}
            onSave={async (newMethods: PaymentInfo[]) => {
              try {
                if (editingIndex === null) {
                  await add(newMethods[newMethods.length - 1]);
                  notify({ type: "success", message: "Payment method added!" });
                } else {
                  await update(editingIndex, newMethods[editingIndex]!);
                  notify({
                    type: "success",
                    message: "Payment method updated!",
                  });
                }
                setShowModal(false);
              } catch (e) {
                notify({
                  type: "error",
                  message: (e as Error).message || "Save failed",
                });
              }
            }}
          />

          <ConfirmModal
            isOpen={showDelete}
            title="Delete Payment Method"
            message="Are you sure you want to delete this payment method?"
            cancelLabel="No, keep it"
            confirmLabel="Yes, delete"
            onClose={() => setShowDelete(false)}
            onConfirm={handleRemoveConfirm}
          />
        </div>
      </AccountLayout>
      <Footer />
    </>
  );
}
