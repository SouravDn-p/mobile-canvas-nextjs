"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";

import {
  User,
  Package,
  Heart,
  Settings,
  Edit,
  Save,
  Calendar,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Card from "../components/ui/card";
import CardContent from "../components/ui/cardContent";
import CardHeader from "../components/ui/cardHeader";
import CardTitle from "../components/ui/card/cardTitle";
import CardDescription from "../components/ui/card/CardDescription";
import TabsContents from "../components/dashboard/TabsContents";
import WishlistTab from "../components/dashboard/WishlistTab";
import SettingTab from "../components/dashboard/SettingTab";
import ProfileTab from "../components/dashboard/ProfileTab";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Show loading or return null while checking auth
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-brEs-br from-black via-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "shipped":
        return <Truck className="h-4 w-4 text-blue-400" />;
      case "processing":
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-500/20 text-green-400";
      case "shipped":
        return "bg-blue-500/20 text-blue-400";
      case "processing":
        return "bg-yellow-500/20 text-yellow-400";
      case "cancelled":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Dashboard</h1>
          <p className="text-gray-400">
            {session.user.role === "admin"
              ? "Admin Dashboard: Manage users and products"
              : "Manage your profile and view your activity"}
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="glass border-white/10 border rounded-md">
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-green-500/20 cursor-pointer "
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="data-[state=active]:bg-green-500/20 cursor-pointer"
            >
              <Package className="mr-2 h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger
              value="wishlist"
              className="data-[state=active]:bg-green-500/20 cursor-pointer"
            >
              <Heart className="mr-2 h-4 w-4" />
              Wishlist
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-green-500/20 cursor-pointer"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
            {session.user.role === "admin" && (
              <TabsTrigger
                value="admin"
                className="data-[state=active]:bg-green-500/20 cursor-pointer"
              >
                <Settings className="mr-2 h-4 w-4" />
                Admin Panel
              </TabsTrigger>
            )}
          </TabsList>

          {/* Profile Tab */}
          <ProfileTab />
          {/* Orders Tab */}
          <TabsContents
            getStatusIcon={getStatusIcon}
            getStatusColor={getStatusColor}
          />
          {/* Wishlist Tab */}
          <WishlistTab />

          {/* Settings Tab */}
          <SettingTab />

          {/* Admin Panel Tab */}
          {session.user.role === "admin" && (
            <TabsContent value="admin" className="space-y-6">
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Admin Panel</CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage users and products
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-400 hover:from-purple-600 hover:to-indigo-500 text-white">
                    Manage Users
                  </Button>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-400 hover:from-purple-600 hover:to-indigo-500 text-white">
                    Manage Products
                  </Button>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-400 hover:from-purple-600 hover:to-indigo-500 text-white">
                    View Analytics
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
