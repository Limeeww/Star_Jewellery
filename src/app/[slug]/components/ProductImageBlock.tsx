"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import {
  AiOutlineSearch,
  AiOutlineClose,
  AiOutlineLeft,
  AiOutlineRight,
  AiOutlineHeart,
  AiFillHeart,
} from "react-icons/ai";
import { useModalClose } from "@/hooks/useModal";

interface ProductImageBlockProps {
  images: string[];
  altText: string;
}

interface ArrowButtonProps {
  onClick: () => void;
  disabled: boolean;
  offsetClass: string;
  sizeClass?: string;
  children: React.ReactNode;
}
const ArrowButton = ({
  onClick,
  disabled,
  offsetClass,
  sizeClass = "p-2",
  children,
}: ArrowButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={
      `hidden md:flex items-center justify-center absolute top-1/2 -translate-y-1/2 bg-white rounded-full shadow text-gray-700 disabled:opacity-50 ` +
      sizeClass +
      " " +
      offsetClass
    }
  >
    {children}
  </button>
);

interface DotNavProps {
  count: number;
  activeIndex: number;
  onSelect: (i: number) => void;
  containerClass: string;
  dotSizeClass: string;
  activeClass: string;
  inactiveClass: string;
}
const DotNav = ({
  count,
  activeIndex,
  onSelect,
  containerClass,
  dotSizeClass,
  activeClass,
  inactiveClass,
}: DotNavProps) => (
  <div className={containerClass}>
    {Array.from({ length: count }, (_, i) => (
      <div
        key={i}
        className={`${dotSizeClass} rounded-full ${
          i === activeIndex ? activeClass : inactiveClass
        }`}
        onClick={() => onSelect(i)}
      />
    ))}
  </div>
);

export default function ProductImageBlock({
  images,
  altText,
}: ProductImageBlockProps) {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalPage, setModalPage] = useState(0);
  const [modalDirection, setModalDirection] = useState(0);

  const [isWishlisted, setIsWishlisted] = useState(false);

  const imageCount = images.length;
  const currentImage =
    imageCount > 0 ? images[page] : "/images/placeholder.png";

  useEffect(() => {
    if (isModalOpen) {
      setModalPage(page);
      setModalDirection(0);
    }
  }, [isModalOpen, page]);

  const changeIndex = (
    newIndex: number,
    current: number,
    setIndex: React.Dispatch<React.SetStateAction<number>>,
    setDir: React.Dispatch<React.SetStateAction<number>>
  ) => {
    const dir = newIndex > current ? 1 : -1;
    setDir(dir);
    setIndex(newIndex);
  };
  const paginate = (dir: number) =>
    changeIndex(
      Math.min(Math.max(page + dir, 0), imageCount - 1),
      page,
      setPage,
      setDirection
    );
  const modalPaginate = (dir: number) =>
    changeIndex(
      Math.min(Math.max(modalPage + dir, 0), imageCount - 1),
      modalPage,
      setModalPage,
      setModalDirection
    );

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
        <motion.button
          onClick={() => setIsWishlisted((prev) => !prev)}
          initial={{ scale: 1, color: "#374151" }}
          animate={{
            scale: isWishlisted ? 1.1 : 1,
            color: isWishlisted ? "#EF4444" : "#374151",
          }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="absolute top-2 right-2 bg-white p-2 rounded-full cursor-pointer z-20"
        >
          {isWishlisted ? (
            <AiFillHeart size={24} />
          ) : (
            <AiOutlineHeart size={24} />
          )}
        </motion.button>

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

        <ArrowButton
          onClick={() => paginate(-1)}
          disabled={page <= 0}
          offsetClass="left-2"
        >
          <AiOutlineLeft size={24} />
        </ArrowButton>
        <ArrowButton
          onClick={() => paginate(1)}
          disabled={page >= imageCount - 1}
          offsetClass="right-2"
        >
          <AiOutlineRight size={24} />
        </ArrowButton>

        <button
          onClick={() => setModalOpen(true)}
          className="absolute bottom-2 right-2 bg-white p-2 rounded-full cursor-pointer transition-transform duration-200 transform hover:scale-110"
        >
          <AiOutlineSearch size={24} className="text-gray-700" />
        </button>
      </div>

      <DotNav
        count={imageCount}
        activeIndex={page}
        onSelect={(i) => changeIndex(i, page, setPage, setDirection)}
        containerClass="flex md:hidden items-center justify-center space-x-2 mt-2"
        dotSizeClass="w-2 h-2"
        activeClass="bg-gray-800"
        inactiveClass="bg-gray-300"
      />

      <div className="hidden md:flex items-center justify-center space-x-2 mt-4">
        {images.map((img, i) => (
          <div
            key={i}
            onClick={() => changeIndex(i, page, setPage, setDirection)}
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
                    onClick={(e) => {
                      if (window.innerWidth < 768) {
                        e.stopPropagation();
                      } else {
                        setModalOpen(false);
                      }
                    }}
                    fill
                    className="object-contain"
                  />
                </motion.div>
              </AnimatePresence>

              <ArrowButton
                onClick={() => modalPaginate(-1)}
                disabled={modalPage <= 0}
                offsetClass="left-[-60px]"
                sizeClass="p-3"
              >
                <AiOutlineLeft size={24} />
              </ArrowButton>
              <ArrowButton
                onClick={() => modalPaginate(1)}
                disabled={modalPage >= imageCount - 1}
                offsetClass="right-[-60px]"
                sizeClass="p-3"
              >
                <AiOutlineRight size={24} />
              </ArrowButton>

              <DotNav
                count={imageCount}
                activeIndex={modalPage}
                onSelect={(i) =>
                  changeIndex(i, modalPage, setModalPage, setModalDirection)
                }
                containerClass="flex md:hidden absolute bottom-[-40px] left-1/2 -translate-x-1/2 space-x-2"
                dotSizeClass="w-4 h-4"
                activeClass="bg-white"
                inactiveClass="bg-gray-500"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
