
"use client";

import React, { useState } from "react";
import { updateEmail } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
// import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; // если нужно

interface ChangeEmailModalProps {
  currentEmail: string;
  onClose: () => void;
}

export default function ChangeEmailModal({
  currentEmail,
  onClose,
}: ChangeEmailModalProps) {
  const [newEmail, setNewEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!newEmail || !confirmEmail) {
      setErrorMsg("Please fill in both fields.");
      return;
    }

    if (newEmail !== confirmEmail) {
      setErrorMsg("Emails do not match.");
      return;
    }

    try {
      if (!auth.currentUser) {
        setErrorMsg("No authenticated user found.");
        return;
      }
      // Меняем email в Firebase Auth
      await updateEmail(auth.currentUser, newEmail);
      setSuccessMsg("Email updated successfully!");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update email.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Модальное окно */}
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          X
        </button>
        <h2 className="text-xl font-semibold mb-4">Enter a new email for your account</h2>

        <p className="text-sm mb-4">
          Current Email: <strong>{currentEmail}</strong>
        </p>

        {errorMsg && <p className="text-red-500 text-sm mb-2">{errorMsg}</p>}
        {successMsg && <p className="text-green-500 text-sm mb-2">{successMsg}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">
              New Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              className="w-full border p-2"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Confirm New Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              className="w-full border p-2"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-black text-white px-4 py-2 mt-2 hover:bg-gray-800 transition-colors"
          >
            SUBMIT
          </button>
        </form>
      </div>
    </div>
  );
}
