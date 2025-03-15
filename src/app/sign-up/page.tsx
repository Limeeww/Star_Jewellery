"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

import { auth } from "../../firebase/firebaseConfig";
import {
  useCreateUserWithEmailAndPassword,
  useAuthState,
} from "react-firebase-hooks/auth";

import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Loading from "../components/Loading/Loading";

const validationSchema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .matches(/^(?=.*[0-9])/, "At least one number")
    .matches(/^(?=.*[A-Z])/, "At least one uppercase letter")
    .matches(/^(?=.*[a-z])/, "At least one lowercase letter")
    .matches(/^(?=.*[^a-zA-Z0-9])/, "At least one special character")
    .min(8, "Minimum 8 characters"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), undefined], "Passwords do not match")
    .required("Please confirm your password"),
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .test("valid-phone", "Invalid phone number", (value) => {
      return !!(value && value.replace(/\D/g, "").length >= 7);
    }),
  birthDay: yup.string().optional(),
  birthMonth: yup.string().optional(),
  birthYear: yup.string().optional(),
  gender: yup.string().optional(),
  relationshipStatus: yup.string().optional(),
  anniversaryDay: yup.string().optional(),
  anniversaryMonth: yup.string().optional(),
  anniversaryYear: yup.string().optional(),
  marketingConsent: yup.boolean().optional(),
});

export default function SignUpPage() {
  const router = useRouter();

  const [user, loading, error] = useAuthState(auth);
  const [createUserWithEmailAndPassword, userEmail, loadingEmail, errorEmail] =
    useCreateUserWithEmailAndPassword(auth);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (user || userEmail) {
      router.push("/profile");
    }
  }, [user, userEmail, router]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const passwordValue = watch("password") || "";
  const hasMinLength = passwordValue.length >= 8;
  const hasNumber = /\d/.test(passwordValue);
  const hasUppercase = /[A-Z]/.test(passwordValue);
  const hasLowercase = /[a-z]/.test(passwordValue);
  const hasSpecialChar = /[^a-zA-Z0-9]/.test(passwordValue);

  const onSubmit = async (data: any) => {
    const userCredential = await createUserWithEmailAndPassword(
      data.email,
      data.password
    );

    if (userCredential && userCredential.user) {
      const userData = {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        birthDay: data.birthDay,
        birthMonth: data.birthMonth,
        birthYear: data.birthYear,
        gender: data.gender,
        relationshipStatus: data.relationshipStatus,
        anniversaryDay: data.anniversaryDay,
        anniversaryMonth: data.anniversaryMonth,
        anniversaryYear: data.anniversaryYear,
        marketingConsent: data.marketingConsent || false,
        email: data.email,
        createdAt: new Date(),
      };

      await setDoc(doc(db, "users", userCredential.user.uid), userData);

      router.push("/Account/Overview");
    }
  };

  // Show loading / error states
  if (loading || loadingEmail) {
    return (
      <Loading/>
    );
  }

  if (error || errorEmail) {
    return (
      <div className="flex flex-col justify-center items-center w-full h-full mt-20">
        <p className="text-red-500 text-lg">
          Error: {error?.message || errorEmail?.message}
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
          onSubmit={handleSubmit(onSubmit)}
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
            className="text-3xl mb-6 text-gray-800"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Create Your Customer Account
          </h1>

          <div className="mt-6 text-sm text-gray-600">
            <p>
              With a Star Jewellery account, you can save time during checkout,
              access your shopping bag from any device, and view your order
              history.
            </p>
            <p className="mt-2">
              Already have an account?{" "}
              <Link href="/sign-in" className="underline font-medium">
                Sign In &rarr;
              </Link>
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full">
              <label
                htmlFor="firstName"
                className="block text-sm font-semibold mb-1"
              >
                First Name *
              </label>
              <input
                id="firstName"
                type="text"
                className={`w-full border p-2 ${
                  errors.firstName ? "border-red-500" : "border-gray-300"
                }`}
                {...register("firstName")}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="w-full">
              <label
                htmlFor="lastName"
                className="block text-sm font-semibold mb-1"
              >
                Last Name *
              </label>
              <input
                id="lastName"
                type="text"
                className={`w-full border p-2 ${
                  errors.lastName ? "border-red-500" : "border-gray-300"
                }`}
                {...register("lastName")}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-1">
              Email Address *
            </label>
            <input
              id="email"
              type="email"
              className={`w-full border p-2 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full">
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
                  className={`w-full border p-2 pr-10 ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("password")}
                  onFocus={() => setIsPasswordFocused(true)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-3 text-gray-600 hover:text-gray-800"
                >
                  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}

              {(isPasswordFocused || passwordValue.length > 0) && (
                <ul className="mt-2 text-sm space-y-1">
                  <li
                    className={hasMinLength ? "text-green-600" : "text-red-600"}
                  >
                    ✔ Minimum 8 characters
                  </li>
                  <li className={hasNumber ? "text-green-600" : "text-red-600"}>
                    ✔ At least one number
                  </li>
                  <li
                    className={hasUppercase ? "text-green-600" : "text-red-600"}
                  >
                    ✔ At least one uppercase letter
                  </li>
                  <li
                    className={hasLowercase ? "text-green-600" : "text-red-600"}
                  >
                    ✔ At least one lowercase letter
                  </li>
                  <li
                    className={
                      hasSpecialChar ? "text-green-600" : "text-red-600"
                    }
                  >
                    ✔ At least one special character
                  </li>
                </ul>
              )}
            </div>

            <div className="w-full">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold mb-1"
              >
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className={`w-full border p-2 pr-10 ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-3 text-gray-600 hover:text-gray-800"
                >
                  {showConfirmPassword ? (
                    <AiOutlineEyeInvisible />
                  ) : (
                    <AiOutlineEye />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-semibold mb-1"
            >
              Phone Number *
            </label>
            <Controller
              name="phoneNumber"
              control={control}
              defaultValue=""
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <div>
                  <PhoneInput
                    country="de" // Default country
                    value={value}
                    onChange={onChange}
                    enableSearch
                    containerClass="w-full"
                    inputClass="!border-0 !border-b !border-gray-300 !rounded-none !bg-transparent focus:!border-black !outline-none "
                    buttonClass="!border-0 !border-b !border-gray-300 !bg-transparent !rounded-none"
                    dropdownClass="!bg-white !border !border-gray-200"
                    preferredCountries={["de", "us", "gb", "fr"]}
                  />
                  {error && (
                    <p className="text-red-500 text-sm mt-1">{error.message}</p>
                  )}
                </div>
              )}
            />
          </div>

          <div>
            <label
              htmlFor="birthDay"
              className="block text-sm font-semibold mb-1"
            >
              Date of Birth
            </label>
            <div className="flex gap-2">
              <select
                id="birthDay"
                className="w-1/3 border border-gray-300 p-2"
                {...register("birthDay")}
              >
                <option value="">Day</option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
              <select
                id="birthMonth"
                className="w-1/3 border border-gray-300 p-2"
                {...register("birthMonth")}
              >
                <option value="">Month</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                id="birthYear"
                className="w-1/3 border border-gray-300 p-2"
                {...register("birthYear")}
              >
                <option value="">Year</option>
                {Array.from({ length: 80 }, (_, i) => 2025 - i).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <h2 className="text-base font-semibold mt-8">Optional Info</h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-semibold mb-1"
              >
                Gender
              </label>
              <select
                id="gender"
                className="w-full border-b border-gray-300 p-2 
                           focus:outline-none focus:border-black bg-transparent"
                {...register("gender")}
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="relationshipStatus"
                className="block text-sm font-semibold mb-1"
              >
                Relationship Status
              </label>
              <select
                id="relationshipStatus"
                className="w-full border-b border-gray-300 p-2 
                           focus:outline-none focus:border-black bg-transparent"
                {...register("relationshipStatus")}
              >
                <option value="">Select</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Engaged">Engaged</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="anniversaryDay"
                className="block text-sm font-semibold mb-1"
              >
                Anniversary/Wedding Date
              </label>
              <div className="flex gap-2">
                <select
                  id="anniversaryDay"
                  className="w-1/3 border border-gray-300 p-2"
                  {...register("anniversaryDay")}
                >
                  <option value="">Day</option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
                <select
                  id="anniversaryMonth"
                  className="w-1/3 border border-gray-300 p-2"
                  {...register("anniversaryMonth")}
                >
                  <option value="">Month</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
                <select
                  id="anniversaryYear"
                  className="w-1/3 border border-gray-300 p-2"
                  {...register("anniversaryYear")}
                >
                  <option value="">Year</option>
                  {Array.from({ length: 80 }, (_, i) => 2025 - i).map(
                    (year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 mt-6">
            <input
              id="marketingConsent"
              type="checkbox"
              className="mt-1"
              {...register("marketingConsent")}
            />
            <label htmlFor="marketingConsent" className="text-sm text-gray-600">
              I agree to receive newsletters, emails, text messages, and social
              media updates about new collections, exclusive jewellery pieces,
              watches, fragrances, and other premium products from Star
              Jewellery.
            </label>
          </div>

          <p className="text-xs text-gray-500 leading-relaxed">
            By clicking &quot;Create Account,&quot; you confirm that you accept
            our{" "}
            <Link href="https://www.starjewellery.com/privacy-policy">
              <span className="underline">Privacy Policy</span>
            </Link>{" "}
            and consent to receiving marketing communications about new
            collections, exclusive jewellery pieces, watches, fragrances, and
            other premium products from Star Jewellery. You can unsubscribe at
            any time or contact our customer support at{" "}
            <a href="mailto:support@starjewellery.com" className="underline">
              support@starjewellery.com
            </a>
            .
          </p>

          <button
            type="submit"
            className="w-full py-3 bg-black text-white text-sm font-semibold hover:bg-gray-800 transition-colors mt-4"
          >
            CREATE ACCOUNT
          </button>

          <p className="text-sm text-gray-600 font-light pt-2">
            *Required Fields
          </p>
        </form>
      </div>
    </div>
  );
}
