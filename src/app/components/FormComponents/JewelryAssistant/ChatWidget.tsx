// components/ChatWidget.tsx
"use client";

import { useState } from "react";
import JewelryAssistantChat from "./JewelryAssistantChat";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Если виджет открыт, рендерим окно чата */}
      {isOpen && (
        <div
          className="
            fixed 
            bottom-20 right-4 
            w-96 
            bg-gray-100 
            shadow-lg 
            rounded-lg 
            z-50
            flex flex-col
          "
        >
          {/* Заголовок окна */}
          <div className="flex justify-between items-center px-3 py-2 border-b">
            <h4
              className="font-medium items-center"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Jewelry Assistant
            </h4>
            <button
              className="text-xl leading-none"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            <JewelryAssistantChat />
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="
          fixed 
          bottom-4 right-4 
          bg-black text-white 
          w-12 h-12 
          rounded-full 
          shadow-lg 
          flex items-center justify-center 
          text-2xl
          z-50
        "
        aria-label={isOpen ? "Закрыть чат" : "Открыть чат"}
      >
        ◇
      </button>
    </>
  );
}
