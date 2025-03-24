"use client";

import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import { useForm } from "react-hook-form";

import { auth } from "@/firebase/firebaseConfig";
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
import LinkButton from "../components/LinkButton";


import {
  useRequireAuth,
  useProfileData,
  updateUserProfileWithChecks,
} from "../../utils/auth";
import { useNotification } from "@/app/utils/useNotification";

export default function Profile() {
  const [user, loading, error] = useAuthState(auth);
  const { notification, notify, clearNotification } = useNotification();
  const [profileData, setProfileData] = useProfileData(user);

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useRequireAuth(user, loading);

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
    if (profileData) {
      reset(profileData);
    }
  }, [profileData, reset]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error.message} />;

  const onSubmit = async (formData: UserData) => {
    if (!user) return;
    const updatedData = await updateUserProfileWithChecks(user.uid, formData);
    if (updatedData) {
      setProfileData(updatedData);
      notify({
        message: "Profile updated successfully!",
        type: "success",
      });
    }
  };
  return (
    <>
      <Navbar isScrolled={true} isLoggedIn={!!user} />
      {notification && (
        <Notification {...notification} onClose={clearNotification} />
      )}

      <AccountLayout pathname="/Account/Profile">
        <WelcomeBlock
          firstName={profileData?.firstName || ""}
          lastName={profileData?.lastName || ""}
        />

        <div className="mt-4 space-y-2 text-sm text-gray-800">
          <p>
            With your specified email address and password you can manage your
            personal data.
          </p>
          <LinkButton
            text="Change Email"
            className="underline text-sm cursor-pointer text-gray-700 hover:text-black transition-colors flex items-center"
            onClick={() => setShowEmailModal(true)}
            showArrow={true}
          />
          <LinkButton
            text="Change Password"
            className="underline text-sm cursor-pointer text-gray-700 hover:text-black transition-colors flex items-center"
            onClick={() => setShowPasswordModal(true)}
            showArrow={true}
          />
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
