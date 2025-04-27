import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/firebase/firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";
import Notification from "@/app/components/MessageHandling/Notification";
import { UserProfile } from "firebase/auth";

export type NotificationType = "success" | "info" | "warning" | "error";

export interface NotificationProps {
  message: string;
  type?: NotificationType;
  duration?: number;
  onClose?: () => void;
}
export const notify = (props: NotificationProps) => {
  Notification(props);
};

/**
 * Sign out the user and redirect to home page.
 */
export const signOutUser = async (router: ReturnType<typeof useRouter>) => {
  await auth.signOut();
  router.push("/");
};

/**
 * Fetch user data from Firestore.
 */
export const fetchUserData = async (userId: string) => {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

/**
 * Update or create user data in Firestore.
 */
export const updateUserProfile = async (userId: string, userData: object) => {
  const docRef = doc(db, "users", userId);
  await setDoc(docRef, userData, { merge: true });
};

/**
 * Update user profile with checks for birthday and anniversary changes.
 * Instead of throwing errors, notifications are used.
 */
export const updateUserProfileWithChecks = async (
  userId: string,
  formData: Partial<UserProfile>
) => {
  const docRef = doc(db, "users", userId);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    notify({
      message: "User document not found.",
      type: "error",
    });
    return;
  }

  const existingData = snapshot.data();
  const now = new Date();
  const updates: Record<string, unknown> = { ...formData };

  // Check for birthday change
  const birthdayChanged =
    formData.birthDay !== existingData.birthDay ||
    formData.birthMonth !== existingData.birthMonth ||
    formData.birthYear !== existingData.birthYear;

  if (birthdayChanged) {
    if (existingData.lastBirthdayChange) {
      const diffMs = now.getTime() - existingData.lastBirthdayChange.toMillis();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      if (diffDays < 30) {
        notify({
          message: "You cannot change your birthday more than once in 30 days.",
          type: "error",
        });
        return;
      }
    }
    updates.lastBirthdayChange = Timestamp.fromDate(now);
  }

  // Check for anniversary change
  const anniversaryChanged =
    formData.anniversaryDay !== existingData.anniversaryDay ||
    formData.anniversaryMonth !== existingData.anniversaryMonth ||
    formData.anniversaryYear !== existingData.anniversaryYear;

  if (anniversaryChanged) {
    if (existingData.lastAnniversaryChange) {
      const diffMs =
        now.getTime() - existingData.lastAnniversaryChange.toMillis();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      if (diffDays < 30) {
        notify({
          message:
            "You cannot change your anniversary more than once in 30 days.",
          type: "error",
        });
        return;
      }
    }
    updates.lastAnniversaryChange = Timestamp.fromDate(now);
  }

  await setDoc(docRef, updates, { merge: true });
  return { ...existingData, ...updates };
};

/**
 * Hook to fetch and manage profile data.
 */
export function useProfileData(user: { uid: string } | null) {
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  useEffect(() => {
    async function getProfileData() {
      if (user) {
        const data = await fetchUserData(user.uid);
        if (data !== null) setProfileData(data);
      }
    }
    getProfileData();
  }, [user]);
  return [profileData, setProfileData] as const;
}

/**
 * Check if the given email is already taken.
 */
export const isEmailTaken = async (email: string): Promise<boolean> => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("email", "==", email));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};
