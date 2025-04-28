"use client";

import React, { useCallback, useMemo } from "react";
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
import type { PaymentInfo } from "@/types/order";
import type { Address } from "@/types/userTypes";
import Stripe from "stripe";
import { useSetupIntent } from "@/hooks";

interface AddPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentInfoToEdit?: PaymentInfo;
  paymentInfoIndex?: number;
  paymentMethodToEdit?: PaymentInfo;
  onSave: (methods: PaymentInfo[]) => void;
}

type FormValues = {
  method: "credit_card";
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
    register,
    formState: { isSubmitting },
  } = useForm<FormValues>({ defaultValues: DEFAULT_VALUES });

  const preferredAddr = useMemo(
    () => addresses.find((a) => a.preferredBillingAddress) ?? null,
    [addresses]
  );

  const { clientSecret, loading: loadingSecret } = useSetupIntent(isOpen);

  const isLoading = loadingAddrs || loadingSecret || isSubmitting;
  const onSubmit = useCallback(
    async (data: FormValues) => {
      if (!stripe || !elements) {
        notify({ type: "error", message: "Stripe was not loaded" });
        return;
      }

      try {
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
          {
            payment_method: paymentMethod.id,
          }
        );
        if (siError || !setupIntent) throw siError || new Error("Setup failed");

        const card = paymentMethod.card as unknown as Stripe.Card;
        const newPM: PaymentInfo = {
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
    },
    [
      stripe,
      elements,
      clientSecret,
      existing,
      paymentInfoIndex,
      onSave,
      notify,
      onClose,
    ]
  );

  const BillingSelect = useMemo(
    () => (
      <Controller
        name="billingAddress"
        control={control}
        rules={{ required: "Choose the address" }}
        render={({ field, fieldState }) =>
          loadingAddrs ? (
            <p>Loading addresses…</p>
          ) : (
            <SelectField
              label="Billing Address"
              id="billingAddress"
              value={preferredAddr?.addressLabel ?? ""}
              onChange={(lbl) => {
                const addr = addresses.find((a) => a.addressLabel === lbl);
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
    ),
    [control, loadingAddrs, preferredAddr?.addressLabel, addresses]
  );

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
              {BillingSelect}

              <CheckboxField
                label="Set as default"
                id="isDefault"
                register={register("isDefault")}
              />

              {!clientSecret ? (
                <p>Loading…</p>
              ) : (
                <div className="p-4 border rounded">
                  <CardElement options={{ hidePostalCode: true }} />
                </div>
              )}

              <SubmitButton label="Confirm" isLoading={isLoading} />
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
