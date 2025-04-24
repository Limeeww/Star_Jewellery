import React from "react";
import { Controller, Control, FieldError, FieldValues } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface PhoneNumberFieldProps<TFieldValues extends FieldValues = FieldValues> {
  label: string;
  name: string;
  control: Control<TFieldValues>;
  defaultValue?: string;
  error?: FieldError;
}

function PhoneNumberField({
  label,
  name,
  control,
  defaultValue = "",
  error,
}: PhoneNumberFieldProps) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold mb-1">
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field: { onChange, value } }) => (
          <div>
            <PhoneInput
              country="de"
              value={value as string}
              onChange={onChange}
              enableSearch
              containerClass="w-full"
              inputClass="!border-0 !border-b !border-gray-300 !rounded-none !bg-transparent focus:!border-black !outline-none"
              buttonClass="!border-0 !border-b !border-gray-300 !bg-transparent !rounded-none"
              dropdownClass="!bg-white !border !border-gray-200"
              preferredCountries={["de", "us", "gb", "fr"]}
            />
            {error && (
              <p className="text-red-500 text-sm mt-1">{error.message}</p>
            )}
          </div>
        )}
      />
    </div>
  );
}

export default PhoneNumberField;
