"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  useGetUserByEmailQuery,
  useUpdateUserMutation,
} from "@/redux/api/productapi";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import AccessDenied from "../components/shared/AccessDenied";
import Card from "../components/ui/card";
import CardHeader from "../components/ui/cardHeader";
import CardTitle from "../components/ui/card/cardTitle";
import CardDescription from "../components/ui/card/CardDescription";
import CardContent from "../components/ui/cardContent";
import Button from "../components/ui/button";

const Input = ({ className = "", ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-gray-600 bg-gray-800/50 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    {...props}
  />
);

export default function UserProfile() {
  const { data: session, status } = useSession();

  const email = session?.user?.email;
  const { data, error, isLoading } = useGetUserByEmailQuery(email, {
    skip: !email,
  });
  const [updateUser, { isLoading: updating }] = useUpdateUserMutation();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async () => {
    if (!email) return;
    await updateUser({
      email,
      data: formData,
    });
  };

  if (status === "loading" || isLoading) return <LoadingSpinner />;
  if (status === "unauthenticated") return <AccessDenied />;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  const userInfo = data?.user;

  return (
    <Card className="w-full max-w-xl mx-auto mt-10">
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
        <CardDescription>Manage your profile information.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm text-gray-400">Email</label>
          <Input value={userInfo?.email || ""} disabled />
        </div>
        <div>
          <label className="text-sm text-gray-400">Name</label>
          <Input
            name="name"
            placeholder="Enter name"
            defaultValue={userInfo?.name || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="text-sm text-gray-400">Phone</label>
          <Input
            name="phone"
            placeholder="Enter phone"
            defaultValue={userInfo?.phone || ""}
            onChange={handleChange}
          />
        </div>
        <Button onClick={handleUpdate} disabled={updating}>
          {updating ? "Saving..." : "Update Info"}
        </Button>
      </CardContent>
    </Card>
  );
}
