import { useState } from "react";

interface InputFieldProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: "text" | "number";
  required?: boolean;
  placeholder?: string;
}

export default function InputField({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder = "",
}: InputFieldProps) {
  const [touched, setTouched] = useState(false);

  const showError = required && touched && (value === "" || value === 0);

  return (
    <div className="space-y-1">
      <label className="block text-m font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setTouched(true)}
        className={`w-full border border-gray-300 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-500 ${
          showError ? "border-red-500 ring-red-500" : ""
        }`}
      />
      {showError && (
        <p className="text-sm text-red-600 mt-1">This field is required</p>
      )}
    </div>
  );
}
