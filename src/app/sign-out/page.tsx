"use client";

import React from "react";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { auth } from "../../firebase/firebaseConfig";
import Loading from "../components/Loading/Loading";
import Image from "next/image";

export default function SignOutPage() {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/");
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center w-full h-full mt-20">
        <p className="text-red-500 text-lg">Error: {error.message}</p>
      </div>
    );
  }

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

      <div className="lg:hidden w-full bg-[#E6F7F8] p-8">
        <Image
          src="/images/auth/pexels-hatice-796619215-28914388.jpg"
          alt="Tiffany Box"
          width={1200}
          height={1200}
          className="w-full h-auto object-cover"
        />
      </div>

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
