"use client";

import { FaShieldAlt } from "react-icons/fa";

const Switch = ({ checked, onClick, title }) => {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
        checked ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-gray-600"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
};

export const TwoFactorCard = ({ twoFactor, onToggle }) => {
  const handleToggle = async () => {
    await onToggle(twoFactor);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
          <FaShieldAlt className="text-white text-sm" />
        </div>
        <h3 className="text-xl font-semibold text-white">
          Two-Factor Authentication
        </h3>
      </div>

      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-6">
            <h4 className="text-white font-medium mb-2">Email-based 2FA</h4>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              When enabled, you&apos;ll receive a verification code via email each
              time you sign in. This adds an extra layer of protection to your
              account.
            </p>

            {/* Status indicator */}
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  twoFactor ? "bg-green-500" : "bg-gray-500"
                }`}
              ></div>
              <span
                className={`text-sm ${
                  twoFactor ? "text-green-400" : "text-gray-400"
                }`}
              >
                {twoFactor ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>

          <div className="flex-shrink-0">
            <Switch
              checked={twoFactor}
              onClick={handleToggle}
              title={`${
                twoFactor ? "Disable" : "Enable"
              } Two-Factor Authentication`}
            />
          </div>
        </div>

        <button
          onClick={handleToggle}
          className={`w-full py-3 px-4 font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.01] ${
            twoFactor
              ? "bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white"
              : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
          }`}
        >
          {twoFactor ? "Disable 2FA" : "Enable 2FA"}
        </button>
      </div>
    </div>
  );
};
