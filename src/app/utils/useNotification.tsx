import { useState, useCallback, useRef, useEffect } from "react";

export type NotificationType = "success" | "info" | "warning" | "error";

export interface NotificationProps {
  message: string;
  type?: NotificationType;
  duration?: number;
  onClose?: () => void;
}

export function useNotification(initialState: NotificationProps | null = null) {
  const [notification, setNotification] = useState<NotificationProps | null>(
    initialState
  );
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearNotification = useCallback(() => {
    setNotification(null);
    if (notification?.onClose) {
      notification.onClose();
    }
  }, [notification]);

  const notify = useCallback(
    (props: NotificationProps) => {
      setNotification(props);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        clearNotification();
      }, props.duration ?? 5000);
    },
    [clearNotification]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return { notify, notification, clearNotification };
}
