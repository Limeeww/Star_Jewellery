"use client";

import { useState } from "react";
import { Product, ProductVariant } from "../../types/product";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import InfoItem from "@/app/components/InfoItem/InfoItem";
import { Collection } from "@/app/types/collection";

interface Props {
  product: Product;
  collection: Collection;
  displayedVariant: ProductVariant | undefined;
}

const MainFeaturesList = ({ product, collection, displayedVariant }: Props) => {
  const [expanded, setExpanded] = useState(false);

  const features = [
    {
      label: "Vendor code",
      value: product.id,
      valueClass: "text-gray-900 font-medium",
    },
    {
      label: "Metal",
      value: (
        <div className="flex items-center">
          {displayedVariant?.material + " "}
          <span className="ml-1 text-gray-400 text-xs">
            <InfoItem text="The information about the metal is provided by the manufacturer. It is not a guarantee of the quality of the product." />
          </span>
        </div>
      ),
      valueClass: "text-gray-800 font-medium",
    },
    {
      label: "Purity",
      value: displayedVariant?.purity ?? "—",
      valueClass: "text-gray-800",
    },
    {
      label: "Average weight",
      value: displayedVariant?.weight.toFixed(1) ?? "—",
      valueClass: "font-semibold text-gray-800",
    },

    {
      label: "Insert",
      value: displayedVariant?.insert
        ? displayedVariant?.insert
        : "Without insertion",
      valueClass: "text-gray-800 font-medium",
    },
    {
      label: "Collection",
      value: collection?.name,
      valueClass: "text-gray-800 font-medium",
    },
  ];

  const previewCount = 3;

  return (
    <div className="mx-auto relative">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Main features
      </h3>

      <div className="relative max-h-[200px] overflow-visible">
        <ul className="text-sm text-gray-900 space-y-2 transition-all duration-500">
          {features.map((item, index) => (
            <li
              key={index}
              className={`flex justify-between border-b border-gray-200 pb-2 ${
                index >= previewCount && !expanded ? "hidden" : ""
              }`}
            >
              <span>{item.label}</span>
              <span className={item.valueClass}>{item.value}</span>
            </li>
          ))}
        </ul>

        {!expanded && (
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        )}
      </div>

      {features.length > previewCount && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-5 text-sm text-slate-700 font-medium hover:underline flex items-center justify-center space-x-1"
        >
          {expanded ? (
            <>
              <span>COLLAPSE</span>
              <IoIosArrowUp />
            </>
          ) : (
            <>
              <span>EXPAND</span>
              <IoIosArrowDown />
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default MainFeaturesList;
