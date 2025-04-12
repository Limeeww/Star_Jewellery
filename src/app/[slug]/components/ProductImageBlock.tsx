"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";

interface ProductProps {
  imageUrl: string;
  name: string;
}

const ProductImageBlock = ({ product }: { product: ProductProps }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <div className="relative overflow-hidden shadow-lg mt-6">
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={600}
          height={600}
          className="w-full max-h-[90vh] object-cover"
        />
        <div
          onClick={() => setModalOpen(true)}
          className="absolute bottom-2 right-2 bg-white p-2 rounded-full cursor-pointer transition-transform duration-200 transform hover:scale-110"
        >
          <AiOutlineSearch size={24} className="text-gray-700" />
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setModalOpen(false)}
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-2 right-2 p-2 rounded-full cursor-pointer transition-transform duration-200 transform hover:scale-110"
            >
              <AiOutlineClose size={24} className="text-white" />
            </button>
            <motion.div
              className="max-w-[90vw] max-h-[90vh] w-auto h-auto"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={800}
                height={800}
                className="object-contain w-full h-full"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductImageBlock;
