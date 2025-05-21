"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import CartCollection from "../components/CartCollection/CartCollection";
import { Collection } from "@/types/collection";
import { fetchCollections } from "@/utils/collection";
import Link from "next/link";

export default function CollectionsSection() {
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    async function loadCollections() {
      try {
        const cols = await fetchCollections(4);
        setCollections(cols);
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    }
    loadCollections();
  }, []);

  return (
    <section
      className="py-12 sm:px-6 lg:px-8"
      style={{ fontFamily: "var(--font-poppins)" }}
      id="collections"
    >
      <h2
        className="text-2xl xl:text-3xl font-bold mb-2 text-gray-800 text-center"
        style={{ fontFamily: "var(--font-playfair)", letterSpacing: "0.05em" }}
      >
        COLLECTIONS
      </h2>

      <div className="text-center mb-6">
        <Link
          href="/all-collections"
          className="text-md text-gray-600 hover:text-gray-800 underline"
        >
          VIEW ALL
        </Link>
      </div>

      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4">
        <div className="order-2 2xl:order-1 grid grid-cols-2 gap-2">
          {collections.length > 0 ? (
            collections.map((collection) => (
              <CartCollection key={collection.id} collection={collection} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No collections available.
            </p>
          )}
        </div>

        <div className="overflow-hidden order-1 2xl:order-2">
          <Image
            src="/images/collections/model.jpg"
            alt="Model wearing jewelry"
            width={600}
            height={800}
            className="w-full h-[50vh] md:h-[80vh] 2xl:h-[108vh] object-cover"
          />
        </div>
      </div>
    </section>
  );
}
