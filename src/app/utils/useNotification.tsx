import { useState, useCallback } from "react";

export type NotificationType = "success" | "info" | "warning" | "error";

export interface NotificationProps {
  message: string;
  type?: NotificationType;
  duration?: number;
  onClose?: () => void;
}

export function useNotification(initialState: NotificationProps | null = null) {
  const [notification, setNotification] = useState<NotificationProps | null>(initialState);

  const notify = useCallback((props: NotificationProps) => {
    setNotification(props);
  }, []);

  const clearNotification = useCallback(() => {
    setNotification(null);
  }, []);

  return { notification, notify, clearNotification };
}
