import { useEffect, useState } from "react";
import { useNotification } from "@/hooks/useNotification";
import { auth } from "@/firebase/firebaseConfig";

export function useSetupIntent(isOpen: boolean) {
  const { notify } = useNotification();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setClientSecret(null);
      return;
    }
    setLoading(true);
    auth.currentUser
      ?.getIdToken(true)
      .then((idToken) =>
        fetch("/api/stripe/setup-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        })
      )
      .then((r) => r.json())
      .then((data: { clientSecret: string }) => {
        setClientSecret(data.clientSecret);
      })
      .catch(() => {
        notify({ type: "error", message: "Не удалось получить платежный токен" });
      })
      .finally(() => setLoading(false));
  }, [isOpen, notify]);

  return { clientSecret, loading };
}