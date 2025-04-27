"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { IoCloseOutline } from "react-icons/io5";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import SubmitButton from "@/app/components/FormComponents/SubmitButton";
import SelectField from "@/app/components/FormComponents/SelectField";
import CheckboxField from "@/app/components/FormComponents/CheckboxField";
import { useNotification } from "@/hooks/useNotification";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import { useAddresses } from "@/hooks/useAddresses";
import { useModalClose } from "@/hooks/useModal";
import { auth } from "@/firebase/firebaseConfig";
import type { PaymentInfo } from "@/types/order";
import type { Address } from "@/types/userTypes";
import Stripe from "stripe";

interface AddPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentInfoToEdit?: PaymentInfo;
  paymentInfoIndex?: number;
  onSave: (methods: PaymentInfo[]) => void;
}

type FormValues = {
  method: "credit_card"; // пока поддерживаем только кредитку
  billingAddress: Address;
  isDefault: boolean;
};

const DEFAULT_VALUES: Partial<FormValues> = {
  method: "credit_card",
  billingAddress: undefined as unknown as Address,
  isDefault: false,
};

export default function AddPaymentMethodModal({
  isOpen,
  onClose,
  paymentInfoToEdit,
  paymentInfoIndex,
  onSave,
}: AddPaymentMethodModalProps) {
  const { modalRef, handleOutsideClick } = useModalClose(onClose);
  const { notify } = useNotification();
  const stripe = useStripe();
  const elements = useElements();
  const { paymentMethods: existing } = usePaymentMethods();
  const { addresses, loading: loadingAddrs } = useAddresses();

  const {
    control,
    handleSubmit,
    reset,
    register,
    watch,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: DEFAULT_VALUES });

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const method = watch("method");

  useEffect(() => {
    if (!isOpen) {
      // при закрытии чистим секрет, чтобы при повторном открытии заново запросить
      setClientSecret(null);
      return;
    }

    // --- Открыли модалку ---
    // Сброс формы на исходные
    reset(paymentInfoToEdit ?? DEFAULT_VALUES);

    // Мы поддерживаем только кредитку, поэтому сразу запрашиваем SetupIntent
    auth.currentUser
      ?.getIdToken(true)
      .then((idToken) =>
        fetch("/api/stripe/setup-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        })
      )
      .then((r) => r.json())
      .then((data: { clientSecret: string }) => {
        setClientSecret(data.clientSecret);
      })
      .catch(() => {
        notify({
          type: "error",
          message: "Не удалось получить платежный токен",
        });
      });
  }, [isOpen, paymentInfoToEdit, reset, notify]);

  const onSubmit = async (data: FormValues) => {
    try {
      let newPM: PaymentInfo;
      if (data.method === "credit_card") {
        if (!stripe || !elements) throw new Error("Stripe not loaded");

        const { paymentMethod, error: pmError } =
          await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardElement)!,
            billing_details: {
              name: `${data.billingAddress.firstName} ${data.billingAddress.lastName}`,
            },
          });
        if (pmError || !paymentMethod)
          throw pmError || new Error("PM creation failed");

        const { setupIntent, error: siError } = await stripe.confirmCardSetup(
          clientSecret!,
          { payment_method: paymentMethod.id }
        );
        if (siError || !setupIntent) throw siError || new Error("Setup failed");

        const card = paymentMethod.card as unknown as Stripe.Card;
        newPM = {
          id: setupIntent.id,
          createdAt: new Date(setupIntent.created),
          method: "credit_card",
          billingAddress: data.billingAddress,
          isDefault: data.isDefault,
          paid: true,
          transactionId: "",
          cardToken: paymentMethod.id,
          cardNumberMasked: `**** **** **** ${card.last4}`,
          cardBrand: card.brand,
          cardExpiry: `${String(card.exp_month).padStart(2, "0")}/${String(
            card.exp_year
          ).slice(-2)}`,
          cardHolderName: paymentMethod.billing_details.name || "",
        };
      } else {
        throw new Error("PayPal/Klarna not supported here");
      }

      const updated = [...existing];
      if (paymentInfoIndex != null) updated[paymentInfoIndex] = newPM;
      else updated.push(newPM);
      onSave(updated);
      notify({ type: "success", message: "Payment method saved!" });
      onClose();
    } catch (e) {
      notify({
        type: "error",
        message: e instanceof Error ? e.message : "Save failed",
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOutsideClick}
        >
          <motion.div
            className="bg-white p-6 rounded-md shadow-md w-full max-w-lg relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <IoCloseOutline size={24} />
            </button>
            <h2 className="text-xl font-semibold mb-4">
              {paymentInfoToEdit ? "Edit Payment Method" : "Add New Card"}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Billing Address */}
              <Controller
                name="billingAddress"
                control={control}
                rules={{ required: "Выберите адрес" }}
                render={({ field, fieldState }) =>
                  loadingAddrs ? (
                    <p>Loading addresses…</p>
                  ) : (
                    <SelectField
                      label="Billing Address"
                      id="billingAddress"
                      value={field.value?.addressLabel || ""}
                      onChange={(lbl) => {
                        const addr = addresses.find(
                          (a) => a.addressLabel === lbl
                        );
                        field.onChange(addr!);
                      }}
                      options={addresses.map((a) => ({
                        value: a.addressLabel || "",
                        label: a.addressLabel || `${a.street}, ${a.city}`,
                      }))}
                      error={fieldState.error?.message}
                    />
                  )
                }
              />

              {/* Set as default */}
              <CheckboxField
                label="Set as default"
                id="isDefault"
                register={register("isDefault")}
              />

              {/* Stripe Card Element */}
              {!clientSecret ? (
                <p>Loading…</p>
              ) : (
                <div className="p-4 border rounded">
                  <CardElement options={{ hidePostalCode: true }} />
                </div>
              )}

              <SubmitButton label="Confirm" isLoading={!clientSecret} />
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
