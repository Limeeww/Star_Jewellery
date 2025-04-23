"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  fetchSignInMethodsForEmail,
  verifyBeforeUpdateEmail,
} from "firebase/auth";

import { auth } from "@/firebase/firebaseConfig";

import { IoCloseOutline } from "react-icons/io5";
import TextField from "@/app/components/FormComponents/TextField";
import SubmitButton from "@/app/components/FormComponents/SubmitButton";
import Notification from "../../../components/MessageHandling/Notification";
import { isEmailTaken, useSyncUserEmail } from "@/app/utils/auth";
import { useModalClose } from "@/hooks/useModal";
import { useNotification } from "@/hooks/useNotification";

interface ChangeEmailForm {
  newEmail: string;
  confirmEmail: string;
}

interface ChangeEmailModalProps {
  currentEmail: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangeEmailModal({
  currentEmail,
  isOpen,
  onClose,
}: ChangeEmailModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangeEmailForm>();
  const { modalRef, handleOutsideClick } = useModalClose(onClose);
  const { notification, notify, clearNotification } = useNotification();

  useSyncUserEmail();

  const onSubmit = async (data: ChangeEmailForm) => {
    if (!auth.currentUser) {
      notify({ message: "User document not found.", type: "error" });
      return;
    }

    if (data.newEmail !== data.confirmEmail) {
      notify({ message: "Emails do not match.", type: "error" });
      return;
    }

    try {
      const emailExists = await isEmailTaken(data.newEmail);
      if (emailExists) {
        notify({ message: "This email is already in use.", type: "error" });
        return;
      }

      const signInMethods = await fetchSignInMethodsForEmail(
        auth,
        data.newEmail
      );
      if (signInMethods.length > 0) {
        notify({ message: "This email is already in use.", type: "error" });
        return;
      }

      await verifyBeforeUpdateEmail(auth.currentUser, data.newEmail);
      notify({
        message: "Verification email sent! Please check your inbox.",
        type: "info",
      });

      reset();
      onClose();
    } catch (err: any) {
      notify({
        message: err.message || "Failed to update email.",
        type: "error",
      });
    }
  };

  if (!isOpen) return null;

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
            className="bg-white p-6 rounded-md shadow-md w-full max-w-md relative h-full md:h-auto"
            ref={modalRef}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            {notification && (
              <Notification {...notification} onClose={clearNotification} />
            )}

            <button
              onClick={onClose}
              className="absolute top-6 right-2 text-gray-500 hover:text-gray-700"
            >
              <IoCloseOutline size={24} />
            </button>

            <h2
              className="text-xl font-semibold mb-4"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Enter a new email for your account
            </h2>
            <p className="text-sm mb-4">
              Current Email: <strong>{currentEmail}</strong>
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <TextField
                label="New Email Address"
                id="newEmail"
                type="email"
                register={register("newEmail", {
                  required: "Please enter your new email.",
                })}
                error={errors.newEmail}
              />
              <TextField
                label="Confirm New Email Address"
                id="confirmEmail"
                type="email"
                register={register("confirmEmail", {
                  required: "Please confirm your new email.",
                })}
                error={errors.confirmEmail}
              />

              <SubmitButton label="SUBMIT" />
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
