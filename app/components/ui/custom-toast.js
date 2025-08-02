"use client";

import { useState, useEffect, createContext, useCallback } from "react";
import { CheckCircle, XCircle, X } from "lucide-react"; // Using Lucide React for icons
import { cn } from "@/lib/utils"; // Assuming cn utility is available

// Define the ToastMessage type
/**
 * @typedef {Object} CustomToastMessage
 * @property {string} id - Unique ID for the toast.
 * @property {string} message - The message to display in the toast.
 * @property {'success' | 'error' | 'info' | 'warning'} [type='info'] - The type of toast.
 * @property {number} [duration=3000] - How long the toast should be visible in milliseconds.
 */

/** @type {React.Context<{ addToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning', duration?: number) => void }>} */
const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  /** @type {React.ComponentState<CustomToastMessage[]>} */
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 3000) => {
    const id = Date.now().toString();
    setToasts((prevToasts) => [...prevToasts, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            {...toast}
            onRemove={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

/**
 * @param {Object} props
 * @param {string} props.id
 * @param {string} props.message
 * @param {'success' | 'error' | 'info' | 'warning'} props.type
 * @param {number} props.duration
 * @param {() => void} props.onRemove
 */
const ToastItem = ({ id, message, type, duration, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onRemove]);

  const iconMap = {
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    error: <XCircle className="h-5 w-5 text-red-500" />,
    info: <CheckCircle className="h-5 w-5 text-blue-500" />, // Using CheckCircle for info, can be changed
    warning: <XCircle className="h-5 w-5 text-yellow-500" />, // Using XCircle for warning, can be changed
  };

  const colorMap = {
    success: "bg-green-100 border-green-400 text-green-800",
    error: "bg-red-100 border-red-400 text-red-800",
    info: "bg-blue-100 border-blue-400 text-blue-800",
    warning: "bg-yellow-100 border-yellow-400 text-yellow-800",
  };

  return (
    <div
      className={cn(
        "relative flex items-center justify-between p-4 pr-8 rounded-lg shadow-lg border",
        colorMap[type]
      )}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="flex items-center space-x-3">
        {iconMap[type]}
        <span className="font-medium">{message}</span>
      </div>
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 transition-colors"
        aria-label="Close toast"
      >
        <X className="h-4 w-4 text-gray-600" />
      </button>
    </div>
  );
};
