"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import {
  AiOutlineSearch,
  AiOutlineClose,
  AiOutlineLeft,
  AiOutlineRight,
} from "react-icons/ai";
import { useModalClose } from "@/app/utils/useModal";

interface ProductImageBlockProps {
  images: string[];
  altText: string;
}

export default function ProductImageBlock({
  images,
  altText,
}: ProductImageBlockProps) {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);

  const [isModalOpen, setModalOpen] = useState(false);
  const [modalPage, setModalPage] = useState(0);
  const [modalDirection, setModalDirection] = useState(0);

  const imageCount = images.length;
  const currentImage =
    imageCount > 0 ? images[page] : "/images/placeholder.png";

  useEffect(() => {
    if (isModalOpen) {
      setModalPage(page);
      setModalDirection(0);
    }
  }, [isModalOpen, page]);

  const paginate = (newDirection: number) => {
    setPage((old) => {
      const next = Math.min(Math.max(old + newDirection, 0), imageCount - 1);
      return next;
    });
    setDirection(newDirection);
  };

  const modalPaginate = (newDirection: number) => {
    setModalPage((old) => {
      const next = Math.min(Math.max(old + newDirection, 0), imageCount - 1);
      return next;
    });
    setModalDirection(newDirection);
  };

  const handleDragEnd = (_: PointerEvent, info: PanInfo) => {
    const offset = info.offset.x;
    const threshold = 300;
    if (offset < -threshold && page < imageCount - 1) paginate(1);
    if (offset > threshold && page > 0) paginate(-1);
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
      transition: { duration: 0.4, ease: "easeInOut" },
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeInOut" },
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 300 : -300,
      opacity: 0,
      transition: { duration: 0.4, ease: "easeInOut" },
    }),
  };

  const { modalRef, handleOutsideClick } = useModalClose(() =>
    setModalOpen(false)
  );
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth >= 768) handleOutsideClick(e);
  };

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
            onClick={() => {
              setDirection(i > page ? 1 : -1);
              setPage(i);
            }}
          />
        ))}
      </div>

      <div className="hidden md:flex items-center justify-center space-x-2 mt-4">
        {images.map((img, i) => (
          <div
            key={i}
            onClick={() => {
              setDirection(i > page ? 1 : -1);
              setPage(i);
            }}
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
            onClick={handleOverlayClick}
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-2 right-2 p-2 rounded-full cursor-pointer transition-transform duration-200 transform hover:scale-110"
            >
              <AiOutlineClose size={24} className="text-white" />
            </button>

            <div
              ref={modalRef}
              className="relative w-[90vw] max-w-[800px] overflow-visible cursor-auto cursor-zoom-out-custom"
              style={{ paddingTop: "100%" }}
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence initial={false} custom={modalDirection}>
                <motion.div
                  key={modalPage}
                  custom={modalDirection}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0"
                >
                  <Image
                    src={images[modalPage]}
                    alt={altText}
                    fill
                    className="object-contain"
                    onClick={handleOverlayClick}
                  />
                </motion.div>
              </AnimatePresence>

              <button
                onClick={() => modalPaginate(-1)}
                disabled={modalPage <= 0}
                className="hidden md:block absolute left-[-60px] top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow disabled:opacity-50"
              >
                <AiOutlineLeft size={24} />
              </button>
              <button
                onClick={() => modalPaginate(1)}
                disabled={modalPage >= imageCount - 1}
                className="hidden md:block absolute right-[-60px] top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow disabled:opacity-50"
              >
                <AiOutlineRight size={24} />
              </button>

              <div className="flex md:hidden absolute bottom-[-40px] left-1/2 -translate-x-1/2 space-x-2">
                {images.map((_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-full ${
                      i === modalPage ? "bg-white" : "bg-gray-500"
                    }`}
                    onClick={() => {
                      const dir = i > modalPage ? 1 : -1;
                      setModalDirection(dir);
                      setModalPage(i);
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
