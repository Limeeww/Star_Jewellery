import React from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface TextFieldProps {
  label: string;
  id: string;
  register: UseFormRegisterReturn; 
  error?: FieldError;
  type?: string; 
  className?: string;
}

function TextField({
  label,
  id,
  register,
  error,
  type = "text",
  className = "",
}: TextFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-semibold mb-1">
        {label}
      </label>
      <input
        id={id}
        type={type}
        className={`w-full border p-2 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        {...register}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
}

export default TextField;
