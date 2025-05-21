import React from "react";

interface ActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}

function ActionButton({
  text,
  disabled,
  className,
  type = "button",
  onClick,
}: ActionButtonProps) {
  return (
    <button
      type={type}
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default ActionButton;
