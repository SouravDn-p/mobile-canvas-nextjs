"use client";

import Image from "next/image";
import { Settings } from "lucide-react";
import Card from "../ui/card";
import CardContent from "../ui/cardContent";

export const SettingsHeader = ({ user }) => {
  // Derive display name and initials directly, similar to ProfilePage
  const displayName = user?.name || "Unnamed User";
  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "UN";

  return (
    <Card variant="gradient" className="border-b border-gray-700">
      <CardContent className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Settings Icon and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Settings
              </h1>
              <p className="text-gray-400 mt-1">
                Manage your account settings and preferences
              </p>
            </div>
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-3 bg-gray-800/50 rounded-lg p-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden">
              {user?.image ? (
                <Image
                  src={user.image || "/placeholder.svg?height=40&width=40"}
                  alt={displayName}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                userInitials
              )}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-white">{displayName}</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
