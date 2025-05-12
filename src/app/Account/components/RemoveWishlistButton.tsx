"use client";
import React from "react";
import { LuX } from "react-icons/lu";

export default function RemoveWishlistButton({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="absolute top-2 right-2 bg-white p-2 rounded-full hover:bg-gray-100 transition"
    >
      <LuX size={16} />
    </button>
  );
}
