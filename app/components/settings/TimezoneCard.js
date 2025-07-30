"use client";

import { FaClock } from "react-icons/fa";

const TIMEZONES = [
  { value: "UTC", label: "🌍 UTC - Coordinated Universal Time" },
  { value: "America/New_York", label: "🇺🇸 Eastern Time (ET)" },
  { value: "America/Chicago", label: "🇺🇸 Central Time (CT)" },
  { value: "America/Denver", label: "🇺🇸 Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "🇺🇸 Pacific Time (PT)" },
  { value: "Europe/London", label: "🇬🇧 Greenwich Mean Time (GMT)" },
  { value: "Europe/Paris", label: "🇫🇷 Central European Time (CET)" },
  { value: "Europe/Berlin", label: "🇩🇪 Central European Time (CET)" },
  { value: "Asia/Tokyo", label: "🇯🇵 Japan Standard Time (JST)" },
  { value: "Asia/Shanghai", label: "🇨🇳 China Standard Time (CST)" },
  { value: "Asia/Kolkata", label: "🇮🇳 India Standard Time (IST)" },
  { value: "Australia/Sydney", label: "🇦🇺 Australian Eastern Time (AET)" },
];

export const TimezoneCard = ({
  selectedTimezone,
  onTimezoneChange,
  onSave,
}) => {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
          <FaClock className="text-white text-sm" />
        </div>
        <h3 className="text-xl font-semibold text-white">Timezone Settings</h3>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Select Timezone
          </label>
          <div className="relative">
            <select
              value={selectedTimezone}
              onChange={(e) => onTimezoneChange(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white appearance-none cursor-pointer pr-12 transition-all duration-200"
            >
              {TIMEZONES.map((tz) => (
                <option
                  key={tz.value}
                  value={tz.value}
                  className="bg-gray-800 text-white"
                >
                  {tz.label}
                </option>
              ))}
            </select>
            {/* Custom dropdown arrow */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
          <p className="text-gray-400 text-sm mt-2">
            This will be used to display times throughout the application
          </p>
        </div>

        <button
          onClick={onSave}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.01]"
        >
          Save Timezone
        </button>
      </div>
    </div>
  );
};
