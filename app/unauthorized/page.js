"use client";

import React from "react";
import { ShieldOff, AlertTriangle } from "lucide-react";
import Link from "next/link";

// Reusable Card Component
const Card = ({ children, className = "", variant = "default", ...props }) => {
  const variants = {
    default:
      "rounded-2xl border border-gray-700/50 bg-gray-900/50 text-gray-100 shadow-xl backdrop-blur-sm",
    gradient:
      "rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/30 text-gray-100 shadow-xl backdrop-blur-sm",
    glass:
      "rounded-2xl bg-gray-900/30 border border-gray-700/30 text-gray-100 shadow-xl backdrop-blur-xl",
  };
  return (
    <div className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};

// Reusable Button Component
const Button = ({
  children,
  className = "",
  variant = "default",
  size = "default",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 transform hover:scale-105";
  const variants = {
    default:
      "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl",
    outline:
      "border border-gray-600 bg-gray-800/50 text-gray-200 hover:bg-gray-700/50 backdrop-blur-sm hover:border-gray-500",
  };
  const sizes = {
    default: "h-11 px-6 py-2",
    lg: "h-12 px-8 py-3",
  };
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <Card
        variant="glass"
        className="p-8 text-center max-w-md relative z-10 transform transition-all duration-500 hover:scale-105"
      >
        <div className="mb-8">
          <div className="relative inline-block">
            <ShieldOff className="h-20 w-20 text-red-400 mx-auto mb-4 animate-bounce" />
            <AlertTriangle className="h-10 w-10 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent mb-3">
            Admin Access Only
          </h2>
          <p className="text-gray-300 text-lg">
            This page is restricted to administrators only. Please sign in with
            an admin account to access this content.
          </p>
        </div>
        <Link href="/login">
          <Button
            variant="default"
            size="lg"
            className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 cursor-pointer"
          >
            Sign In as Admin
          </Button>
        </Link>
      </Card>
    </div>
  );
};

export default Unauthorized;
