"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import {
  AiOutlineSearch,
  AiOutlineClose,
  AiOutlineLeft,
  AiOutlineRight,
} from "react-icons/ai";

interface ProductImageSliderProps {
  images: string[];
  altText: string;
}

export default function ProductImageSlider({
  images,
  altText,
}: ProductImageSliderProps) {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);

  const imageCount = images.length;
  const currentImage =
    imageCount > 0 ? images[page] : "/images/placeholder.png";

  const paginate = (newDirection: number) => {
    setPage((oldPage) => {
      let newPage = oldPage + newDirection;
      if (newPage < 0) newPage = 0;
      if (newPage >= imageCount) newPage = imageCount - 1;
      return newPage;
    });
    setDirection(newDirection);
  };

  const handleDragEnd = (e: PointerEvent, info: PanInfo) => {
    const swipeDistance = info.offset.x;
    const swipeThreshold = 300; 

    if (swipeDistance < -swipeThreshold && page < imageCount - 1) {
      paginate(1);
    } else if (swipeDistance > swipeThreshold && page > 0) {
      paginate(-1);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      transition: { duration: 0.4, ease: "easeInOut" },
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeInOut" },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      transition: { duration: 0.4, ease: "easeInOut" },
    }),
  };

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
    <div className="relative w-full mx-auto">
      <div className="relative w-full aspect-square overflow-hidden shadow-lg mt-6 max-h-[90vh]">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            className="absolute w-full h-full"
          >
            <Image
              src={currentImage}
              alt={altText}
              fill
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        <button
          onClick={() => paginate(-1)}
          disabled={page <= 0}
          className="hidden md:flex items-center justify-center absolute top-1/2 left-2 -translate-y-1/2 bg-white rounded-full p-2 shadow text-gray-700 disabled:opacity-50"
        >
          <AiOutlineLeft size={24} />
        </button>
        <button
          onClick={() => paginate(1)}
          disabled={page >= imageCount - 1}
          className="hidden md:flex items-center justify-center absolute top-1/2 right-2 -translate-y-1/2 bg-white rounded-full p-2 shadow text-gray-700 disabled:opacity-50"
        >
          <AiOutlineRight size={24} />
        </button>

        <button
          onClick={() => setModalOpen(true)}
          className="absolute bottom-2 right-2 bg-white p-2 rounded-full cursor-pointer transition-transform duration-200 transform hover:scale-110"
        >
          <AiOutlineSearch size={24} className="text-gray-700" />
        </button>
      </div>

      <div className="flex md:hidden items-center justify-center space-x-2 mt-2">
        {images.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${
              i === page ? "bg-gray-800" : "bg-gray-300"
            }`}
            onClick={() => setPage(i)}
          />
        ))}
      </div>

      <div className="hidden md:flex items-center justify-center space-x-2 mt-4">
        {images.map((img, i) => (
          <div
            key={i}
            onClick={() => setPage(i)}
            className={`cursor-pointer border-2 p-1 rounded ${
              i === page ? "border-gray-800" : "border-transparent"
            }`}
          >
            <div className="relative w-[80px] h-[80px]">
              <Image
              src={img}
                alt={`Thumbnail ${i + 1}`}
                fill
                className="object-cover"
              />
            </div>
          </div>
        ))}
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
              className="relative w-[90vw] max-w-[1000px] overflow-hidden"
              style={{ paddingTop: "100%" }} 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={currentImage}
                alt={altText}
                fill
                className="absolute inset-0 object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
