import React from "react";


type LinkButtonProps = {
    text: string;
    className?: string;
    onClick?: () => void;
    showArrow?: boolean;
}
export default function LinkButton({ text, className, onClick, showArrow = false }: LinkButtonProps) {

  
    return (
      <button className={className} onClick={onClick}>
        {text}
        {showArrow && <span className="ml-1">&rarr;</span>}
      </button>
    );
  }