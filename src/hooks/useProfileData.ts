import { useEffect, useState } from "react";
import { fetchUserData } from "@/utils/firebase";
import { UserProfile } from "firebase/auth";

export function useProfileData(userId?: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!userId) return;
    fetchUserData(userId).then(
      (data) => data && setProfile(data as UserProfile)
    );
  }, [userId]);

  return [profile, setProfile] as const;
}
