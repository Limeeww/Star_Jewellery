"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";

import PasswordField from "@/app/components/FormComponents/PasswordField";
import SubmitButton from "@/app/components/FormComponents/SubmitButton";
import { IoCloseOutline } from "react-icons/io5";
import PasswordStrengthChecker from "@/app/components/PasswordStrengthChecker/PasswordStrengthChecker";
import Notification from "../../../components/MessageHandling/Notification";
import { useNotification } from "@/hooks/useNotification";
import { useModalClose } from "@/hooks/useModal";

interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({
  isOpen,
  onClose,
}: ChangePasswordModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<ChangePasswordForm>();
  const { modalRef, handleOutsideClick } = useModalClose(onClose);
  const { notification, notify, clearNotification } = useNotification();

  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const newPasswordValue = watch("newPassword") || "";

  const onSubmit = async (data: ChangePasswordForm) => {
    if (!auth.currentUser) {
      notify({ message: "No authenticated user found.", type: "error" });
      return;
    }

    if (!auth.currentUser.email) {
      notify({
        message: "Current user has no email on record.",
        type: "error",
      });
      return;
    }

    if (data.currentPassword === data.newPassword) {
      notify({
        message:
          "Your new password cannot be the same as your current password.",
        type: "error",
      });
      return;
    }

    if (data.newPassword !== data.confirmPassword) {
      notify({ message: "New passwords do not match.", type: "error" });
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        data.currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, data.newPassword);
      notify({ message: "Password updated successfully!", type: "success" });

      reset();
      onClose();
    } catch (err: any) {
      notify({
        message: err.message || "Failed to update password.",
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
            ref={modalRef}
            className="bg-white p-6 rounded-md shadow-md w-full max-w-md relative h-full md:h-auto"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            {notification && (
              <Notification {...notification} onClose={clearNotification} />
            )}

            <button
              onClick={onClose}
              className="absolute top-6 
               right-2 text-gray-500 hover:text-gray-700"
            >
              <IoCloseOutline size={24} />
            </button>

            <h2
              className="text-xl font-semibold mb-4"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Change Your Password
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <PasswordField
                label="Current Password"
                id="currentPassword"
                register={register("currentPassword", {
                  required: "Please enter your current password.",
                })}
                error={errors.currentPassword}
              />

              <PasswordField
                label="New Password"
                id="newPassword"
                register={register("newPassword", {
                  required: "Please enter a new password.",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters long.",
                  },
                })}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                error={errors.newPassword}
              />

              <PasswordStrengthChecker
                password={newPasswordValue}
                isFocused={isPasswordFocused || !!newPasswordValue}
              />

              <PasswordField
                label="Confirm New Password"
                id="confirmPassword"
                register={register("confirmPassword", {
                  required: "Please confirm your new password.",
                })}
                error={errors.confirmPassword}
              />

              <SubmitButton label="SUBMIT" />
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
