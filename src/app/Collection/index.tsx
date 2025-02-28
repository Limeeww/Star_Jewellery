import React from "react";
import Link from "next/link";
import Item from "../components/Item/Item";

type Product = {
  id: number;
  name: string;
  description: string;
  image: string;
  slug: string;
  variantID: string;
  price?: number;
};

export default function CollectionPage() {
  const items: Product[] = [
    {
      id: 1,
      name: "Ariana Grande Bracelet",
      description: "Crystals, handcrafted",
      image: "/images/products/silver-ring-test/main.jpg",
      slug: "Ariana-Grande-Bracelet",
      variantID: "5720857",
    },
    {
      id: 2,
      name: "One Bracelet",
      description: "Timeless elegance",
      image: "/images/product2.jpg",
      slug: "One-Bracelet",
      variantID: "123456",
    },
    {
      id: 3,
      name: "Swarovski Remix",
      description: "Crystals, handcrafted",
      image: "/images/product3.jpg",
      slug: "Swarovski-Remix",
      variantID: "234567",
    },
    {
      id: 4,
      name: "Inter-Belly Bracelet",
      description: "Modern style",
      image: "/images/product4.jpg",
      slug: "Inter-Belly-Bracelet",
      variantID: "345678",
    },
    {
      id: 5,
      name: "Men's Vinto Ring",
      description: "Classic design",
      image: "/images/product5.jpg",
      slug: "Mens-Vinto-Ring",
      variantID: "456789",
    },
  ];

  return (
    <div className="px-4 py-8" style={{ fontFamily: "var(--font-poppins)" }}>
      <h1
        className="text-center text-3xl text-gray-800 mb-2"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Catallog
      </h1>

      <div className="text-center mb-6">
        <Link
          href="/all-collections"
          className="text-sm text-gray-600 hover:text-gray-800 underline"
        >
          VIEW ALL
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((product) => (
          <Item key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
