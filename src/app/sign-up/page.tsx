"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../../firebase/firebaseConfig";

import {
  useCreateUserWithEmailAndPassword,
  useAuthState,
} from "react-firebase-hooks/auth";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { UserData } from "../types/userTypes";
import { validationSchema } from "../utils/validationSchema";

import TextField from "../components/FormComponents/TextField";
import PasswordField from "../components/FormComponents/PasswordField";
import PhoneNumberField from "../components/FormComponents/PhoneNumberField";
import SelectField from "../components/FormComponents/SelectField";
import CheckboxField from "../components/FormComponents/CheckboxField";
import DayInput from "../components/FormComponents/DayInput";

import Loading from "../components/Loading/Loading";
import SubmitButton from "../components/FormComponents/SubmitButton";

import Notification from "../components/MessageHandling/Notification";
import { useNotification } from "../utils/useNotification";

export default function SignUpPage() {
  const router = useRouter();

  const [user, loading, error] = useAuthState(auth);
  
  const [createUserWithEmailAndPassword, userEmail, loadingEmail, errorEmail] =
    useCreateUserWithEmailAndPassword(auth);

  const { notify, notification, clearNotification } = useNotification();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<UserData>({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (user || userEmail) {
      router.push("/Account/Overview");
    }
  }, [user, userEmail, router]);

  useEffect(() => {
    if (error) {
      notify({
        type: "error",
        message: error.message || "Unknown error",
      });
    } else if (errorEmail) {
      let msg = errorEmail.message;
      if (errorEmail.code === "auth/weak-password") {
        msg = "Your password is too weak. Please choose a stronger one.";
      }
      notify({
        type: "error",
        message: msg,
      });
    }
  }, [error, errorEmail, notify]);

  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const passwordValue = watch("password") || "";
  const hasMinLength = passwordValue.length >= 8;
  const hasNumber = /\d/.test(passwordValue);
  const hasUppercase = /[A-Z]/.test(passwordValue);
  const hasLowercase = /[a-z]/.test(passwordValue);
  const hasSpecialChar = /[^a-zA-Z0-9]/.test(passwordValue);

  const onSubmit = async (data: UserData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        data.email,
        data.password
      );

      if (userCredential && userCredential.user) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, confirmPassword, ...userData } = data;

        const finalUserData = {
          ...userData,
          createdAt: new Date(),
          wishList: userData.wishList || [],
          orders: userData.orders || [],
          addresses: userData.addresses || [],
          bonuses: userData.bonuses || "0",
          cartItems: userData.cartItems || [],
          role: "user",
        };
        await setDoc(doc(db, "users", userCredential.user.uid), finalUserData);
        router.push("/Account/Overview");
      }
    } catch (err: any) {
      notify({
        type: "error",
        message: err.message || "Failed to create account.",
      });
    }
  };

  if (loading || loadingEmail) {
    return <Loading />;
  }

  return (
    <div
      className="flex flex-col lg:flex-row min-h-screen"
      style={{ fontFamily: "var(--font-poppins)" }}
    >
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={clearNotification}
        />
      )}

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
            <TextField
              label="First Name *"
              id="firstName"
              register={register("firstName")}
              error={errors.firstName}
              className="w-full"
            />
            <TextField
              label="Last Name *"
              id="lastName"
              register={register("lastName")}
              error={errors.lastName}
              className="w-full"
            />
          </div>

          <TextField
            label="Email Address *"
            id="email"
            type="email"
            register={register("email")}
            error={errors.email}
          />

          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full">
              <PasswordField
                label="Password *"
                id="password"
                register={register("password")}
                onFocus={() => setIsPasswordFocused(true)}
                error={errors.password}
              />
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

            <PasswordField
              label="Confirm Password *"
              id="confirmPassword"
              register={register("confirmPassword")}
              error={errors.confirmPassword}
              className="w-full"
            />
          </div>

          <PhoneNumberField
            label="Phone Number *"
            name="phoneNumber"
            control={control}
            error={errors.phoneNumber}
          />

          <DayInput
            label="Date of Birth"
            register={register}
            dayName="birthDay"
            monthName="birthMonth"
            yearName="birthYear"
          />

          <h2 className="text-base font-semibold mt-8">Optional Info</h2>
          <div className="space-y-4">
            <SelectField
              label="Gender"
              id="gender"
              register={register("gender")}
              error={errors.gender}
              options={[
                { value: "", label: "Select" },
                { value: "Male", label: "Male" },
                { value: "Female", label: "Female" },
                { value: "Other", label: "Other" },
              ]}
            />

            <SelectField
              label="Relationship Status"
              id="relationshipStatus"
              register={register("relationshipStatus")}
              error={errors.relationshipStatus}
              options={[
                { value: "", label: "Select" },
                { value: "Single", label: "Single" },
                { value: "Married", label: "Married" },
                { value: "Engaged", label: "Engaged" },
              ]}
            />

            <DayInput
              label="Anniversary/Wedding Date"
              register={register}
              dayName="anniversaryDay"
              monthName="anniversaryMonth"
              yearName="anniversaryYear"
            />
          </div>

          <CheckboxField
            label="I agree to receive newsletters, emails, text messages, and social media updates..."
            id="marketingConsent"
            register={register("marketingConsent")}
            error={errors.marketingConsent}
          />

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

          <SubmitButton
            label="CREATE ACCOUNT"
            isLoading={loading || loadingEmail}
          />

          <p className="text-sm text-gray-600 font-light pt-2">
            *Required Fields
          </p>
        </form>
      </div>
    </div>
  );
}
