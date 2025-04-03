"use client";

import { useState, useEffect, useRef } from "react";
import { useFloating, offset, flip, shift, autoUpdate } from "@floating-ui/react-dom";
import { IoIosInformationCircleOutline, IoMdClose } from "react-icons/io";

type InfoItemProps = {
  text: string;
};

export default function InfoItem({ text }: InfoItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // useFloating даёт refs и стили для позиционирования
  const { x, y, refs, strategy } = useFloating({
    middleware: [offset(8), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  // Закрываем модальное окно при клике вне его области
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        !refs.setReference.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, refs]);

  return (
    <div style={{ display: "inline-block" }}>
      <span
        ref={refs.setReference}
        style={{ cursor: "pointer" }}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <IoIosInformationCircleOutline size={18} />
      </span>

      {isOpen && (
        <div
          ref={(node) => {
            refs.setFloating(node);
            modalRef.current = node;
          }}
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
            background: "#fff",
            border: "1px solid #ccc",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            borderRadius: 4,
            padding: 10,
            width: 220,
            zIndex: 9999,
          }}
        >
          <button
            onClick={() => setIsOpen(false)}
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            <IoMdClose size={14} />
          </button>
          <div style={{ paddingTop: 20 }}>{text}</div>
        </div>
      )}
    </div>
  );
}
