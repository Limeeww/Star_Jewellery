import React from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface CheckboxFieldProps {
  label: string;
  id: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  className?: string;
}

function CheckboxField({
  label,
  id,
  register,
  error,
  className = "",
}: CheckboxFieldProps) {
  return (
    <div className={`flex items-start gap-2 ${className}`}>
      <input id={id} type="checkbox" className="mt-1" {...register} />
      <label htmlFor={id} className="text-sm text-gray-600">
        {label}
      </label>
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
}

export default CheckboxField;
