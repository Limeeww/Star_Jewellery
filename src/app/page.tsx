"use client";

import React, { useRef, useEffect, useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebaseConfig";
import Image from "next/image";
import Catalog from "./Catalog/Catalog";

import Collection from "./Collection/Collection";
import AboutUsSection from "./AboutUsSection/AboutUsSection";
import { FaGift, FaHeadset, FaShippingFast } from "react-icons/fa";
import Footer from "./components/Footer/Footer";

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const header = useRef<HTMLDivElement>(null);
  const [user, loading] = useAuthState(auth);
  let isLoggedIn = false;

  if (!loading && user) {
    isLoggedIn = true;
  }

  useEffect(() => {
    const handleScroll = () => {
      const videoHeight = header.current?.clientHeight || 0;
      setIsScrolled(window.scrollY > videoHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <Navbar isScrolled={isScrolled} isLoggedIn={isLoggedIn} />

      <div className="relative w-full h-screen" ref={header}>
        <video
          className="absolute top-0 left-0 w-full h-full object-cover -z-10"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/videos/background.mp4" type="video/mp4" />
          Your browser does not support video format.
        </video>

        <div className="absolute top-0 left-0 w-full h-full flex items-center">
          <div className="container mx-auto px-4">
            <h1
              className="text-6xl font-bold text-white text-left"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Welcome to Star Jewellery
            </h1>
            <p
              className="text-lg text-white mt-4 text-left"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Discover the beauty and elegance of our jewellery collection.
            </p>
            <Link href="/all-products">
              <button
                className="
            mt-6 
            px-6 
            py-2 
            border 
            border-white 
            text-white 
            hover:bg-white  
            hover:text-gray-800 
            transition-colors 
            duration-300
          "
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                Shop Now
              </button>
            </Link>
          </div>
        </div>
      </div>

      <Catalog />

      <section className="py-12" style={{ fontFamily: "var(--font-poppins)" }}>
        <div className="grid grid-cols-1 xl:grid-cols-2">
          <div className="overflow-hidden order-1 2xl:order-1">
            <Image
              src="/images/bestseller/bestseller4.jpg"
              alt="Jewelry Image"
              width={600}
              height={800}
              className="w-full xl:h-[60vh] sm:h-[40vh] h-auto object-contain"
            />
          </div>

          <div className="flex flex-col justify-center items-center lg:p-12 order-2 xl:order-2">
            <div className="text-center max-w-lg">
              <h2 className="font-serif text-2xl md:text-3xl tracking-widest text-gray-800 mb-4">
                LUXURY JEWELRY COLLECTION
              </h2>
              <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-10">
                Discover the elegance of timeless design with our newest luxury
                jewelry pieces. Celebrate the art of craftsmanship and add a
                touch of glamour to your style.
              </p>
              <Link href="/all-products">
                <button className="bg-black text-white px-6 py-3 hover:bg-gray-800 transition duration-300">
                  Explore The Collection
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Collection />

      <section
        className="py-12 px-4 sm:px-6 lg:px-8 bg-white"
        style={{ fontFamily: "var(--font-poppins)" }}
      >
        <h2
          className="text-center text-3xl sm:text-3xl mb-10 font-bold"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Star Services
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center space-y-2">
            <FaShippingFast className="text-3xl text-gray-800 mb-2" />
            <h3 className="text-md font-semibold">FAST DELIVERY</h3>
            <p className="text-sm text-gray-600">
              Enjoy fast and reliable delivery with every order.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <FaHeadset className="text-3xl text-gray-800 mb-2" />
            <h3 className="text-md font-semibold">CUSTOMER SERVICE</h3>
            <p className="text-sm text-gray-600">
              Find answers to your frequently asked questions or contact our
              team of experts.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <FaGift className="text-3xl text-gray-800 mb-2" />
            <h3 className="text-md font-semibold">GIFT SERVICES</h3>
            <p className="text-sm text-gray-600">Add a personal touch.</p>
          </div>
        </div>
      </section>

      <AboutUsSection />

      <Footer />
    </>
  );
}
