import React from "react";

interface ActionButtonProps {
  text: string;
  disabled?: boolean;
  className?: string;
  onClick?: (
    e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>
  ) => void;
}

function ActionButton({
  text,
  disabled,
  className,
  onClick,
}: ActionButtonProps) {
  return (
    <button className={className} disabled={disabled} onClick={onClick}>
      {text}
    </button>
  );
}

export default ActionButton;
