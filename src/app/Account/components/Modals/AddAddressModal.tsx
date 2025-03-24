"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { IoCloseOutline } from "react-icons/io5";
import TextField from "@/app/components/FormComponents/TextField";
import SelectField from "@/app/components/FormComponents/SelectField";
import CheckboxField from "@/app/components/FormComponents/CheckboxField";
import PhoneNumberField from "@/app/components/FormComponents/PhoneNumberField";
import SubmitButton from "@/app/components/FormComponents/SubmitButton";
import Notification from "@/app/components/MessageHandling/Notification";
import { useModalClose } from "../../../utils/useModal";
import { useNotification } from "../../../utils/useNotification";
import { updateUserProfile, fetchUserData } from "../../../utils/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebaseConfig";
import { Address } from "@/app/types/userTypes";

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;

  addressToEdit?: Address | null;
  addressIndex?: number | null;
}

export default function AddAddressModal({
  isOpen,
  onClose,
  addressToEdit,
  addressIndex,
}: AddAddressModalProps) {
  const { modalRef, handleOutsideClick } = useModalClose(onClose);
  const { notification, notify, clearNotification } = useNotification();
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<Address>({
    defaultValues: {
      street: "",
      city: "",
      zipCode: "",
      country: "",
    },
  });
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (isOpen && addressToEdit) {
      reset(addressToEdit);
    } else if (isOpen && !addressToEdit) {
      reset({
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
      });
    }
  }, [isOpen, addressToEdit, reset]);

  const onSubmit = async (data: Address) => {
    if (!user) {
      notify({ message: "No user is logged in.", type: "error" });
      return;
    }
    try {
      const userData = await fetchUserData(user.uid);
      if (!userData) {
        notify({ message: "User document not found.", type: "error" });
        return;
      }

      const addresses = userData.addresses ? [...userData.addresses] : [];

      if (addressIndex !== null && addressIndex !== undefined) {
        addresses[addressIndex] = data;
        notify({ message: "Address updated successfully!", duration:3000, type: "success" });
        await updateUserProfile(user.uid, { addresses });
      } else {
        addresses.push(data);
        notify({ message: "Address added successfully!", duration:3000, type: "success" });
        await updateUserProfile(user.uid, { addresses });
      }

      reset();
      onClose();
    } catch (err: any) {
      notify({
        message: err.message || "Failed to save address.",
        type: "error",
      });
    }
  };

  const modalTitle =
    addressIndex !== null && addressIndex !== undefined
      ? "Edit Address"
      : "Add New Address";

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
            className="bg-white p-6 m-0 rounded-md shadow-md w-full max-w-md relative h-full md:h-auto"
            ref={modalRef}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            {notification && (
              <Notification
                message={notification.message}
                type={notification.type}
                duration={3000}
                onClose={clearNotification}
              />
            )}

            <button
              onClick={onClose}
              className="absolute top-6 right-4 text-gray-500 hover:text-gray-700"
            >
              <IoCloseOutline size={24} />
            </button>

            <h2
              className="text-xl font-semibold mb-4"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {modalTitle}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Title */}
              <SelectField
                label="Title"
                id="title"
                register={register("title", { required: "Title is required" })}
                error={errors.title}
                options={[
                  { value: "Mr", label: "Mr" },
                  { value: "Mrs", label: "Mrs" },
                ]}
              />

              <TextField
                label="Address Label"
                id="addressLabel"
                register={register("addressLabel", {
                  required: "Address label is required",
                })}
                error={errors.addressLabel}
              />

              <TextField
                label="First Name"
                id="firstName"
                register={register("firstName", {
                  required: "First name is required",
                })}
                error={errors.firstName}
              />

              <TextField
                label="Last Name"
                id="lastName"
                register={register("lastName", {
                  required: "Last name is required",
                })}
                error={errors.lastName}
              />

              <div className="flex gap-4">
                <TextField
                  label="Street"
                  id="street"
                  register={register("street", {
                    required: "Street is required",
                  })}
                  error={errors.street}
                  className="w-1/2"
                />
                <TextField
                  label="House Number"
                  id="houseNumber"
                  register={register("houseNumber", {
                    required: "House number is required",
                  })}
                  error={errors.houseNumber}
                  className="w-1/2"
                />
              </div>

              <TextField
                label="Additional Address Info"
                id="additionalInfo"
                register={register("additionalInfo")}
                error={errors.additionalInfo}
              />

              <TextField
                label="City"
                id="city"
                register={register("city", { required: "City is required" })}
                error={errors.city}
              />

              <TextField
                label="State"
                id="state"
                register={register("state")}
                error={errors.state}
              />

              <TextField
                label="Zip Code"
                id="zipCode"
                register={register("zipCode", {
                  required: "Zip code is required",
                })}
                error={errors.zipCode}
              />

              <TextField
                label="Country"
                id="country"
                register={register("country", {
                  required: "Country is required",
                })}
                error={errors.country}
              />

              <PhoneNumberField
                label="Mobile"
                name="mobile"
                control={control}
                error={errors.mobile}
              />

              <div className="flex flex-col space-y-2">
                <CheckboxField
                  label="Preferred Shipping Address"
                  id="preferredShippingAddress"
                  register={register("preferredShippingAddress")}
                  error={undefined}
                />

                <CheckboxField
                  label="Preferred Billing Address"
                  id="preferredBillingAddress"
                  register={register("preferredBillingAddress")}
                  error={undefined}
                />
              </div>

              <SubmitButton label="CONFIRM" />
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
