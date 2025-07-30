"use client";

import { useState } from "react";
import { FaShieldAlt, FaEye, FaEyeSlash } from "react-icons/fa";

const PasswordInput = ({ value, onChange, placeholder, className }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={className}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors duration-200"
      >
        {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
      </button>
    </div>
  );
};

const ButtonLoader = () => (
  <div className="flex items-center justify-center">
    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
  </div>
);

export const PasswordCard = ({ isLoading, onChangePassword }) => {
  const [formData, setFormData] = useState({
    currentPass: "",
    newPass: "",
    confirmNewPass: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onChangePassword(formData);
    if (success) {
      setFormData({ currentPass: "", newPass: "", confirmNewPass: "" });
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <FaShieldAlt className="text-white text-sm" />
        </div>
        <h3 className="text-xl font-semibold text-white">Change Password</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Current Password
          </label>
          <PasswordInput
            value={formData.currentPass}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                currentPass: e.target.value,
              }))
            }
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
            placeholder="Enter current password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            New Password
          </label>
          <PasswordInput
            value={formData.newPass}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                newPass: e.target.value,
              }))
            }
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
            placeholder="Enter new password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Confirm New Password
          </label>
          <PasswordInput
            value={formData.confirmNewPass}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                confirmNewPass: e.target.value,
              }))
            }
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
            placeholder="Confirm new password"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <ButtonLoader />
              <span>Updating Password...</span>
            </div>
          ) : (
            "Change Password"
          )}
        </button>
      </form>
    </div>
  );
};
