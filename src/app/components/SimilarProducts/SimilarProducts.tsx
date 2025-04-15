"use client";

import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import Item from "../Item/Item";
import { Product } from "../../types/product";
import { fetchProducts } from "../../utils/product";
import { EmblaOptionsType } from "embla-carousel";

const SimilarProducts = () => {
  const [items, setItems] = useState<Product[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const options: EmblaOptionsType = {
    align: "start",
    loop: false,
  };

  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  useEffect(() => {
    async function loadSimilarProducts() {
      const products = await fetchProducts(4);
      setItems(products);
    }
    loadSimilarProducts();
  }, []);

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
    <div
      className="sm:px-6 lg:px-6 py-8"
      style={{ fontFamily: "var(--font-poppins)" }}
      id="similar-products"
    >
      <h1
        className="text-center text-3xl text-gray-800 mb-4"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Similar Products
      </h1>

      <div className="relative">
        <div className="relative px-8 py-4">
          <button
            className="hidden xl:flex absolute top-1/2 -left-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:scale-110 transition-transform z-10"
            onClick={scrollPrev}
            aria-label="Previous Slide"
          >
            <AiOutlineLeft size={24} />
          </button>

          <button
            className="hidden xl:flex absolute top-1/2 -right-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:scale-110 transition-transform z-10"
            onClick={scrollNext}
            aria-label="Next Slide"
          >
            <AiOutlineRight size={24} />
          </button>

          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {items.map((product) => (
                // Сохраняем Slides per View с помощью классов:
                // - w-1/2 для мобильных (2 айтема)
                // - md:w-1/4 для десктопа (4 айтема)
                <div
                  key={product.id}
                  className="flex-shrink-0 w-1/2 xl:w-1/4 px-2"
                >
                  <Item product={product} />
                </div>
              ))}
            </div>
          </div>
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
};

export default SimilarProducts;
