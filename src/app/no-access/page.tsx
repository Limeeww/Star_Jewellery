"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar/Navbar";
import Footer from "@/app/components/Footer/Footer";
import { AiOutlineLock } from "react-icons/ai";
import ActionButton from "@/app/components/FormComponents/ActionButton";

export default function NoAccessPage() {
  const router = useRouter();

  return (
    <>
      <Navbar isScrolled={false} isLoggedIn={false} />

      <main
        className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 text-gray-800"
        style={{ fontFamily: "var(--font-poppins)" }}
      >
        <div className="text-center space-y-6">
          <AiOutlineLock className="mx-auto text-6xl text-gray-600" />
          <h1
            className="text-4xl font-semibold"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Access Denied
          </h1>
          <p className="max-w-md">
            To access your account, please sign in or create a new one.
          </p>

          <div className="flex justify-center gap-2">
            <ActionButton
              text="Sign In"
              onClick={() => router.push("/sign-in")}
              className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
            />
            <ActionButton
              text="Sign Up"
              onClick={() => router.push("/sign-up")}
              className="px-6 py-2 border border-black text-black rounded hover:bg-gray-100 transition"
            />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
