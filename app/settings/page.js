"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  useGetUserByEmailQuery,
  useUpdateUserMutation,
} from "@/redux/api/productapi";
import Swal from "sweetalert2";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import AccessDenied from "../components/shared/AccessDenied";
import Card from "../components/ui/card";
import CardContent from "../components/ui/cardContent";
import Button from "../components/ui/button";
import { User, Key, Bell, Globe, Camera, Lock } from "lucide-react";
import { AccountInfoCard } from "../components/settings/AccountInfoCard";
import { ApiKeysCard } from "../components/settings/ApiKeysCard";
import { LanguageCard } from "../components/settings/LanguageCard";
import { PasswordCard } from "../components/settings/PasswordCard";
import { ProfilePictureCard } from "../components/settings/ProfilePictureCard";
import { TimezoneCard } from "../components/settings/TimezoneCard";
import { TwoFactorCard } from "../components/settings/TwoFactorCard";
import { SettingsNavigation } from "../components/settings/SettingsNavigation";
import { SettingsHeader } from "../components/settings/SettingsHeader";

const SettingsPage = () => {
  const { data: session, status } = useSession();
  const email = session?.user?.email;

  // RTK Query hooks
  const {
    data: userData,
    error,
    isLoading,
    refetch,
  } = useGetUserByEmailQuery(email, { skip: !email });
  const [updateUser, { isLoading: updating }] = useUpdateUserMutation();

  // Local state
  const [activeTab, setActiveTab] = useState("account");
  const [apiKey, setApiKey] = useState(null);
  const [twoFactor, setTwoFactor] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [selectedTimezone, setSelectedTimezone] = useState("21600");

  // Initialize user data
  useEffect(() => {
    if (userData?.user) {
      const user = userData.user;
      setTwoFactor(user.isTwoFactorEnabled || false);
      setSelectedLanguage(user.language || "en");
      setSelectedTimezone(user.timezone || "21600");
      setApiKey(
        user.apiKey
          ? {
              key: user.apiKey,
              createdAt: user.apiKeyCreatedAt || new Date(),
              updatedAt: user.apiKeyUpdatedAt || new Date(),
              id: user.apiKeyId || 1,
              userid: user.id,
            }
          : null
      );
    }
  }, [userData]);

  // SweetAlert2 notification
  const showAlert = (message, type = "success") => {
    Swal.fire({
      text: message,
      icon: type,
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: type === "success" ? "#16a34a" : "#dc2626",
      color: "#fff",
    });
  };

  // Handlers
  const handleUpdateProfile = async (profileData) => {
    try {
      await updateUser({ email, data: profileData }).unwrap();
      showAlert("Profile updated!");
      await refetch();
      return { success: true };
    } catch (error) {
      showAlert("Failed to update profile", "error");
      return { success: false };
    }
  };

  const handleChangePassword = async (passwordData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock API
      if (passwordData.currentPass !== "current123") {
        throw new Error("Current password is incorrect");
      }
      if (passwordData.newPass !== passwordData.confirmNewPass) {
        throw new Error("New passwords do not match");
      }
      showAlert("Password changed!");
      return true;
    } catch (error) {
      showAlert(error.message || "Failed to change password", "error");
      return false;
    }
  };

  const handleTwoFactorToggle = async (currentState) => {
    try {
      const newState = !currentState;
      await updateUser({
        email,
        data: { isTwoFactorEnabled: newState },
      }).unwrap();
      setTwoFactor(newState);
      showAlert(`2FA ${newState ? "enabled" : "disabled"}!`);
      return newState;
    } catch (error) {
      showAlert("Failed to toggle 2FA", "error");
      return currentState;
    }
  };

  const handleApiKeyGeneration = async () => {
    try {
      const newApiKey = {
        key: `sk-${Math.random().toString(36).substring(2, 15)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        id: Date.now(),
        userid: userData?.user?.id,
      };
      await updateUser({
        email,
        data: {
          apiKey: newApiKey.key,
          apiKeyCreatedAt: newApiKey.createdAt,
          apiKeyUpdatedAt: newApiKey.updatedAt,
          apiKeyId: newApiKey.id,
        },
      }).unwrap();
      setApiKey(newApiKey);
      showAlert("API key generated!");
      return newApiKey;
    } catch (error) {
      showAlert("Failed to generate API key", "error");
      return null;
    }
  };

  const handleCopyApiKey = (key) => {
    if (key) {
      navigator.clipboard.writeText(key.key);
      showAlert("API key copied!");
    }
  };

  const handleTimezoneSave = async () => {
    try {
      await updateUser({
        email,
        data: { timezone: selectedTimezone },
      }).unwrap();
      showAlert("Timezone updated!");
      return true;
    } catch (error) {
      showAlert("Failed to update timezone", "error");
      return false;
    }
  };

  const handleLanguageSave = async () => {
    try {
      await updateUser({
        email,
        data: { language: selectedLanguage },
      }).unwrap();
      showAlert("Language updated!");
      return true;
    } catch (error) {
      showAlert("Failed to update language", "error");
      return false;
    }
  };

  const handleResendVerification = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock API
      showAlert("Verification email sent!");
      return true;
    } catch (error) {
      showAlert("Failed to send verification email", "error");
      return false;
    }
  };

  const handleImageUpload = async (file) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Mock API
      const imageUrl = `/uploads/profiles/${Date.now()}-${file.name}`;
      await updateUser({ email, data: { image: imageUrl } }).unwrap();
      showAlert("Profile picture updated!");
      return { success: true, imageUrl };
    } catch (error) {
      showAlert("Failed to upload image", "error");
      return { success: false, message: error.message };
    }
  };

  const handleImageDelete = async () => {
    try {
      await updateUser({ email, data: { image: null } }).unwrap();
      showAlert("Profile picture removed!");
      return { success: true };
    } catch (error) {
      showAlert("Failed to delete image", "error");
      return { success: false, message: error.message };
    }
  };

  // Loading, unauthenticated, or error states
  if (status === "loading" || isLoading) return <LoadingSpinner />;
  if (status === "unauthenticated") return <AccessDenied />;
  if (error) {
    return (
      <Card variant="glass" className="p-6 text-center max-w-md mx-auto">
        <h2 className="text-xl font-bold text-white mb-2">
          Error Loading Settings
        </h2>
        <p className="text-gray-400 text-sm mb-4">
          {error.message || "Failed to load data"}
        </p>
        <Button variant="default" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </Card>
    );
  }

  const user = userData?.user || session?.user;

  const navigationItems = [
    {
      id: "account",
      label: "Account",
      icon: User,
      description: "Manage account info",
    },
    {
      id: "profile",
      label: "Profile",
      icon: Camera,
      description: "Update profile picture",
    },
    {
      id: "security",
      label: "Security",
      icon: Lock,
      description: "Password and security settings",
    },
    {
      id: "preferences",
      label: "Preferences",
      icon: Globe,
      description: "Language and timezone settings",
    },
    { id: "api", label: "API Keys", icon: Key, description: "Manage API keys" },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      description: "Notification preferences",
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "account":
        return (
          <AccountInfoCard
            user={user}
            isLoading={updating}
            onUpdateProfile={handleUpdateProfile}
            onResendVerification={handleResendVerification}
          />
        );
      case "profile":
        return (
          <ProfilePictureCard
            user={user}
            onImageUpload={handleImageUpload}
            onImageDelete={handleImageDelete}
          />
        );
      case "security":
        return (
          <div className="space-y-6 p-6">
            <PasswordCard
              isLoading={updating}
              onChangePassword={handleChangePassword}
            />
            <TwoFactorCard
              twoFactor={twoFactor}
              onToggle={handleTwoFactorToggle}
            />
          </div>
        );
      case "preferences":
        return (
          <div className="space-y-6 p-6">
            <TimezoneCard
              selectedTimezone={selectedTimezone}
              onTimezoneChange={setSelectedTimezone}
              onSave={handleTimezoneSave}
            />
            <LanguageCard
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
              onSave={handleLanguageSave}
            />
          </div>
        );
      case "api":
        return (
          <ApiKeysCard
            apiKey={apiKey}
            onGenerate={handleApiKeyGeneration}
            onCopy={handleCopyApiKey}
          />
        );
      case "notifications":
        return (
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-4 pt-4">
              <Bell className="h-5 w-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">
                Notifications
              </h3>
            </div>
            <p className="text-gray-400">Notification settings coming soon.</p>
          </CardContent>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <SettingsHeader user={user} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Navigation */}
          <Card className="lg:w-64 p-4">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className="w-full justify-start mb-2"
                onClick={() => setActiveTab(item.id)}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </Button>
            ))}
          </Card>

          {/* Main Content */}
          <Card className="flex-1" variant="gradient">
            {renderTabContent()}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
