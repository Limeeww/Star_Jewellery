"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);

  const { onChange, name, ref } = register;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value: string) => {
    setSelected(value);
    setIsOpen(false);
    if (onChange && name) {
      onChange({
        target: { name, value },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <div className={className} ref={containerRef}>
      <label htmlFor={id} className="block text-sm font-semibold mb-1">
        {label}
      </label>
      <div className="relative">
        <button
          id={id}
          type="button"
          className={`w-full border-b border-gray-300 py-2 text-left focus:outline-none ${
            error ? "border-red-500" : ""
          } flex items-center justify-between`}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span>
            {selected
              ? options.find((opt) => opt.value === selected)?.label
              : placeholder}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-4 h-4 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 15l7-7 7 7"
            />
          </svg>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-10 w-full bg-white shadow-lg border border-gray-200 mt-1"
            >
              {options.map((opt, index) => (
                <div
                  key={index}
                  onClick={() => handleSelect(opt.value)}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                >
                  {opt.label}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
      <input type="hidden" name={name} value={selected} ref={ref} />
    </div>
  );
}

export default SelectField;
