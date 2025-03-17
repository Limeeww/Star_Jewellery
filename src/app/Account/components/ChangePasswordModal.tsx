// File: /components/ChangePasswordModal.tsx

"use client";

import React, { useState } from "react";
import { updatePassword } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

interface ChangePasswordModalProps {
  onClose: () => void;
}

export default function ChangePasswordModal({ onClose }: ChangePasswordModalProps) {
  // В реальном проекте можно также спросить "current password" и провести reAuth
  // Для примера берем только newPassword
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Для индикации "weak", "medium", "strong" можно дописать логику
  const [passwordStrength, setPasswordStrength] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Показать/скрыть пароль
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!newPassword || !confirmPassword) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (!auth.currentUser) {
      setErrorMsg("No authenticated user found.");
      return;
    }

    try {
      await updatePassword(auth.currentUser, newPassword);
      setSuccessMsg("Password updated successfully!");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update password.");
    }
  };

  // Пример простой проверки силы пароля
  const handlePasswordChange = (val: string) => {
    setNewPassword(val);

    // Примитивная логика для наглядности
    if (val.length < 8) {
      setPasswordStrength("Weak");
    } else if (val.match(/[A-Z]/) && val.match(/[0-9]/) && val.match(/[^a-zA-Z0-9]/)) {
      setPasswordStrength("Strong");
    } else {
      setPasswordStrength("Medium");
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
        <h2 className="text-xl font-semibold mb-4">Change Your Password</h2>

        {errorMsg && <p className="text-red-500 text-sm mb-2">{errorMsg}</p>}
        {successMsg && <p className="text-green-500 text-sm mb-2">{successMsg}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              New Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                className="w-full border p-2 pr-10"
                value={newPassword}
                onChange={(e) => handlePasswordChange(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-600 hover:text-gray-800"
                onClick={() => setShowNewPassword((prev) => !prev)}
              >
                {showNewPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>
            {/* Пример простого отображения силы пароля */}
            {newPassword && (
              <p className="text-sm mt-1">
                Password Strength:{" "}
                <span
                  className={
                    passwordStrength === "Weak"
                      ? "text-red-500"
                      : passwordStrength === "Medium"
                      ? "text-yellow-500"
                      : "text-green-500"
                  }
                >
                  {passwordStrength}
                </span>
              </p>
            )}
            <ul className="text-xs text-gray-600 mt-1 list-disc ml-4">
              <li>Your password must be 8 to 50 characters.</li>
              <li>Must include at least one digit.</li>
              <li>Must include uppercase and lowercase letters.</li>
              <li>Must include one of the following symbols: ...</li>
            </ul>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Confirm New Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="w-full border p-2 pr-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-600 hover:text-gray-800"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>
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
