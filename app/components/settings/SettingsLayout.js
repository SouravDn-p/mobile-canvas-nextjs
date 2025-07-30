"use client";

import { SettingsHeader } from "./settings-header";
import { SettingsNavigation } from "./settings-navigation";

export const SettingsLayout = ({
  user,
  children,
  navigationItems,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <SettingsHeader user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <SettingsNavigation
              items={navigationItems}
              activeTab={activeTab}
              onTabChange={onTabChange}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
