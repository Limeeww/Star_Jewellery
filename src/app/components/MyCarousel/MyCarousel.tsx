// Carousel.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import {
  AiOutlineLeft,
  AiOutlineRight,
} from "react-icons/ai";

interface CarouselProps {
  images: string[];
  altText: string;
}

export function Carousel({ images, altText }: CarouselProps) {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);
  const imageCount = images.length;
  const currentImage = imageCount > 0 ? images[page] : "/images/placeholder.png";

  // Функция переключения слайда (нецикличная: индекс не выходит за пределы массива)
  const paginate = (newDirection: number) => {
    setPage((oldPage) => {
      let newPage = oldPage + newDirection;
      if (newPage < 0) newPage = 0;
      if (newPage >= imageCount) newPage = imageCount - 1;
      return newPage;
    });
    setDirection(newDirection);
  };

  // Обработка свайпа — если смещение (offset.x) больше порога, переключаем на один слайд
  const handleDragEnd = (e: PointerEvent, info: PanInfo) => {
    const swipeDistance = info.offset.x;
    const swipeThreshold = 100;
    if (swipeDistance < -swipeThreshold && page < imageCount - 1) {
      paginate(1);
    } else if (swipeDistance > swipeThreshold && page > 0) {
      paginate(-1);
    }
  };

  // Анимационные варианты с использованием Framer Motion
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

  // Слушатель для клавиши Escape (закрывать модальное окно можно там, где нужно)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setModalOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative w-full mx-auto">
      {/* Основной слайдер */}
      <div className="relative overflow-hidden w-full h-[300px] sm:h-[400px] md:h-[500px]">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragElastic={0.2}
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

        {/* Кнопки стрелок для десктопа */}
        <button
          onClick={() => paginate(-1)}
          disabled={page === 0}
          className="hidden md:flex items-center justify-center absolute top-1/2 left-2 -translate-y-1/2 bg-white rounded-full p-2 shadow text-gray-700 disabled:opacity-50"
        >
          <AiOutlineLeft size={24} />
        </button>
        <button
          onClick={() => paginate(1)}
          disabled={page === imageCount - 1}
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

      {/* Точки для мобильных устройств */}
      <div className="flex md:hidden items-center justify-center space-x-2 mt-2">
        {images.map((_, i) => (
          <div
            key={i}
            onClick={() => setPage(i)}
            className={`w-2 h-2 rounded-full ${i === page ? "bg-gray-800" : "bg-gray-300"}`}
          />
        ))}
      </div>

      {/* Миниатюры для десктопа */}
      <div className="hidden md:flex items-center justify-center space-x-2 mt-4">
        {images.map((img, i) => (
          <div
            key={i}
            onClick={() => {
              setDirection(i > page ? 1 : -1);
              setPage(i);
            }}
            className={`cursor-pointer border-2 p-1 rounded ${i === page ? "border-blue-500" : "border-transparent"}`}
          >
            <div className="relative w-[80px] h-[80px]">
              <Image src={img} alt={`Thumbnail ${i + 1}`} fill className="object-cover" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
