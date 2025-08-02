"use client";

import Image from "next/image";
import React, { useState } from "react";
import Swal from "sweetalert2";

const UploadPage = () => {
  const [images, setImages] = useState([]); // অবজেক্ট অ্যারে: { id, url, file, name }
  const [uploading, setUploading] = useState(false);
  const [cloudinaryUrls, setCloudinaryUrls] = useState([]);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }

    setUploading(true);
    const formData = new FormData();

    // ফাইলগুলো FormData-তে যোগ করা
    files.forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB লিমিট
        Swal.fire({
          icon: "error",
          title: "File Too Large",
          text: "Each image must be less than 10MB.",
          confirmButtonColor: "#EF4444",
        });
        setUploading(false);
        return;
      }
      formData.append("images", file);
    });

    try {
      // Cloudinary-তে ফাইল আপলোড
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();
      const uploadedUrls = data.urls;

      // নতুন ছবিগুলোর জন্য অবজেক্ট তৈরি করা
      const newImages = files
        .filter((file) => file.size <= 10 * 1024 * 1024) // শুধু বৈধ ফাইল
        .map((file, index) => ({
          id: Date.now() + Math.random(),
          url: uploadedUrls[index], // Cloudinary থেকে URL
          file: file,
          name: file.name,
        }));

      // images স্টেট আপডেট
      setImages((prev) => [...prev, ...newImages]);
      setCloudinaryUrls((prev) => [...prev, ...uploadedUrls]);
      console.log("Uploaded URLs:", uploadedUrls);
    } catch (error) {
      console.error("Upload error:", error);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "Could not upload images to Cloudinary.",
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        Upload Multiple Images to Cloudinary
      </h2>
      <form className="space-y-4">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {images.length > 0 && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image) => (
            <Image
              width={200}
              height={200}
              key={image.id}
              src={image.url}
              alt={image.name}
              className="w-full rounded shadow"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UploadPage;
