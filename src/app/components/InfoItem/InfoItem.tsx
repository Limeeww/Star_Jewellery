"use client";

import { useState, useEffect, useRef } from "react";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
} from "@floating-ui/react-dom";
import { IoIosInformationCircleOutline, IoMdClose } from "react-icons/io";

type InfoItemProps = {
  text: string;
};

export default function InfoItem({ text }: InfoItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const { x, y, refs, strategy } = useFloating({
    middleware: [offset(8), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

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
    <div className="inline-block">
      <span
        ref={refs.setReference}
        className="cursor-pointer"
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
          style={{ position: strategy, top: y ?? 0, left: x ?? 0 }}
          className="bg-white border border-gray-300 shadow-[0_2px_8px_rgba(0,0,0,0.15)] rounded p-2.5 w-[220px] z-[9999]"
        >
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-[5px] right-[5px] border-0 bg-transparent cursor-pointer"
          >
            <IoMdClose size={14} />
          </button>
          <div className="pt-5">{text}</div>
        </div>
      )}
    </div>
  );
}
