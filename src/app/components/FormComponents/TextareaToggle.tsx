// app/components/FormComponents/TextareaToggle.tsx
"use client";

import React, { useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface TextareaToggleProps {
  registration: UseFormRegisterReturn;
  placeholder?: string;
  maxLength?: number;
}

export default function TextareaToggle({
  registration,
  placeholder = "Personal message (optional)",
  maxLength = 300,
}: TextareaToggleProps) {
  const [text, setText] = useState("");
  const remaining = maxLength - text.length;

  return (
    <div className="mt-2 space-y-1">
      <textarea
        {...registration}
        value={text}
        onChange={(e) => {
          if (e.target.value.length <= maxLength) {
            setText(e.target.value);
            registration.onChange(e);   
          }
        }}
        placeholder={placeholder}
        className="w-full h-32 px-3 py-2 border border-gray-300 rounded
                   focus:outline-none focus:ring-2 focus:ring-gray-500 resize-none"
      />
      <p className="text-xs text-gray-500">{remaining} characters remaining</p>
    </div>
  );
}
