"use client";

import React from "react";
import { motion } from "framer-motion";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useWishlistCtx } from "@/app/contexts/WishlistContext";
import { WishlistItem } from "@/types/userTypes";

interface WishlistButtonProps {
  item: WishlistItem;
}

export default function WishlistButton({ item }: WishlistButtonProps) {
  const { toggleItem, isWishlisted } = useWishlistCtx();
  const active = isWishlisted(item);

  return (
    <motion.button
      onClick={() => toggleItem(item)}
      initial={{ scale: 1, color: "#374151" }}
      animate={{
        scale: active ? 1.1 : 1,
        color: active ? "#EF4444" : "#374151",
      }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="absolute top-2 right-2 bg-white p-2 rounded-full z-10"
    >
      {active ? <AiFillHeart size={24} /> : <AiOutlineHeart size={24} />}
    </motion.button>
  );
}
