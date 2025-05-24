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
  ...rest
}: ActionButtonProps) {
  return (
    <button
      type={type}
      className={className}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {text}
    </button>
  );
}

export default ActionButton;
