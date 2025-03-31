import Image from "next/image";
import Item from "../components/Item/Item";
import { Product } from "../types/product";
import { useEffect, useState } from "react";
import { fetchProducts } from "../utils/product";

export default function CollectionsSection() {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts() {
      const products = await fetchProducts(4);
      setItems(products);
    }
    loadProducts();
  }, []);

  return (
    <section
      className="py-12 sm:px-6 lg:px-8"
      style={{ fontFamily: "var(--font-poppins)" }}
      id="collections"
    >
      <h2
        className="text-2xl xl:text-3xl font-bold mb-8 text-gray-800 text-center"
        style={{
          fontFamily: "var(--font-playfair)",
          letterSpacing: "0.05em",
        }}
      >
        COLLECTIONS
      </h2>

      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4">
        <div className="order-2 2xl:order-1 grid grid-cols-2 gap-2">
          {items.map((product) => (
            <Item key={product.id} product={product} />
          ))}
        </div>

        <div className="overflow-hidden order-1 2xl:order-2">
          <Image
            src="/images/collection/model.jpg"
            alt="Model wearing jewelry"
            width={600}
            height={800}
            className="w-full h-[50vh] md:h-[65vh] 2xl:h-[105vh] object-cover"
          />
        </div>
      </div>
    </section>
  );
}
