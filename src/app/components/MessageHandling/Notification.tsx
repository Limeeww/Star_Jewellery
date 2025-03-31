import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AiOutlineCheckCircle,
  AiOutlineInfoCircle,
  AiOutlineWarning,
} from "react-icons/ai";
import { BiError } from "react-icons/bi";

export type NotificationType = "success" | "info" | "warning" | "error";

export interface NotificationProps {
  message: string;
  type?: NotificationType;
  duration?: number;
  onClose?: () => void;
}

const Notification: React.FC<NotificationProps> = ({
  message,
  type = "info",
  duration = 5000,
  onClose,
}) => {
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [duration, onClose]);

  const typeStyles = {
    success: {
      bg: "bg-green-50 border-green-400",
      text: "text-green-700",
      icon: <AiOutlineCheckCircle className="text-green-600 w-5 h-5 mr-2" />,
    },
    info: {
      bg: "bg-blue-50 border-blue-400",
      text: "text-blue-700",
      icon: <AiOutlineInfoCircle className="text-blue-600 w-5 h-5 mr-2" />,
    },
    warning: {
      bg: "bg-yellow-50 border-yellow-400",
      text: "text-yellow-700",
      icon: <AiOutlineWarning className="text-yellow-600 w-5 h-5 mr-2" />,
    },
    error: {
      bg: "bg-red-50 border-red-400",
      text: "text-red-700",
      icon: <BiError className="text-red-600 w-5 h-5 mr-2" />,
    },
  };

  const { bg, text, icon } = typeStyles[type];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-4 right-4 z-50 flex items-center border-l-4 p-4 shadow-md ${bg}`}
        >
          {icon}
          <span className={`font-medium ${text}`}>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
