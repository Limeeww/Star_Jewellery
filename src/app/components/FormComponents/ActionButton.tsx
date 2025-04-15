"use client";

import React from "react";

interface ActionButtonProps {
  text: string;
  disabled?: boolean;
  className?: string;
  onClick: () => void;
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
