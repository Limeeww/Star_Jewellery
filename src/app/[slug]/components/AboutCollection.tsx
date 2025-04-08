"use client";

import { useState } from "react";
import Image from "next/image";

export default function AboutCollection() {
  const [activeTab, setActiveTab] = useState<"collection" | "product">(
    "collection"
  );


  // GET TEXT FROM FIREBASE
  const collectionText = `
    Smart & Beautiful is a jewelry collection inspired by intellectual beauty.
    Its distinguishing feature is ceramics as the main material. 
    Each girl will be able to choose the most suitable option for herself:
    white or black, thin or large, with or without diamonds.
  `;

  const productText = `
    The product line offers a wide variety of shapes and inserts,
    ensuring there's something for every taste. 
    Whether you prefer minimalism or a bolder statement piece,
    our range has you covered.
  `;

  const displayedText =
    activeTab === "collection" ? collectionText : productText;

  return (
    <section
      className="w-full px-4 md:px-6 py-8 md:py-12 bg-white"
      style={{ fontFamily: "var(--font-poppins)" }}
    >
      <h2
        className="text-xl md:text-2xl font-semibold text-gray-800 mb-4"
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
        <div>
          <p className="text-gray-700 text-sm md:text-base leading-relaxed whitespace-pre-line">
            {displayedText}
          </p>
        </div>

        <div className="flex gap-4">
          <div className="w-2/3">
            <Image
              src="/images/bigPhoto.jpg"
              alt="Big"
              width={600}
              height={400}
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="w-1/3">
            <Image
              src="/images/smallPhoto.jpg"
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
