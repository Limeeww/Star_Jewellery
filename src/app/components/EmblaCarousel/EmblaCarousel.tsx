"use client";

import React, { useState, useEffect, useCallback, ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { EmblaOptionsType } from "embla-carousel";

interface EmblaCarouselProps {
  options?: EmblaOptionsType;
  children: ReactNode;
}

function EmblaCarousel({ options, children }: EmblaCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative">
      <div className="relative lg:px-8 sm:px-6 py-4">
        <button
          className="hidden xl:flex absolute top-1/2 -left-1 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:scale-110 transition-transform z-10"
          onClick={scrollPrev}
          aria-label="Previous Slide"
        >
          <AiOutlineLeft size={24} />
        </button>
        <button
          className="hidden xl:flex absolute top-1/2 -right-1 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:scale-110 transition-transform z-10"
          onClick={scrollNext}
          aria-label="Next Slide"
        >
          <AiOutlineRight size={24} />
        </button>
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">{children}</div>
        </div>
      </div>
      <div className="flex xl:hidden justify-center items-center gap-2 mt-4">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi && emblaApi.scrollTo(index)}
            className={`w-2 h-2 rounded-full ${
              index === selectedIndex ? "bg-gray-800" : "bg-gray-300"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default EmblaCarousel;
