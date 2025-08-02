"use client";

import { useContext } from "react";
import { ToastContext } from "@/components/ui/custom-toast";

export const useCustomToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useCustomToast must be used within a ToastProvider");
  }
  return context;
};
x