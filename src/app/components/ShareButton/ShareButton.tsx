"use client";

import React from "react";
import { IoMdShare } from "react-icons/io";
import { useNotification } from "../../../hooks/useNotification";

type ShareButtonProps = {
  title: string;
  text: string;
  url: string;
};

export default function ShareButton({ title, text, url }: ShareButtonProps) {
  const { notify } = useNotification();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
      } catch (error) {
        notify({
          type: "error",
          message: `Error sharing: ${String(error)}`,
          duration: 3000,
        });
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        notify({
          type: "success",
          message: "Link copied to clipboard!",
          duration: 3000,
        });
      } catch (error) {
        notify({
          type: "error",
          message: "Failed to copy link.",
          duration: 3000,
        });
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-medium px-4 py-2 hover:bg-gray-800 transition-colors rounded"
    >
      <IoMdShare />
      Share
    </button>
  );
}
