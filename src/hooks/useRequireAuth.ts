import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "firebase/auth";

export function useRequireAuth(user: User | null, loading: boolean) {
  const router = useRouter();
  useEffect(() => {
    if (!loading && !user) router.push("/");
  }, [user, loading, router]);
}