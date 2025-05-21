"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Loading from "@/app/components/Loading/Loading";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { auth } from "@/firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import { useProtectRoute } from "@/hooks";

export default function SignOutPage() {
  const router = useRouter();

  useProtectRoute("/sign-in");

  const { user, loading, isLoggedIn } = useAuthStatus();

  if (loading) {
    return <Loading />;
  }

  if (!isLoggedIn) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <div
      className="flex flex-col lg:flex-row min-h-screen"
      style={{ fontFamily: "var(--font-poppins)" }}
    >
      <div className="hidden lg:block lg:w-1/2 bg-[#E6F7F8] relative">
        <div className="sticky top-0 h-screen flex items-center justify-center p-8">
          <Image
            src="/images/auth/pexels-hatice-796619215-28914388.jpg"
            alt="Tiffany Box"
            width={1200}
            height={1200}
            className="w-full h-screen object-cover"
          />
        </div>
      </div>

      {/* Мобильное изображение */}
      <div className="lg:hidden w-full bg-[#E6F7F8] p-8">
        <Image
          src="/images/auth/pexels-hatice-796619215-28914388.jpg"
          alt="Tiffany Box"
          width={1200}
          height={1200}
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Основной блок */}
      <div className="w-full lg:w-1/2 overflow-y-auto p-8 bg-white flex flex-col items-center justify-center">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="mb-4 underline text-gray-600 hover:text-gray-800 self-start"
        >
          &larr; Back to Home
        </button>

        <h1
          className="font-semibold text-5xl mt-20 mb-12 text-center"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Hi, {user?.displayName || user?.email}
        </h1>

        <button
          onClick={handleSignOut}
          className="w-full py-3 bg-black text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
        >
          SIGN OUT
        </button>
      </div>
    </div>
  );
}
