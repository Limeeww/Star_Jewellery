"use client";

import React from "react";
import { motion } from "framer-motion";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useWishlistCtx } from "@/app/contexts/WishlistContext";
import { WishlistItem } from "@/types/userTypes";
import { useAuthContext } from "@/app/contexts/AuthContext";
import { useNotification } from "@/hooks/useNotification";
import Notification from "@/app/components/MessageHandling/Notification";

interface WishlistButtonProps {
  item: WishlistItem;
}

export default function WishlistButton({ item }: WishlistButtonProps) {
  const { toggleItem, isWishlisted } = useWishlistCtx();
  const active = isWishlisted(item);

  const { user, loading } = useAuthContext();
  const isLoggedIn = !loading && !!user && !user.isAnonymous;

  const { notify, notification, clearNotification } = useNotification();

  const handleClick = () => {
    if (!isLoggedIn) {
      notify({
        type: "error",
        message: "Please sign up or log in to use the wishlist.",
      });
      return;
    }
    toggleItem(item);
  };

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={clearNotification}
        />
      )}
      <motion.button
        onClick={handleClick}
        initial={{ scale: 1, color: "#374151" }}
        animate={{
          scale: active ? 1.1 : 1,
          color: active ? "#EF4444" : "#374151",
        }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="absolute top-2 right-2 bg-white p-2 rounded-full z-10"
      >
        {active ? <AiFillHeart size={20} /> : <AiOutlineHeart size={24} />}
      </motion.button>
    </>
  );
}
