import React from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface SelectFieldProps {
  label: string;
  id: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}

function SelectField({
  label,
  id,
  register,
  error,
  options,
  placeholder = "Select an option",
  className = "",
}: SelectFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-semibold mb-1">
        {label}
      </label>
      <select
        id={id}
        className={`w-full border-b border-gray-300 p-2 focus:outline-none focus:border-black bg-transparent ${
          error ? "border-red-500" : ""
        }`}
        {...register}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
}

export default SelectField;
