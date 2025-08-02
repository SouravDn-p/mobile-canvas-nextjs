"use client";

import React, { useState, createContext, useContext, useCallback } from "react";
import { cn } from "@/lib/utils";

/** @type {React.Context<{ open: boolean, onOpenChange: (open: boolean) => void, triggerRef: React.RefObject<HTMLButtonElement> }>} */
const AlertDialogContext = createContext(null);

export const CustomAlertDialog = ({ children }) => {
  const [open, setOpen] = useState(false);
  const triggerRef = React.useRef(null);

  const onOpenChange = useCallback((newOpen) => {
    setOpen(newOpen);
  }, []);

  return (
    <AlertDialogContext.Provider value={{ open, onOpenChange, triggerRef }}>
      {children}
    </AlertDialogContext.Provider>
  );
};

export const CustomAlertDialogTrigger = ({ children, ...props }) => {
  const context = useContext(AlertDialogContext);
  if (!context)
    throw new Error(
      "CustomAlertDialogTrigger must be used within CustomAlertDialog"
    );

  const { onOpenChange, triggerRef } = context;

  return (
    <button ref={triggerRef} onClick={() => onOpenChange(true)} {...props}>
      {children}
    </button>
  );
};

export const CustomAlertDialogContent = ({ children, className, ...props }) => {
  const context = useContext(AlertDialogContext);
  if (!context)
    throw new Error(
      "CustomAlertDialogContent must be used within CustomAlertDialog"
    );

  const { open, onOpenChange } = context;

  if (!open) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm",
        className
      )}
      role="dialog"
      aria-modal="true"
      {...props}
    >
      <div className="relative w-full max-w-md p-6 rounded-lg shadow-xl bg-gray-800 text-white border border-gray-700 animate-in fade-in-50 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95">
        {children}
      </div>
    </div>
  );
};

export const CustomAlertDialogHeader = ({ children, className, ...props }) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export const CustomAlertDialogTitle = ({ children, className, ...props }) => (
  <h3 className={cn("text-lg font-semibold text-white", className)} {...props}>
    {children}
  </h3>
);

export const CustomAlertDialogDescription = ({
  children,
  className,
  ...props
}) => (
  <p className={cn("text-sm text-gray-300", className)} {...props}>
    {children}
  </p>
);

export const CustomAlertDialogFooter = ({ children, className, ...props }) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export const CustomAlertDialogCancel = ({ children, className, ...props }) => {
  const context = useContext(AlertDialogContext);
  if (!context)
    throw new Error(
      "CustomAlertDialogCancel must be used within CustomAlertDialog"
    );
  const { onOpenChange } = context;

  return (
    <button
      onClick={() => onOpenChange(false)}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white border-none",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export const CustomAlertDialogAction = ({
  children,
  className,
  onClick,
  ...props
}) => {
  const context = useContext(AlertDialogContext);
  if (!context)
    throw new Error(
      "CustomAlertDialogAction must be used within CustomAlertDialog"
    );
  const { onOpenChange } = context;

  const handleClick = (e) => {
    onClick?.(e);
    onOpenChange(false);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-red-600 text-white hover:bg-red-700",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
