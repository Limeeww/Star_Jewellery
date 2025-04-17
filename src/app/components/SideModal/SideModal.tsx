"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineClose } from "react-icons/ai";
import { useModalClose } from "@/app/utils/useModal";

interface SideModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { x: "100%" },
  visible: { x: 0 },
};

function SideModal({ isOpen, onClose, children }: SideModalProps) {
  const { modalRef, handleOutsideClick } = useModalClose(onClose);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-end"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
          transition={{ duration: 0.3 }}
          onClick={handleOutsideClick}
        >
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          <motion.div
            ref={modalRef}
            className="relative bg-white shadow-lg w-full max-w-md h-full"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={modalVariants}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-200 transition"
            >
              <AiOutlineClose size={20} className="text-gray-800" />
            </button>
            <div className="h-full overflow-y-auto p-4 pt-12">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SideModal;
