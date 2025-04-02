"use client";

import React, { JSX } from "react";
import {
  AiOutlineHeart,
  AiOutlineStar,
  AiOutlineSend,
  AiOutlineCreditCard,
   
} from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";

interface InfoItem {
  title: string;
  icon: JSX.Element;
}

const infoItems: InfoItem[] = [
  {
    title: "Care",
    icon: <AiOutlineHeart size={20} />,
  },
  {
    title: "Warranty",
    icon: <AiOutlineStar size={20} />,
  },
  {
    title: "Shipping",
    icon: <AiOutlineSend size={20} />,
  },
  {
    title: "Payment",
    icon: <AiOutlineCreditCard size={20} />,
  },
];

function InfoBlocks() {
  return (
    <div className="w-full mx-auto">
      {infoItems.map((item, index) => (
        <div
          key={index}
          className="flex items-center justify-between border-b border-gray-200 py-3"
        >
          <div className="flex items-center space-x-2 text-gray-800">
            {item.icon}
            <span className="font-medium">{item.title}</span>
          </div>
          <button
            type="button"
            className="text-sm px-4 py-1 hover:bg-gray-100 transition"
          >
            <IoIosArrowForward size={16} className="text-gray-500" />
          </button>
        </div>
      ))}
    </div>
  );
}

export default InfoBlocks;
