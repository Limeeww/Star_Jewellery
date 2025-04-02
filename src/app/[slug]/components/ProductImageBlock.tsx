"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";

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

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={() => setModalOpen(false)}
        >
          <button
            onClick={() => setModalOpen(false)}
            className="absolute top-2 right-2 p-2 rounded-full cursor-pointer transition-transform duration-200 transform hover:scale-110"
          >
            <AiOutlineClose size={24} className="text-white" />
          </button>
          <div
            className="w-[90vh] h-[90vh] max-w-[90vw] max-h-[90vh] w-full h-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={800}
              height={800}
              className="object-contain w-full h-auto"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ProductImageBlock;
