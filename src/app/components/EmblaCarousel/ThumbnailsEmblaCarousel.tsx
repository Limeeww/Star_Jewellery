"use client";

import React, { useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaOptionsType } from "embla-carousel";
import Image from "next/image";

interface ImageItem {
  src: string;
  alt: string;
}

interface ThumbsEmblaCarouselProps {
  images: ImageItem[];
  mainIndex: number;
  onThumbClick: (index: number) => void; 
  emblaOptions?: EmblaOptionsType;
}

const ThumbsEmblaCarousel: React.FC<ThumbsEmblaCarouselProps> = ({
  images,
  mainIndex,
  onThumbClick,
  emblaOptions,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(emblaOptions);

  const scrollToActiveThumb = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollTo(mainIndex, false); // без анимации
  }, [emblaApi, mainIndex]);

  useEffect(() => {
    scrollToActiveThumb();
  }, [mainIndex, scrollToActiveThumb]);

  return (
    <div className="embla embla--thumbs">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container flex">
          {images.map((item, index) => (
            <div
              className={`embla__slide w-[10px] h-[10px] embla__slide--thumb ${
                index === mainIndex ? "border-2 border-blue-500" : "border"
              }`}
              key={index}
              onClick={() => onThumbClick(index)}
            >
              <Image
                src={item.src}
                alt={`Thumb ${index + 1}`}
                width={80}
                height={80}
                className="object-cover w-full h-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThumbsEmblaCarousel;
