"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

import {
  useSignInWithGoogle,
  useSignInWithEmailAndPassword,
} from "react-firebase-hooks/auth";
import { auth } from "../../firebase/firebaseConfig";
import Loading from "../components/Loading/Loading";

export default function SignInPage() {
  const router = useRouter();

  const [signInWithGoogle, userGoogle, loadingGoogle, errorGoogle] =
    useSignInWithGoogle(auth);
  const [signInWithEmailAndPassword, userEmail, loadingEmail, errorEmail] =
    useSignInWithEmailAndPassword(auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (userGoogle || userEmail) {
      router.push("/Account/Overview");
    }
  }, [userGoogle, userEmail, router]);

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    await signInWithEmailAndPassword(email, password);
  };

  if (loadingGoogle || loadingEmail) {
    return (
      <Loading/>
    );
  }

  if (errorGoogle || errorEmail) {
    return (
      <div className="flex flex-col justify-center items-center w-full h-full mt-20">
        <p className="text-red-500 text-lg">
          Error: {errorGoogle?.message || errorEmail?.message}
        </p>
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

      <div className="w-full lg:w-1/2 overflow-y-auto p-8 bg-white">
        <form
          onSubmit={handleEmailSignIn}
          className="w-full max-w-md mx-auto space-y-6"
        >
          <button
            type="button"
            onClick={() => router.push("/")}
            className="mb-4 underline text-gray-600 hover:text-gray-800"
          >
            &larr; Back to Home
          </button>
          <h1
            className="text-3xl mb-6 text-gray-800 text-center"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Sign In
          </h1>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-1">
              Email Address *
            </label>
            <input
              id="email"
              type="email"
              className="w-full border p-2 border-gray-300"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold mb-1"
            >
              Password *
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="w-full border p-2 border-gray-300 pr-10"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-3 text-gray-600 hover:text-gray-800"
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-black text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
          >
            SIGN IN
          </button>

          <p className="text-sm text-gray-600 font-light pt-2">
            *Required fields
          </p>

          <div className="mt-6 text-sm text-gray-600 text-center">
            <p>
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="underline font-medium">
                Create an Account
              </Link>
            </p>
          </div>
          <div className="flex items-center justify-center">
            <button
              onClick={handleGoogleSignIn}
              className="flex items-center bg-white border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium  hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <svg
                className="h-6 w-6 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                width="800px"
                height="800px"
                viewBox="-0.5 0 48 48"
                version="1.1"
              >
                {" "}
                <title>Google-color</title> <desc>Created with Sketch.</desc>{" "}
                <defs> </defs>{" "}
                <g
                  id="Icons"
                  stroke="none"
                  strokeWidth="1"
                  fill="none"
                  fill-rule="evenodd"
                >
                  {" "}
                  <g
                    id="Color-"
                    transform="translate(-401.000000, -860.000000)"
                  >
                    {" "}
                    <g
                      id="Google"
                      transform="translate(401.000000, 860.000000)"
                    >
                      {" "}
                      <path
                        d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24"
                        id="Fill-1"
                        fill="#FBBC05"
                      >
                        {" "}
                      </path>{" "}
                      <path
                        d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333"
                        id="Fill-2"
                        fill="#EB4335"
                      >
                        {" "}
                      </path>{" "}
                      <path
                        d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667"
                        id="Fill-3"
                        fill="#34A853"
                      >
                        {" "}
                      </path>{" "}
                      <path
                        d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24"
                        id="Fill-4"
                        fill="#4285F4"
                      >
                        {" "}
                      </path>{" "}
                    </g>{" "}
                  </g>{" "}
                </g>{" "}
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>
        </form>

        <div className="w-full h-px bg-gray-200 my-8" />

        <div className="max-w-md mx-auto">
          <h2
            className="text-xl mb-4 text-gray-800 font-semibold"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            With Your Account You Can:
          </h2>
          <ul className="list-none space-y-2 text-sm text-gray-700">
            <li>• Checkout faster </li>
            <li>• Access your shopping bag from any device</li>
            <li>• View your order history</li>
            <li>• Wrapp gift complimentary </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
