import React from "react";

export interface ActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}

export default function ActionButton({
  text,
  className,
  disabled,
  onClick,
  type = "button",
  ...props
}: ActionButtonProps) {
  return (
    <button
      type={type}
      className={className}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {text}
    </button>
  );
}
