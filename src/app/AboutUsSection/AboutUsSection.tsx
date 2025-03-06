import Image from "next/image";
import Link from "next/link";

export default function AboutUsSection() {
  return (
    <section
      className="px-4 py-8 sm:px-6 lg:px-8"
      style={{ fontFamily: "var(--font-poppins)" }}
    >
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-center">
        <div>
          <h2
            className="
              text-2xl 
              md:text-3xl 
              text-gray-800 
              mb-4
            "
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            About Us
          </h2>

          <p
            className="
              text-sm 
              md:text-base 
              text-gray-600 
              leading-relaxed 
              mb-6 
              text-right 
              md:text-left
            "
          >
            The essence of STAR was born from a passion for timeless elegance
            and masterful craftsmanship. Inspired by the world’s finest jewelry
            traditions, our artisans create exquisite designs that celebrate
            heritage, innovation, and the brilliance of rare gemstones.
          </p>

          <Link href="/about" className="inline-block text-right md:text-left">
            <p
              className="
                text-sm 
                md:text-base 
                text-gray-600 
                hover:text-gray-800 
                underline
              "
            >
              LEARN MORE
            </p>
          </Link>
        </div>

        {/* Правая колонка: изображение */}
        <div className="overflow-hidden">
          <Image
            src="/images/about-us.jpg"
            alt="POSIE Jewelry Craftsmanship"
            width={600}
            height={400}
            className="
              w-full
              h-auto
              object-cover
            "
          />
        </div>
      </div>
    </section>
  );
}
