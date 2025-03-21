"use client";

import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";

import { useForm } from "react-hook-form";

import { auth, db } from "@/firebase/firebaseConfig";
import Navbar from "@/app/components/Navbar/Navbar";
import Footer from "@/app/components/Footer/Footer";
import Loading from "@/app/components/Loading/Loading";
import AccountLayout from "../components/AccountLayout";
import WelcomeBlock from "../components/WelcomeBlock";

import { UserData } from "@/app/types/userTypes";

import TextField from "../../components/FormComponents/TextField";
import DayInput from "../../components/FormComponents/DayInput";
import SelectField from "../../components/FormComponents/SelectField";
import SubmitButton from "../../components/FormComponents/SubmitButton";

import Notification from "../../components/MessageHandling/Notification";
import ChangeEmailModal from "../components/Modals/ChangeEmailModal";
import ChangePasswordModal from "../components/Modals/ChangePasswordModal";
import ErrorMessage from "@/app/components/MessageHandling/ErrorMessagePage";
import PhoneNumberField from "@/app/components/FormComponents/PhoneNumberField";
import CheckboxField from "@/app/components/FormComponents/CheckboxField";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchemaProfile } from "@/app/utils/validationSchemaProfile";

export default function Profile() {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "info" | "warning" | "error";
  } | null>(null);
  const [profileDisplay, setProfileDisplay] = useState<Partial<UserData>>({});

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
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

  const relationshipStatus = watch("relationshipStatus");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

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

  if (loading) return <Loading />;
  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  const onSubmit = async (formData: UserData) => {
    if (!user) return;

    try {
      const docRef = doc(db, "users", user.uid);
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) {
        setNotification({
          message: "User document not found.",
          type: "error",
        });
        return;
      }

      const existingData = snapshot.data() as UserData;
      const now = new Date();

      const updates: Partial<UserData> = { ...formData };

      const changingBirthday =
        formData.birthDay !== existingData.birthDay ||
        formData.birthMonth !== existingData.birthMonth ||
        formData.birthYear !== existingData.birthYear;

      if (changingBirthday) {
        if (existingData.lastBirthdayChange) {
          const diffMs =
            now.getTime() - existingData.lastBirthdayChange.toMillis();
          const diffDays = diffMs / (1000 * 60 * 60 * 24);
          if (diffDays < 30) {
            setNotification({
              message:
                "You cannot change your Birthday more than once in 30 days.",
              type: "error",
            });
            return;
          }
        }
        updates.lastBirthdayChange = Timestamp.fromDate(now);
      }

      const changingAnniversary =
        formData.anniversaryDay !== existingData.anniversaryDay ||
        formData.anniversaryMonth !== existingData.anniversaryMonth ||
        formData.anniversaryYear !== existingData.anniversaryYear;

      if (changingAnniversary) {
        if (existingData.lastAnniversaryChange) {
          const diffMs =
            now.getTime() - existingData.lastAnniversaryChange.toMillis();
          const diffDays = diffMs / (1000 * 60 * 60 * 24);
          if (diffDays < 30) {
            setNotification({
              message:
                "You cannot change your Birthday more than once in 30 days.",
              type: "error",
            });
            return;
          }
        }
        updates.lastAnniversaryChange = Timestamp.fromDate(now);
      }

      await setDoc(docRef, updates, { merge: true });

      setProfileDisplay({ ...existingData, ...updates });
      setNotification({
        message: "Profile updated successfully!",
        type: "success",
      });
    } catch (err: any) {
      setNotification({
        message: `${err.message || "Failed to update profile."}`,
        type: "error",
      });
    }
  };

  return (
    <>
      <Navbar isScrolled={true} isLoggedIn={!!user} />
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          duration={3000}
          onClose={() => setNotification(null)}
        />
      )}

      <AccountLayout pathname="/Account/Profile">
        <WelcomeBlock
          firstName={profileDisplay.firstName}
          lastName={profileDisplay.lastName}
        />

        {/* Кнопки с underline и стрелкой справа */}
        <div className="mt-4 space-y-2 text-sm text-gray-800">
          <p>
            With your specified email address and password you can manage your
            personal data.
          </p>
          <button
            onClick={() => setShowEmailModal(true)}
            className="underline flex items-center"
          >
            Change Email
            <span className="ml-1">&rarr;</span>
          </button>
          <button
            onClick={() => setShowPasswordModal(true)}
            className="underline flex items-center"
          >
            Change Password
            <span className="ml-1">&rarr;</span>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6  space-y-4">
          <h2 className="text-lg font-semibold">Profile Information</h2>

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
                { value: "Male", label: "Male" },
                { value: "Female", label: "Female" },
                { value: "Other", label: "Other" },
              ]}
            />

            <SelectField
              label="Relationship Status"
              id="relationshipStatus"
              register={register("relationshipStatus")}
              error={undefined}
              options={[
                { value: "Single", label: "Single" },
                { value: "Married", label: "Married" },
                { value: "Engaged", label: "Engaged" },
              ]}
            />

            {relationshipStatus === "Married" && (
              <DayInput
                label="Anniversary/Wedding Date"
                register={register}
                dayName="anniversaryDay"
                monthName="anniversaryMonth"
                yearName="anniversaryYear"
              />
            )}
          </div>

          <CheckboxField
            label="I agree to receive newsletters, emails, text messages, and social media updates..."
            id="marketingConsent"
            register={register("marketingConsent")}
            error={errors.marketingConsent}
          />

          <SubmitButton label=" SAVE CHANGES" />
        </form>
      </AccountLayout>
      <Footer />

      <ChangeEmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        currentEmail={user?.email || ""}
      />
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </>
  );
}
