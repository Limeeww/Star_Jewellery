"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/app/types/product";
import { Collection } from "@/app/types/collection";

interface AboutCollectionProps {
  firebaseProduct: Product;
  collection: Collection;
}

export default function AboutCollection({
  firebaseProduct,
  collection,
}: AboutCollectionProps) {
  const [activeTab, setActiveTab] = useState<"collection" | "product">("collection");

  const displayedText =
    activeTab === "collection"
      ? collection?.description
      : firebaseProduct.additionalDescription;

  return (
    <section
      className="w-full px-4 md:px-6 py-8 bg-white"
      style={{ fontFamily: "var(--font-poppins)" }}
    >
      <h2
        className="text-xl md:text-2xl font-semibold text-gray-800 mb-6"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        DESCRIPTION
      </h2>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("collection")}
          className={`text-sm md:text-base font-medium pb-1 border-b-2 ${
            activeTab === "collection"
              ? "border-gray-800 text-gray-800"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          About Collection
        </button>
        <button
          onClick={() => setActiveTab("product")}
          className={`text-sm md:text-base font-medium pb-1 border-b-2 ${
            activeTab === "product"
              ? "border-gray-800 text-gray-800"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          About Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-gray-700 text-sm md:text-base leading-relaxed whitespace-pre-line">
              {displayedText}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-4">
          <div className="w-2/3">
            <Image
              src={collection?.images[0] || "/images/placeholder.png"}
              alt="Big"
              width={600}
              height={400}
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="w-1/3">
            <Image
              src={collection?.images[1] || "/images/placeholder.png"}
              alt="Small"
              width={400}
              height={400}
              className="w-full h-auto object-cover mb-4"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
