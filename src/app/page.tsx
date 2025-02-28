"use client";

import React, { useRef, useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Link from "next/link";
import Collection from "./Collection";
import {useAuthState} from 'react-firebase-hooks/auth';
import { auth } from '../firebase/firebaseConfig';
import Image from 'next/image';


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

      <Collection />

      <div
        className="flex flex-col md:flex-row w-full h-screen"
        style={{ fontFamily: "var(--font-poppins)" }}
      >
        <div className="w-full md:w-1/2 h-1/2 md:h-full relative">
          <Image
            src="/images/bestseller/bestseller4.jpg"
            alt="Jewelry Image"
            layout="fill"
            objectFit="cover"
            className="rounded-b-lg md:rounded-none"
          />
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-10">
          <div className="text-center max-w-md">
            <h2 className="font-serif text-3xl tracking-widest text-gray-800 mb-4">
              LUXURY JEWELRY COLLECTION
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Discover the elegance of timeless design with our newest luxury
              jewelry pieces. Celebrate the art of craftsmanship and add a touch
              of glamour to your style.
            </p>
            <button className="bg-black text-white px-6 py-3 hover:bg-gray-800 transition duration-300">
              Explore The Collection
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
