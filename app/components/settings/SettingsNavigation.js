"use client";

import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

export const SettingsNavigation = ({ items, activeTab, onTabChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTabClick = (tabId) => {
    onTabChange(tabId);
    setIsMobileMenuOpen(false); // Close mobile menu when tab is selected
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
        >
          <span className="font-medium text-gray-900 dark:text-white">
            {items.find((item) => item.id === activeTab)?.label || "Settings"}
          </span>
          {isMobileMenuOpen ? (
            <FaTimes className="w-5 h-5 text-gray-500" />
          ) : (
            <FaBars className="w-5 h-5 text-gray-500" />
          )}
        </button>
      </div>

      {/* Navigation Menu */}
      <div
        className={`
        ${isMobileMenuOpen ? "block" : "hidden"} lg:block
        bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700
      `}
      >
        <div className="p-2">
          <nav className="space-y-1">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`
                    w-full flex items-start space-x-3 px-3 py-3 rounded-lg text-left transition-all duration-200
                    ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }
                  `}
                >
                  <div
                    className={`
                    flex-shrink-0 w-5 h-5 mt-0.5
                    ${
                      isActive
                        ? "text-white"
                        : "text-gray-400 dark:text-gray-500"
                    }
                  `}
                  >
                    <Icon className="w-full h-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`
                      text-sm font-medium
                      ${
                        isActive
                          ? "text-white"
                          : "text-gray-900 dark:text-white"
                      }
                    `}
                    >
                      {item.label}
                    </p>
                    <p
                      className={`
                      text-xs mt-0.5
                      ${
                        isActive
                          ? "text-white/80"
                          : "text-gray-500 dark:text-gray-400"
                      }
                    `}
                    >
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};
