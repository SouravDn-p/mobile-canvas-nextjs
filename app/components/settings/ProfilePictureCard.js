"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRef, useState } from "react";
import { FaCamera, FaSpinner, FaTrash, FaUpload } from "react-icons/fa";

export const ProfilePictureCard = ({ user, onImageUpload, onImageDelete }) => {
  const { data: session, status } = useSession();
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentImage, setCurrentImage] = useState(user.image || "");
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Please select a valid image file (JPEG, PNG, or WebP)");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError("File size must be less than 5MB");
      return;
    }

    setUploadError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target?.result);
    };
    reader.readAsDataURL(file);
    handleUpload(file);
  };

  const handleUpload = async (file) => {
    if (!onImageUpload) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const result = await onImageUpload(file);
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success && result.imageUrl) {
        setCurrentImage(result.imageUrl);
        setPreviewImage(null);
        setTimeout(() => setUploadProgress(0), 1000);
      } else {
        setUploadError(result.message || "Failed to upload image");
        setPreviewImage(null);
        setUploadProgress(0);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("An error occurred while uploading the image");
      setPreviewImage(null);
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async () => {
    if (!onImageDelete) return;

    setIsDeleting(true);
    setUploadError(null);

    try {
      const result = await onImageDelete();
      if (result.success) {
        setCurrentImage("");
        setPreviewImage(null);
      } else {
        setUploadError(result.message || "Failed to delete image");
      }
    } catch (error) {
      console.error("Delete error:", error);
      setUploadError("An error occurred while deleting the image");
    } finally {
      setIsDeleting(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const displayImage = previewImage || currentImage;

  return (
    <div className="w-full p-8">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
          <FaCamera className="text-white text-sm" />
        </div>
        <h3 className="text-xl font-semibold text-white">Profile Picture</h3>
      </div>

      <div className="space-y-6">
        {/* Profile Picture Display */}
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-600">
              {displayImage ? (
                <Image
                  width={80}
                  height={80}
                  src={displayImage || "/placeholder.svg"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    setCurrentImage("");
                    setPreviewImage(null);
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-lg font-bold">
                  {user?.name?.charAt(0) || "U"}
                </div>
              )}
            </div>

            {/* Loading Overlay */}
            {(isUploading || isDeleting) && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                <FaSpinner className="w-5 h-5 text-white animate-spin" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <p className="text-gray-300 text-sm mb-3">
              Upload a new profile picture. Supported formats: JPEG, PNG, WebP.
              Max size: 5MB.
            </p>

            {/* Upload Progress Bar */}
            {isUploading && uploadProgress > 0 && (
              <div className="mb-3">
                <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <div className="text-gray-400 text-xs mt-1">
                  Uploading... {uploadProgress}%
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={triggerFileInput}
                disabled={isUploading || isDeleting}
                className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white text-sm font-medium rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <div className="flex items-center space-x-2">
                    <FaSpinner className="w-4 h-4 animate-spin" />
                    <span>Uploading...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 cursor-pointer">
                    <FaUpload className="w-4 h-4" />
                    <span>{currentImage ? "Change" : "Upload"}</span>
                  </div>
                )}
              </button>

              {currentImage && (
                <button
                  onClick={handleDelete}
                  disabled={isUploading || isDeleting}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white text-sm font-medium rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <FaSpinner className="w-4 h-4 animate-spin" />
                  ) : (
                    <FaTrash className="w-4 h-4" />
                  )}
                </button>
              )}
              
            </div>
          </div>
        </div>

        {/* Error Message */}
        {uploadError && (
          <div className="p-3 bg-red-900/20 border border-red-800 rounded-lg">
            <p className="text-red-400 text-sm">{uploadError}</p>
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
};
