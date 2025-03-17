"use client";

import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/firebaseConfig";

import { validationSchemaProfile } from "../../utils/validationSchemaProfile";
import { UserData } from "@/app/types/userTypes";

import Navbar from "@/app/components/Navbar/Navbar";
import Footer from "@/app/components/Footer/Footer";
import Loading from "@/app/components/Loading/Loading";
import AccountLayout from "../components/AccountLayout";
import WelcomeBlock from "../components/WelcomeBlock";
import Notification from "../../components/MessageHandling/Notification";

import TextField from "../../components/FormComponents/TextField";
import PhoneNumberField from "../../components/FormComponents/PhoneNumberField";
import SelectField from "../../components/FormComponents/SelectField";
import CheckboxField from "../../components/FormComponents/CheckboxField";
import DayInput from "../../components/FormComponents/DayInput";
import SubmitButton from "../../components/FormComponents/SubmitButton";
import ErrorMessage from "@/app/components/MessageHandling/ErrorMessagePage";
import ChangeEmailModal from "../components/ChangeEmailModal";
import ChangePasswordModal from "../components/ChangePasswordModal";

export default function Profile() {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  const [profileDisplay, setProfileDisplay] = useState<Partial<UserData>>({});
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "info" | "warning" | "error";
  } | null>(null);

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<UserData>({
    resolver: yupResolver(validationSchemaProfile),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      birthDay: "",
      birthMonth: "",
      birthYear: "",
      gender: "",
      relationshipStatus: "",
      anniversaryDay: "",
      anniversaryMonth: "",
      anniversaryYear: "",
      marketingConsent: false,
    },
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data() as UserData;
            reset(data);
            setProfileDisplay({
              firstName: data.firstName,
              lastName: data.lastName,
            });
          }
        } catch (err) {
          console.error("Error fetching profile data:", err);
          setNotification({
            message: "Failed to load profile data.",
            type: "error",
          });
        }
      }
    };
    fetchProfileData();
  }, [user, reset]);

  const onSubmit = async (formData: UserData) => {
    if (!user) return;

    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          ...formData,
          updatedAt: new Date(),
        },
        { merge: true }
      );

      setProfileDisplay({
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      setNotification({
        message: "Profile updated successfully!",
        type: "success",
      });
    } catch (err) {
      console.error("Error updating profile:", err);
      setNotification({
        message: "Failed to update profile. Check console for details.",
        type: "error",
      });
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  return (
    <>
      <Navbar isScrolled={true} isLoggedIn={!!user} />

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          duration={3000} // 3 секунды
          onClose={() => setNotification(null)} // Скрыть после закрытия
        />
      )}

      <AccountLayout pathname="/Account/Profile">
        <WelcomeBlock
          firstName={profileDisplay.firstName}
          lastName={profileDisplay.lastName}
        />

        <div className="mt-4 mb-4  space-y-2 text-sm text-gray-700">
          <p>
            With your specified email address and password you can manage your
            personal data.
          </p>
          <button
            onClick={() => setShowEmailModal(true)}
            className="underline block"
          >
            Change Email &rarr;
          </button>
          <button
            onClick={() => setShowPasswordModal(true)}
            className="underline block"
          >
            Change Password &rarr;
          </button>
        </div>

        {showEmailModal && (
          <ChangeEmailModal
            currentEmail={user?.email || ""}
            onClose={() => setShowEmailModal(false)}
          />
        )}

        {showPasswordModal && (
          <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto space-y-6">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>

          <div className="flex flex-col md:flex-row gap-4">
            <TextField
              label="First Name"
              id="firstName"
              register={register("firstName")}
              error={errors.firstName}
              className="w-full"
            />

            <TextField
              label="Last Name"
              id="lastName"
              register={register("lastName")}
              error={errors.lastName}
              className="w-full"
            />
          </div>

          <PhoneNumberField
            label="Phone Number"
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
            label="I agree to receive newsletters, emails, text messages, and social media updates about new collections, exclusive jewellery pieces, watches, fragrances, and other premium products from Star Jewellery."
            id="marketingConsent"
            register={register("marketingConsent")}
            error={errors.marketingConsent}
          />

          <SubmitButton label="UPDATE PROFILE" />
        </form>
      </AccountLayout>

      <Footer />
    </>
  );
}
