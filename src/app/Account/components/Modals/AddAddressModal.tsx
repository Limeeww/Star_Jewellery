"use client";

import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { IoCloseOutline } from "react-icons/io5";
import TextField from "@/app/components/FormComponents/TextField";
import SelectField from "@/app/components/FormComponents/SelectField";
import CheckboxField from "@/app/components/FormComponents/CheckboxField";
import PhoneNumberField from "@/app/components/FormComponents/PhoneNumberField";
import SubmitButton from "@/app/components/FormComponents/SubmitButton";
import { useModalClose } from "@/hooks/useModal";
import { useNotification } from "@/hooks/useNotification";
import type { Address } from "@/types/userTypes";

const DEFAULT_VALUES: Address = {
  title: "Mr",
  addressLabel: "",
  firstName: "",
  lastName: "",
  street: "",
  houseNumber: "",
  additionalInfo: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
  mobile: "",
  preferredShippingAddress: false,
  preferredBillingAddress: false,
};

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  addressToEdit?: Address;
  addressIndex?: number;
  onUpdate: (index: number, address: Address) => Promise<void>;
  onAdd: (address: Address) => Promise<void>;
}

export default function AddAddressModal({
  isOpen,
  onClose,
  addressToEdit,
  addressIndex,
  onUpdate,
  onAdd,
}: AddAddressModalProps) {
  const { modalRef, handleOutsideClick } = useModalClose(onClose);
  const { notify } = useNotification();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<Address>({
    defaultValues: addressToEdit || DEFAULT_VALUES,
  });

  useEffect(() => {
    if (isOpen) {
      reset(addressToEdit || DEFAULT_VALUES);
    }
  }, [isOpen, addressToEdit, reset]);

  const onSubmit = async (data: Address) => {
    try {
      if (addressIndex != null) {
        await onUpdate(addressIndex, data);
        notify({ type: "success", message: "Address updated!" });
      } else {
        await onAdd(data);
        notify({ type: "success", message: "Address added!" });
      }
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
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-6 rounded-md shadow-md w-full max-w-md relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-4 text-gray-500 hover:text-gray-700"
            >
              <IoCloseOutline size={24} />
            </button>

            <h2 className="text-xl font-semibold mb-4">
              {addressToEdit ? "Edit Address" : "Add New Address"}
            </h2>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 text-sm"
            >
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <SelectField
                    label="Title"
                    id="title"
                    value={field.value || ""}
                    onChange={field.onChange}
                    options={[
                      { value: "Mr", label: "Mr" },
                      { value: "Mrs", label: "Mrs" },
                    ]}
                  />
                )}
              />

              <TextField
                label="Address Label"
                id="addressLabel"
                register={register("addressLabel", {
                  required: "Label is required",
                })}
                error={errors.addressLabel}
              />

              <div className="flex gap-4">
                <TextField
                  label="First Name"
                  id="firstName"
                  register={register("firstName", {
                    required: "First name is required",
                  })}
                  error={errors.firstName}
                  className="flex-1"
                />
                <TextField
                  label="Last Name"
                  id="lastName"
                  register={register("lastName", {
                    required: "Last name is required",
                  })}
                  error={errors.lastName}
                  className="flex-1"
                />
              </div>

              <div className="flex gap-4">
                <TextField
                  label="Street"
                  id="street"
                  register={register("street", {
                    required: "Street is required",
                  })}
                  error={errors.street}
                  className="flex-1"
                />
                <TextField
                  label="House No."
                  id="houseNumber"
                  register={register("houseNumber", {
                    required: "House number is required",
                  })}
                  error={errors.houseNumber}
                  className="w-1/3"
                />
              </div>

              <TextField
                label="Additional Info"
                id="additionalInfo"
                register={register("additionalInfo")}
                error={errors.additionalInfo}
              />

              <div className="flex gap-4">
                <TextField
                  label="City"
                  id="city"
                  register={register("city", {
                    required: "City is required",
                  })}
                  error={errors.city}
                  className="flex-1"
                />
                <TextField
                  label="State"
                  id="state"
                  register={register("state")}
                  error={errors.state}
                  className="flex-1"
                />
              </div>

              <div className="flex gap-4">
                <TextField
                  label="Zip Code"
                  id="zipCode"
                  register={register("zipCode", {
                    required: "Zip code is required",
                  })}
                  error={errors.zipCode}
                  className="flex-1"
                />
                <TextField
                  label="Country"
                  id="country"
                  register={register("country", {
                    required: "Country is required",
                  })}
                  error={errors.country}
                  className="flex-1"
                />
              </div>

              <PhoneNumberField
                label="Mobile"
                name="mobile"
                control={control}
                error={errors.mobile}
              />

              <div className="flex flex-col space-y-2">
                <CheckboxField
                  label="Preferred Shipping"
                  id="preferredShippingAddress"
                  register={register("preferredShippingAddress")}
                />
                <CheckboxField
                  label="Preferred Billing"
                  id="preferredBillingAddress"
                  register={register("preferredBillingAddress")}
                />
              </div>

              <SubmitButton
                label={addressToEdit ? "Update Address" : "Add Address"}
                isLoading={isSubmitting}
              />
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
