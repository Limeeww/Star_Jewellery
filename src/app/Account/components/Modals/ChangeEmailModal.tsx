"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  fetchSignInMethodsForEmail,
  onAuthStateChanged,
  verifyBeforeUpdateEmail,
} from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";

import { auth, db } from "@/firebase/firebaseConfig";

import { IoCloseOutline } from "react-icons/io5";
import TextField from "@/app/components/FormComponents/TextField";
import SubmitButton from "@/app/components/FormComponents/SubmitButton";
import Notification from "../../../components/MessageHandling/Notification";

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

  const modalRef = useRef<HTMLDivElement>(null);

  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "info" | "warning" | "error";
  } | null>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { email: user.email }, { merge: true });
    }
  });

  const isEmailTaken = async (email: string) => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const onSubmit = async (data: ChangeEmailForm) => {
    if (!auth.currentUser) {
      setNotification({
        message: "User document not found.",
        type: "error",
      });
      return;
    }

    if (data.newEmail !== data.confirmEmail) {
      setNotification({
        message: "Emails do not match.",
        type: "error",
      });
      return;
    }

    try {
      const emailExists = await isEmailTaken(data.newEmail);
      if (emailExists) {
        setNotification({
          message: "This email is already in use.",
          type: "error",
        });
        return;
      }

      const signInMethods = await fetchSignInMethodsForEmail(
        auth,
        data.newEmail
      );
      if (signInMethods.length > 0) {
        setNotification({
          message: "This email is already in use.",
          type: "error",
        });
        return;
      }

      await verifyBeforeUpdateEmail(auth.currentUser, data.newEmail);

      setNotification({
        message: "Verification email sent! Please check your inbox.",
        type: "info",
      });

      reset();

      onClose();
    } catch (err: any) {
      setNotification({
        message: err.message || "Failed to update email.",
        type: "error",
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
            className="bg-white p-3 rounded-md shadow-md w-full max-w-md relative h-full md:h-auto"
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
                onClose={() => setNotification(null)}
              />
            )}

            <button
              onClick={onClose}
              className="absolute top-4 right-2 text-gray-500 hover:text-gray-700"
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
