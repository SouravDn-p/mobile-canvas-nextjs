"use client";

import { FaGlobe } from "react-icons/fa";

const LANGUAGES = [
  { value: "en", label: "🇺🇸 English" },
  { value: "es", label: "🇪🇸 Español" },
  { value: "fr", label: "🇫🇷 Français" },
  { value: "de", label: "🇩🇪 Deutsch" },
  { value: "it", label: "🇮🇹 Italiano" },
  { value: "pt", label: "🇵🇹 Português" },
  { value: "ru", label: "🇷🇺 Русский" },
  { value: "ja", label: "🇯🇵 日本語" },
  { value: "ko", label: "🇰🇷 한국어" },
  { value: "zh", label: "🇨🇳 中文" },
];

export const LanguageCard = ({
  selectedLanguage,
  onLanguageChange,
  onSave,
}) => {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
          <FaGlobe className="text-white text-sm" />
        </div>
        <h3 className="text-xl font-semibold text-white">Language Settings</h3>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Select Language
          </label>
          <div className="relative">
            <select
              value={selectedLanguage}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white appearance-none cursor-pointer pr-12 transition-all duration-200"
            >
              {LANGUAGES.map((lang) => (
                <option
                  key={lang.value}
                  value={lang.value}
                  className="bg-gray-800 text-white"
                >
                  {lang.label}
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
            Language changes will take effect immediately across the entire
            application
          </p>
        </div>

        <button
          onClick={onSave}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.01]"
        >
          Save Language
        </button>
      </div>
    </div>
  );
};
