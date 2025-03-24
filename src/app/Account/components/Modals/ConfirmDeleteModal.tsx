
"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoCloseOutline } from "react-icons/io5";
import { useModalClose } from "../../../utils/useModal"; 
import { useNotification } from "../../../utils/useNotification"; 
import Notification from "@/app/components/MessageHandling/Notification";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
}: ConfirmDeleteModalProps) {
  const { modalRef, handleOutsideClick } = useModalClose(onClose);
  const { notification, clearNotification } = useNotification();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOutsideClick}
        >
          <motion.div
            className="bg-white p-6 m-0 rounded-md shadow-md w-full max-w-sm relative"
            ref={modalRef}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            {notification && (
              <Notification
                message={notification.message}
                type={notification.type}
                duration={3000}
                onClose={clearNotification}
              />
            )}

            <button
              onClick={onClose}
              className="absolute top-6 right-4 text-gray-500 hover:text-gray-700"
            >
              <IoCloseOutline size={24} />
            </button>

            <h2 className="text-xl font-semibold mb-4">Delete Address</h2>
            <p className="mb-6">Are you sure you want to delete this address?</p>

            <div className="flex justify-end gap-4">
              <button
                onClick={onClose}
                className="px-4 py-2 border bg-white hover:bg-gray-200"
              >
                No
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 border bg-red-100 hover:bg-red-200"
              >
                Yes
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
