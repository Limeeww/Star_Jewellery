"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Collection } from "../../../types/collection";

type CartCollectionProps = {
collection: Collection;
};

export default function CartCollection({ collection }: CartCollectionProps) {
return (
  <Link
    key={collection.id}
    href={`/collection/${collection.id}`}
    className="
        border 
        p-2 
        text-gray-800  
        hover:shadow-lg 
        transition-shadow 
        duration-300 
        bg-white 
        flex 
        flex-col
        h-full
      "
  >
    <div className="overflow-hidden">
      <Image
        src={collection.images[0] || "/images/placeholder.png"}
        alt={collection.name}
        width={300}
        height={300}
        className="
            w-full
            object-cover
            transform
            transition
            duration-300
            hover:scale-105
            aspect-square
          "
      />
    </div>

    <div className="mt-2 flex flex-col">
      <div>
        <h3 className="text-base md:text-lg font-medium">
          {collection.name}
        </h3>
        <p className="text-sm text-gray-500 ">{collection.description}</p>
      </div>
    </div>
  </Link>
);
}
