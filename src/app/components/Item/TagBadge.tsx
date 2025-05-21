import React from "react";
import clsx from "clsx";
import type { ProductTag } from "@/types/product";

interface TagBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: ProductTag;
}

const variantStyles: Record<string, string> = {
  default: "bg-gray-200 text-gray-800", 
  "must-have": "bg-red-600 text-white",
  new: "bg-green-600 text-white",
  exclusive: "bg-yellow-500 text-black",
  sale: "bg-blue-500 text-white",
};

export default function TagBadge({
  children,
  variant,
  className,
  ...props
}: TagBadgeProps) {
  const key = variant ?? "default";

  return (
    <span
      className={clsx(
        "inline-block px-2 py-1 text-xs font-semibold rounded-full",
        variantStyles[key],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
