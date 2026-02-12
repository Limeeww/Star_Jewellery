"use client";

import React, { useState, useEffect } from "react";
import { autoUpdate, flip, offset, useFloating } from "@floating-ui/react-dom";

interface SelectFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
  error?: string;
}

export default function SelectField({
  label,
  id,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  className = "",
  error,
}: SelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles } = useFloating({
    placement: "bottom-start",
    middleware: [offset(4), flip()],
    whileElementsMounted: autoUpdate,
    strategy: "absolute",
  });

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        refs.reference.current &&
        refs.floating.current &&
        !(refs.reference.current as HTMLElement).contains(e.target as Node) &&
        !(refs.floating.current as HTMLElement).contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [refs.reference, refs.floating]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className={`${className} `}>
      <label htmlFor={id} className="block text-sm font-semibold mb-1">
        {label}
      </label>

      <button
        ref={refs.setReference}
        id={id}
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className={`w-full border-b border-gray-300 py-2 text-left flex justify-between items-center ${
          error ? "border-red-500" : ""
        }`}
      >
        <span>
          {value
            ? options.find((opt) => opt.value === value)?.label
            : placeholder}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          ref={refs.setFloating}
          style={{
            ...floatingStyles,
            width: (refs.reference.current as HTMLElement)?.offsetWidth,
          }}
          className="bg-white rounded shadow-lg border border-gray-200 z-20"
        >
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
