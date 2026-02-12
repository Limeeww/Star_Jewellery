import React from "react";

interface SubmitButtonProps {
  label: React.ReactNode;
  isLoading?: boolean;
  className?: string;
}

function SubmitButton({
  label,
  isLoading = false,
  className = "",
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className={`w-full bg-black text-white text-sm font-medium px-4 py-2 hover:bg-gray-800 transition-colors ${className}`}
    >
      {isLoading ? "Loading..." : label}
    </button>
  );
}

export default SubmitButton;
