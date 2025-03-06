import Image from "next/image";
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

export default function CollectionsSection() {
  const items: Product[] = [
    {
      id: 1,
      name: "Ariana Grande Bracelet",
      description: "Crystals, handcrafted",
      image: "/images/products/silver-ring-test/main.jpg",
      slug: "Ariana-Grande-Bracelet",
      variantID: "5720857",
      price: 129,
    },
    {
      id: 2,
      name: "One Bracelet",
      description: "Timeless elegance",
      image: "/images/product2.jpg",
      slug: "One-Bracelet",
      variantID: "123456",
      price: 99,
    },
    {
      id: 3,
      name: "Swarovski Remix",
      description: "Crystals, handcrafted",
      image: "/images/product3.jpg",
      slug: "Swarovski-Remix",
      variantID: "234567",
      price: 149,
    },
    {
      id: 4,
      name: "Inter-Belly Bracelet",
      description: "Modern style",
      image: "/images/product4.jpg",
      slug: "Inter-Belly-Bracelet",
      variantID: "345678",
      price: 89,
    },
  ];

  return (
    <section
      className="
        py-12 
        sm:px-6 
        lg:px-8
      "
      style={{ fontFamily: "var(--font-poppins)" }}
    >
      <h2
        className="
          text-2xl 
          xl:text-3xl 
          font-bold 
          mb-8 
          text-gray-800
          text-center
        "
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

        <div className="overflow-hidden order-1 2xl:order-2 overflow-hidden">
          <Image
            src="/images/collection/model.jpg"
            alt="Model wearing jewelry"
            width={600}
            height={800}
            className="
              w-full
             h-[50vh] md:h-[65vh] 2xl:h-[105vh] object-cover

            "
          />
        </div>
      </div>
    </section>
  );
}
