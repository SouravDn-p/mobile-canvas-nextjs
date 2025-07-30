"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { User } from "lucide-react";
import { useSession } from "next-auth/react";

const Input = ({ className = "", error, ...props }) => (
  <input
    className={`w-full px-4 py-3 bg-gray-800/50 border ${
      error ? "border-red-500" : "border-gray-600"
    } rounded-lg focus:outline-none focus:ring-2 ${
      error ? "focus:ring-red-500" : "focus:ring-blue-500"
    } focus:border-transparent text-white placeholder-gray-400 transition-all duration-200 ${className}`}
    {...props}
  />
);

const ErrorMessage = ({ message }) => (
  <p className="text-red-400 text-xs mt-2">{message}</p>
);

export const AccountInfoCard = ({ onResendVerification }) => {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setTimeout(() => {
        setUserData({
          user: {
            name: session.user.name || "John Doe",
            email: session.user.email || "john@example.com",
            username:
              session.user.name?.toLowerCase().replace(/\s+/g, "") || "johndoe",
            emailVerified: false,
          },
        });
        setIsLoading(false);
      }, 1000);
    }
  }, [session]);

  useEffect(() => {
    if (userData?.user) {
      const user = userData.user;
      reset({
        name: user.name || session?.user?.name || "",
        email: user.email || session?.user?.email || "",
      });
    }
  }, [userData, session, reset]);

  const onSubmit = async (formData) => {
    setUpdating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setUserData((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          name: formData.name,
          email: formData.email,
        },
      }));
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      setError("Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    if (userData?.user) {
      const user = userData.user;
      reset({
        name: user.name || session?.user?.name || "",
        email: user.email || session?.user?.email || "",
      });
    }
    setIsEditing(false);
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  const user = userData?.user || session?.user;
  const isEmailVerified = user?.emailVerified || false;

  return (
    <div className="w-full p-8">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
          <User className="text-white text-sm" />
        </div>
        <h3 className="text-xl font-semibold text-white">
          Account Information
        </h3>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Username
          </label>
          <Input
            value={user?.username || user?.name || "N/A"}
            readOnly
            className="opacity-50 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Display Name
          </label>
          <Input
            {...register("name", {
              required: "Name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
            })}
            placeholder="Enter your display name"
            readOnly={!isEditing}
            error={errors.name}
            className={!isEditing ? "opacity-75" : ""}
          />
          {errors.name && <ErrorMessage message={errors.name.message} />}
          <p className="text-gray-400 text-xs mt-2">
            This is how your name appears throughout the application
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Email
          </label>
          <Input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Please enter a valid email address",
              },
            })}
            placeholder="Enter your email"
            readOnly={!isEditing}
            error={errors.email}
            className={!isEditing ? "opacity-75" : ""}
          />
          {errors.email && <ErrorMessage message={errors.email.message} />}
          {!isEmailVerified && (
            <p className="text-yellow-400 text-xs mt-2">Email not verified</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <button
                type="submit"
                disabled={updating || !isDirty}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
              >
                {updating ? "Saving..." : "Update Profile"}
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-all duration-200"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200"
            >
              Update Profile
            </button>
          )}

          {!isEmailVerified && (
            <button
              type="button"
              onClick={onResendVerification}
              className="py-3 px-6 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-medium rounded-lg transition-all duration-200"
            >
              Resend Verification Email
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
