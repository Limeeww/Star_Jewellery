import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="bg-white border-t border-gray-200 py-10 shadow-md"
      style={{ fontFamily: "var(--font-poppins)" }}
    >
      <div
        className="mx-auto px-4 
        sm:px-6 
        lg:px-8"
      >
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-4 md:mb-0">
            <h2
              className="text-2xl font-bold uppercase font-bold tracking-wide"
              style={{
                fontFamily: "var(--font-playfair)",
                letterSpacing: "0.05em",
              }}
            >
              <Link href="/">STAR</Link>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm md:mx-8 text-center">
            <div>
              <h3 className="font-semibold uppercase mb-2">
                <Link href="/projects">Projects</Link>
              </h3>
              <ul className="space-y-1">
                <li>
                  <Link href="#">Exhibition at the GIM</Link>
                </li>
                <li>
                  <Link href="#">#I&apos;m light POSE</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-md uppercase mb-2">
                <Link href="#catalog">Catalog</Link>
              </h3>
              <ul className="space-y-1">
                <li>
                  <Link href="#">Necklace</Link>
                </li>
                <li>
                  <Link href="#">Earrings</Link>
                </li>
                <li>
                  <Link href="#">Rings</Link>
                </li>
                <li>
                  <Link href="#">Bracelets</Link>
                </li>
                <li>
                  <Link href="#">Brooches</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold uppercase mb-2">
                <Link href="#collections">Collections</Link>
              </h3>
              <ul className="space-y-1">
                <li>
                  <Link href="#">Coronation</Link>
                </li>
                <li>
                  <Link href="#">Opera</Link>
                </li>
                <li>
                  <Link href="#">Pirouette</Link>
                </li>
                <li>
                  <Link href="#">Vera</Link>
                </li>
                <li>
                  <Link href="#">Pique</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold uppercase mb-2">
                <Link href="#about-us">About Us</Link>
              </h3>
              <ul className="space-y-1">
                <li>
                  <Link href="#">Home</Link>
                </li>
                <li>
                  <Link href="#">POSE</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="md:text-right">
            <h3 className="font-semibold mt-4 md:mt-0 uppercase mb-2">
              Contacts
            </h3>
            <p className="text-sm">
              <a href="tel:+380441234567" className="hover:underline">
                +38 (044) 123-45-67
              </a>
            </p>
            <p className="text-sm">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Kyiv,+Khreshchatyk+Street,+1"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Kyiv, Khreshchatyk Street, 1
              </a>
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mt-6 text-sm text-gray-600">
          <div className="flex space-x-4 mb-2 md:mb-0">
            <Link href="#">Privacy Policy</Link>
            <Link href="#">User Agreement</Link>
          </div>
          <p className="text-xs">
            © {new Date().getFullYear()} STAR. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
