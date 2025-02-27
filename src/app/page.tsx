import React from "react";
import Navbar from "./components/Navbar";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <div className="relative w-full h-screen">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover -z-10"
          autoPlay
          loop
          muted
          playsInline
        >
          <source
            src="/videos/background.mp4"
            type="video/mp4"
          />
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
          </div>
        </div>
      </div>
    </>
  );
}
