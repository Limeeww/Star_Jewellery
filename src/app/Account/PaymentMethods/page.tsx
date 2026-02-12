"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebaseConfig";
import { useRequireAuth } from "@/hooks/index";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import Navbar from "@/app/components/Navbar/Navbar";
import Loading from "@/app/components/Loading/Loading";
import Footer from "@/app/components/Footer/Footer";
import AccountPageLayout from "@/app/Account/components/AccountPageLayout";
import LinkButton from "@/app/Account/components/LinkButton";
import PaymentMethodCard from "@/app/Account/components/PaymentMethodCard";
import Notification from "@/app/components/MessageHandling/Notification";
import { useNotification } from "@/hooks/useNotification";
import dynamic from "next/dynamic";
import type { PaymentInfo } from "@/types/order";

const AddPaymentMethodModal = dynamic(
  () => import("@/app/Account/components/Modals/AddPaymentMethodModal"),
  { ssr: false }
);
const ConfirmModal = dynamic(
  () => import("@/app/components/MessageHandling/ConfirmModal"),
  { ssr: false }
);

type ModalState =
  | { type: "add" | "edit"; index: number | null }
  | { type: "delete"; index: number };

export default function PaymentMethods() {
  const [user, loadingAuth] = useAuthState(auth);
  useRequireAuth(user ?? null, loadingAuth);

  const { notification, notify, clearNotification } = useNotification();
  const {
    paymentMethods,
    loading: loadingPM,
    add,
    update,
    remove,
  } = usePaymentMethods();

  const [modal, setModal] = useState<ModalState | null>(null);

  const handleSetDefault = useCallback(
    async (idx: number) => {
      const updated = paymentMethods.map((pm, i) => ({
        ...pm,
        isDefault: i === idx,
      }));
      await update(idx, { ...updated[idx], isDefault: true });
    },
    [paymentMethods, update]
  );

  const handleRemoveConfirm = useCallback(async () => {
    if (modal?.type === "delete") {
      try {
        await remove(modal.index);
        notify({ type: "success", message: "Payment method removed!" });
      } catch (e) {
        notify({
          type: "error",
          message: (e as Error).message || "Delete failed",
        });
      }
      setModal(null);
    }
  }, [modal, remove, notify]);

  const methodsList = useMemo(
    () =>
      paymentMethods.map((pm, idx) => (
        <PaymentMethodCard
          key={pm.id}
          paymentMethod={pm}
          isDefault={pm.isDefault}
          onSetDefault={() => handleSetDefault(idx)}
          onRemove={() => setModal({ type: "delete", index: idx })}
        />
      )),
    [paymentMethods, handleSetDefault]
  );

  if (loadingAuth) return <Loading />;

  return (
    <>
      <Navbar isScrolled isLoggedIn={!!user} />
      <AccountPageLayout
        sideLinks={[]}
        title="My Payment Methods"
        description={
          <p>
            Save your payment methods to complete your purchase faster. You can
            set one as default and select it during checkout.
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

        {loadingPM ? (
          <p>Loading payment methods…</p>
        ) : paymentMethods.length === 0 ? (
          <div className="flex items-center justify-between mt-4 py-2">
            <p className="text-sm text-gray-800">
              You have no saved payment methods. Please add one.
            </p>
            <LinkButton
              text="Add new payment method"
              onClick={() => setModal({ type: "add", index: null })}
              className="underline text-sm cursor-pointer"
              showArrow
            />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mt-4 py-2">
              <h3 className="text-sm font-medium mb-2">
                You have {paymentMethods.length} saved{" "}
                {paymentMethods.length > 1
                  ? "payment methods"
                  : "payment method"}
              </h3>
              <LinkButton
                text="Add new payment method"
                onClick={() => setModal({ type: "add", index: null })}
                className="underline text-sm cursor-pointer"
                showArrow
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {methodsList}
            </div>
          </>
        )}

        {modal && modal.type !== "delete" && (
          <AddPaymentMethodModal
            isOpen
            onClose={() => setModal(null)}
            paymentMethodToEdit={
              modal.type === "edit" ? paymentMethods[modal.index!] : undefined
            }
            onSave={async (newMethods: PaymentInfo[]) => {
              try {
                if (modal.type === "add") {
                  await add(newMethods[newMethods.length - 1]);
                  notify({ type: "success", message: "Payment method added!" });
                } else {
                  await update(modal.index!, newMethods[modal.index!]!);
                  notify({
                    type: "success",
                    message: "Payment method updated!",
                  });
                }
                setModal(null);
              } catch (e) {
                notify({
                  type: "error",
                  message: (e as Error).message || "Save failed",
                });
              }
            }}
          />
        )}
        {modal?.type === "delete" && (
          <ConfirmModal
            isOpen
            title="Delete Payment Method"
            message="Are you sure you want to delete this payment method?"
            cancelLabel="No, keep it"
            confirmLabel="Yes, delete"
            onClose={() => setModal(null)}
            onConfirm={handleRemoveConfirm}
          />
        )}
      </AccountPageLayout>
      <Footer />
    </>
  );
}
