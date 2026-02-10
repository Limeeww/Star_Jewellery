"use client";

import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import { Controller, useForm } from "react-hook-form";

import { auth } from "@/firebase/firebaseConfig";
import Navbar from "@/app/components/Navbar/Navbar";
import Footer from "@/app/components/Footer/Footer";
import Loading from "@/app/components/Loading/Loading";
import AccountLayout from "../components/AccountLayout";
import WelcomeBlock from "../components/WelcomeBlock";

import { UserData } from "@/types/userTypes";

import TextField from "@/app/components/FormComponents/TextField";
import DayInput from "@/app/components/FormComponents/DayInput";
import SelectField from "@/app/components/FormComponents/SelectField";
import SubmitButton from "@/app/components/FormComponents/SubmitButton";

import Notification from "@/app/components/MessageHandling/Notification";
import ChangeEmailModal from "@/app/Account/components/Modals/ChangeEmailModal";
import ChangePasswordModal from "@/app/Account/components/Modals/ChangePasswordModal";
import ErrorMessage from "@/app/components/MessageHandling/ErrorMessagePage";
import PhoneNumberField from "@/app/components/FormComponents/PhoneNumberField";
import CheckboxField from "@/app/components/FormComponents/CheckboxField";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchemaProfile } from "@/utils/index";
import LinkButton from "../components/LinkButton";

import { useProfileData, updateUserProfileWithChecks } from "@/utils/index";

import { useRequireAuth } from "@/hooks/index";
import { useNotification } from "@/hooks/useNotification";

export default function Profile() {
  const [user, loading, error] = useAuthState(auth);
  const { notification, notify, clearNotification } = useNotification();
  const [profileData, setProfileData] = useProfileData(user ?? null);

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useRequireAuth(user ?? null, loading);

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<Partial<UserData>>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(validationSchemaProfile) as any,
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

  const onSubmit = async (formData: Partial<UserData>) => {
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
          firstName={profileData?.firstName as string}
          lastName={profileData?.lastName as string}
        />

        <div className="mt-2 space-y-2 text-sm text-gray-800 flex flex-col">
          <h2
            className="text-2xl font-semibold mb-2"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Profile Information
          </h2>
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
            <Controller
              name="gender"
              control={control}
              rules={{ required: "Gender is required" }}
              render={({ field, fieldState }) => (
                <SelectField
                  label="Gender"
                  id="gender"
                  value={field.value || ""}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                  options={[
                    { value: "Male", label: "Male" },
                    { value: "Female", label: "Female" },
                    { value: "Other", label: "Other" },
                  ]}
                />
              )}
            />

            <Controller
              name="relationshipStatus"
              control={control}
              render={({ field, fieldState }) => (
                <SelectField
                  label="Relationship Status"
                  id="relationshipStatus"
                  value={field.value || ""}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                  options={[
                    { value: "Single", label: "Single" },
                    { value: "Married", label: "Married" },
                    { value: "Engaged", label: "Engaged" },
                  ]}
                />
              )}
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
