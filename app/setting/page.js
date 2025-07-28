"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { getUserDetails } from "@/lib/actions/getUser";
import { APP_NAME } from "@/lib/constants";
import { setUserDetails } from "@/lib/slice/userDetails";
import { setIsLoading } from "@/lib/slice/loading";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AccountInfoCard } from "@/components/profile/account-info-card";
import { ApiKeysCard } from "@/components/profile/api-keys-card";
import { LanguageCard } from "@/components/profile/language-card";
import { PasswordCard } from "@/components/profile/password-card";
import { ProfilePictureCard } from "@/components/profile/profile-picture-card";
import { TimezoneCard } from "@/components/profile/timezone-card";
import { TwoFactorCard } from "@/components/profile/two-factor-card";
import { SettingsNavigation } from "@/components/settings/settings-navigation";
import { SettingsHeader } from "@/components/settings/settings-header";
import { useProfile } from "@/hooks/use-profile";
import { getProfileProperty } from "@/lib/utils/user";
import Loading from "@/components/Loading";
import {
  FaUser,
  FaKey,
  FaBell,
  FaGlobe,
  FaCamera,
  FaLock,
} from "react-icons/fa";

const SettingsPage = () => {
  const dispatch = useDispatch();
  const currentUser = useCurrentUser();
  const userDetails = useSelector((state) => state.userDetails);
  const loadingState = useSelector((state) => state.loading);

  // Profile hook
  const {
    toast,
    isLoading,
    showToast,
    changePassword,
    toggleTwoFactor,
    generateApiKey,
    updateProfile,
    updateTimezone,
    updateLanguage,
    resendVerificationEmail,
  } = useProfile();

  // State management
  const [activeTab, setActiveTab] = useState("account");
  const [apiKey, setApiKey] = useState(null);
  const [twoFactor, setTwoFactor] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isUserDataLoading, setIsUserDataLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [selectedTimezone, setSelectedTimezone] = useState("21600");

  // Set document title using useEffect for client-side
  useEffect(() => {
    document.title = `Settings — ${APP_NAME}`;
  }, []);

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsUserDataLoading(true);
        const userData = await getUserDetails();

        if (userData) {
          dispatch(setUserDetails(userData));

          // Safely get properties with fallbacks
          setTwoFactor(
            getProfileProperty(userData, "isTwoFactorEnabled", false)
          );
          setSelectedLanguage(getProfileProperty(userData, "language", "en"));
          setSelectedTimezone(
            getProfileProperty(userData, "timezone", "21600")
          );

          // Set API key if exists
          const apiKeyValue = getProfileProperty(userData, "apiKey", null);
          if (apiKeyValue) {
            setApiKey({
              key: apiKeyValue,
              createdAt: getProfileProperty(
                userData,
                "apiKeyCreatedAt",
                new Date()
              ),
              updatedAt: getProfileProperty(
                userData,
                "apiKeyUpdatedAt",
                new Date()
              ),
              id: getProfileProperty(userData, "apiKeyId", 1),
              userid: userData.id,
            });
          }
        } else {
          showToast("Failed to load user data", "error");
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        showToast("Error loading user data", "error");
      } finally {
        setIsUserDataLoading(false);
        setIsPageLoading(false);
      }
    };

    if (currentUser?.id) {
      loadUserData();
    } else {
      setIsPageLoading(false);
      setIsUserDataLoading(false);
    }
  }, [currentUser?.id, dispatch, showToast]);

  // Handler functions
  const handleTwoFactorToggle = async (currentState) => {
    const newState = await toggleTwoFactor(currentState);
    setTwoFactor(newState);

    // Update Redux store
    dispatch(
      setUserDetails({
        ...userDetails,
        isTwoFactorEnabled: newState,
      })
    );

    return newState;
  };

  const handleApiKeyGeneration = async () => {
    const newApiKey = await generateApiKey();
    if (newApiKey) {
      setApiKey(newApiKey);

      // Update Redux store
      dispatch(
        setUserDetails({
          ...userDetails,
          apiKey: newApiKey.key,
          apiKeyCreatedAt: newApiKey.createdAt,
          apiKeyUpdatedAt: newApiKey.updatedAt,
          apiKeyId: newApiKey.id,
        })
      );
    }
    return newApiKey;
  };

  const handleCopyApiKey = (key) => {
    if (key) {
      navigator.clipboard.writeText(key.key).then(() => {
        showToast("API key copied to clipboard!", "success");
      });
    }
  };

  const handleUpdateProfile = async (profileData) => {
    const result = await updateProfile(profileData);
    if (result.success) {
      // Update Redux store
      dispatch(
        setUserDetails({
          ...userDetails,
          fullName: profileData.fullName,
          email: profileData.email,
          emailVerified:
            result.data?.emailVerified ||
            getProfileProperty(userDetails, "emailVerified", false),
        })
      );
    }
    return result;
  };

  const handleTimezoneSave = async () => {
    const success = await updateTimezone(selectedTimezone);
    if (success) {
      dispatch(
        setUserDetails({
          ...userDetails,
          timezone: selectedTimezone,
        })
      );
    }
    return success;
  };

  const handleLanguageSave = async () => {
    const success = await updateLanguage(selectedLanguage);
    if (success) {
      dispatch(
        setUserDetails({
          ...userDetails,
          language: selectedLanguage,
        })
      );
    }
    return success;
  };

  // Image upload handler
  const handleImageUpload = async (file) => {
    try {
      dispatch(setIsLoading(true));

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("image", file);
      formData.append("userId", currentUser?.id || "");

      const response = await fetch("/api/user/upload-profile-image", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Update Redux store with new image URL
        dispatch(
          setUserDetails({
            ...userDetails,
            image: result.imageUrl,
          })
        );

        showToast("Profile picture updated successfully!", "success");
        return { success: true, imageUrl: result.imageUrl };
      } else {
        showToast(result.message || "Failed to upload image", "error");
        return {
          success: false,
          message: result.message || "Failed to upload image",
        };
      }
    } catch (error) {
      console.error("Image upload error:", error);
      showToast("Error uploading image", "error");
      return { success: false, message: "Error uploading image" };
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  // Image delete handler
  const handleImageDelete = async () => {
    try {
      dispatch(setIsLoading(true));

      const response = await fetch("/api/user/delete-profile-image", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser?.id || "" }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Update Redux store to remove image
        dispatch(
          setUserDetails({
            ...userDetails,
            image: null,
          })
        );

        showToast("Profile picture removed successfully!", "success");
        return { success: true };
      } else {
        showToast(result.message || "Failed to delete image", "error");
        return {
          success: false,
          message: result.message || "Failed to delete image",
        };
      }
    } catch (error) {
      console.error("Image delete error:", error);
      showToast("Error deleting image", "error");
      return { success: false, message: "Error deleting image" };
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  // Show loading state if page is still loading
  if (isPageLoading || isUserDataLoading) {
    return <Loading fullScreen={true} />;
  }

  // Get user data from Redux store or fallback to current user
  const user = {
    ...currentUser,
    ...userDetails,
    id: userDetails.id || currentUser?.id || "",
  };

  // Settings navigation items
  const navigationItems = [
    {
      id: "account",
      label: "Account",
      icon: FaUser,
      description: "Manage your account information",
    },
    {
      id: "profile",
      label: "Profile",
      icon: FaCamera,
      description: "Update your profile picture",
    },
    {
      id: "security",
      label: "Security",
      icon: FaLock,
      description: "Password and security settings",
    },
    {
      id: "preferences",
      label: "Preferences",
      icon: FaGlobe,
      description: "Language and timezone settings",
    },
    {
      id: "api",
      label: "API Keys",
      icon: FaKey,
      description: "Manage your API keys",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: FaBell,
      description: "Notification preferences",
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "account":
        return (
          <div className="space-y-6">
            <AccountInfoCard
              user={user}
              isLoading={isLoading || loadingState.isLoading}
              onUpdateProfile={handleUpdateProfile}
              onResendVerification={resendVerificationEmail}
            />
          </div>
        );

      case "profile":
        return (
          <div className="space-y-6">
            <ProfilePictureCard
              user={user}
              onImageUpload={handleImageUpload}
              onImageDelete={handleImageDelete}
            />
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            <PasswordCard
              isLoading={isLoading}
              onChangePassword={changePassword}
            />
            <TwoFactorCard
              twoFactor={twoFactor}
              onToggle={handleTwoFactorToggle}
            />
          </div>
        );

      case "preferences":
        return (
          <div className="space-y-6">
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
          <div className="space-y-6">
            <ApiKeysCard
              apiKey={apiKey}
              onGenerate={handleApiKeyGeneration}
              onCopy={handleCopyApiKey}
            />
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <div className="card card-padding">
              <div className="card-header">
                <div className="card-icon">
                  <FaBell />
                </div>
                <h3 className="card-title">Notification Preferences</h3>
              </div>
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  Notification settings will be available soon. You&apos;ll be able
                  to customize how and when you receive notifications.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

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
              onTabChange={setActiveTab}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`toast toast-${toast.type} toast-enter`}>
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
