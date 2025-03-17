import React, { useState } from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";


interface PasswordFieldProps {
  label: string;
  id: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  className?: string;
  onFocus?: () => void;
}

function PasswordField({
  label,
  id,
  register,
  error,
  className = "",
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-semibold mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          className={`w-full border p-2 pr-10 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          {...register}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-3 text-gray-600 hover:text-gray-800"
        >
          {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
}

export default PasswordField;
