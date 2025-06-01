"use client";

import { useState } from "react";

interface InputFieldProps {
  min?: number;
  max?: number;
  label?: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: "text" | "number" | "datetime-local";
  required?: boolean;
  placeholder?: string;
}

export default function InputField({
  min,
  max,
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder = "",
}: InputFieldProps) {
  const [touched, setTouched] = useState(false);

  const safeValue =
    type === "number"
      ? typeof value === "number" && isNaN(value)
        ? ""
        : String(value)
      : String(value);

  const isEmpty = safeValue.trim() === "";
  const showEmptyError = required && touched && isEmpty;

  return (
    <div className="space-y-1 w-full">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        min={min}
        max={max}
        type={type}
        value={safeValue}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setTouched(true)}
        className={`border border-gray-300 p-2 text-m
          focus:outline-none focus:ring-1 focus:ring-black rounded-none w-full 
          ${showEmptyError ? "border-red-500 ring-red-500" : ""}
        `}
      />

      {showEmptyError && (
        <p className="text-sm text-red-600 mt-1">This field can not be empty</p>
      )}
    </div>
  );
}
