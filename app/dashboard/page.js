"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "../components/ui/button";
import {
  User,
  Package,
  Heart,
  Settings,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Shield,
  BarChart3,
  Users,
  Activity,
  Calendar,
  MapPin,
  Eye,
  Badge,
  ShoppingCart,
  AlertTriangle,
  Mail,
  CreditCard,
  Database,
  Server,
} from "lucide-react";
import Card from "../components/ui/card";
import CardContent from "../components/ui/cardContent";
import CardHeader from "../components/ui/cardHeader";
import CardTitle from "../components/ui/card/cardTitle";
import CardDescription from "../components/ui/card/CardDescription";
import WishlistTab from "../components/dashboard/WishlistTab";
import SettingTab from "../components/dashboard/SettingTab";
import ProfileTab from "../components/dashboard/ProfileTab";
import Link from "next/link";
import { useGetOrdersByEmailQuery } from "@/redux/api/productapi";
import OrderCard from "../components/order/OrderCard";

const Tabs = ({ children, defaultValue, className = "" }) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue);

  return (
    <div className={className} data-active-tab={activeTab}>
      {React.Children.toArray(children)
        .filter((child) => child != null) // Filter out null or undefined children
        .map((child) => React.cloneElement(child, { activeTab, setActiveTab }))}
    </div>
  );
};

const TabsList = ({ children, className = "", activeTab, setActiveTab }) => (
  <div
    className={`flex space-x-1 p-1 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl ${className}`}
  >
    {React.Children.toArray(children)
      .filter((child) => child != null)
      .map((child) => React.cloneElement(child, { activeTab, setActiveTab }))}
  </div>
);

const TabsTrigger = ({
  value,
  children,
  className = "",
  activeTab,
  setActiveTab,
}) => (
  <button
    onClick={() => setActiveTab(value)}
    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
      activeTab === value
        ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30"
        : "text-gray-400 hover:text-white hover:bg-gray-700/50"
    } ${className}`}
  >
    {children}
  </button>
);

const TabsContent = ({ value, children, className = "", activeTab }) => {
  if (activeTab !== value) return null;
  return <div className={className}>{children}</div>;
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.role === "admin";
  const router = useRouter();
  const {
    data: orderData,
    isLoading,
    error,
  } = useGetOrdersByEmailQuery(session?.user?.email, {
    skip: !session?.user?.email || isAdmin,
  });

  // Use orderData if available, otherwise fall back to mock orders
  const recentOrders =
    orderData?.orders?.length > 0 ? orderData.orders.slice(0, 5) : [];

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>
        <div className="flex items-center space-x-3 relative z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <span className="text-white text-lg">Loading Dashboard...</span>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto py-4 sm:py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                My Dashboard
              </h1>
              <p className="mt-2 text-gray-400 text-sm sm:text-base">
                {session?.user?.role === "admin"
                  ? "Admin Dashboard: Manage users and products"
                  : "Manage your profile and view your activity"}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 cursor-pointer text-sm text-gray-400">
                <Activity className="h-4 w-4 text-green-400" />
                <span>Welcome back, {session?.user?.name ?? "User"}</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Tabs */}
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="profile">
                  <div className="flex items-center space-x-2 cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Profile</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="orders">
                  <div className="flex items-center space-x-2 cursor-pointer">
                    <Package className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Orders</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="wishlist">
                  <div className="flex items-center space-x-2 cursor-pointer">
                    <Heart className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Wishlist</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="settings">
                  <div className="flex items-center space-x-2 cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Settings</span>
                  </div>
                </TabsTrigger>
                {session?.user?.role === "admin" && (
                  <TabsTrigger value="admin">
                    <div className="flex items-center space-x-2 cursor-pointer">
                      <Shield className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">Admin Panel</span>
                    </div>
                  </TabsTrigger>
                )}
              </TabsList>
              {/* Admin Tab */}
              {session?.user?.role === "admin" && (
                <TabsContent value="admin" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 hover:shadow-lg transition-all duration-300">
                      <CardHeader>
                        <CardTitle className="flex items-center text-white">
                          <Shield className="mr-2 h-5 w-5 text-purple-400" />
                          Admin Panel
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          Administrative functions and controls
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Link href="/admin" className="block">
                          <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold transition-all duration-300 hover:scale-105">
                            <BarChart3 className="mr-2 h-4 w-4" />
                            Full Admin Dashboard
                          </Button>
                        </Link>
                        <Link href="/admin/products" className="block">
                          <Button
                            variant="outline"
                            className="w-full border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-500 bg-transparent"
                          >
                            <Package className="mr-2 h-4 w-4" />
                            Manage Products
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          className="w-full border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-500 bg-transparent"
                        >
                          <Users className="mr-2 h-4 w-4" />
                          Manage Users
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-500 bg-transparent"
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          System Settings
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 hover:shadow-lg transition-all duration-300">
                      <CardHeader>
                        <CardTitle className="flex items-center text-white">
                          <BarChart3 className="mr-2 h-5 w-5 text-blue-400" />
                          Quick Stats
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          Overview of your system performance
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Users className="h-4 w-4 text-blue-400" />
                            <span className="text-white">Total Users</span>
                          </div>
                          <span className="text-white font-semibold">
                            2,847
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Package className="h-4 w-4 text-purple-400" />
                            <span className="text-white">Products</span>
                          </div>
                          <span className="text-white font-semibold">
                            1,234
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Truck className="h-4 w-4 text-green-400" />
                            <span className="text-white">Orders Today</span>
                          </div>
                          <span className="text-white font-semibold">89</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Activity className="h-4 w-4 text-orange-400" />
                            <span className="text-white">System Health</span>
                          </div>
                          <span className="text-green-400 font-semibold">
                            99.2%
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 hover:shadow-lg transition-all duration-300 group">
                      <CardContent className="p-6 text-center">
                        <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                          <Users className="h-6 w-6 text-blue-400" />
                        </div>
                        <h3 className="font-semibold text-white mb-2">
                          User Management
                        </h3>
                        <p className="text-sm text-gray-400 mb-4">
                          Manage user accounts and permissions
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white bg-transparent"
                        >
                          Manage
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 hover:shadow-lg transition-all duration-300 group">
                      <CardContent className="p-6 text-center">
                        <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                          <Package className="h-6 w-6 text-purple-400" />
                        </div>
                        <h3 className="font-semibold text-white mb-2">
                          Product Catalog
                        </h3>
                        <p className="text-sm text-gray-400 mb-4">
                          Add, edit, and organize products
                        </p>
                        <Link href="/admin/products">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white bg-transparent"
                          >
                            Manage
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 hover:shadow-lg transition-all duration-300 group">
                      <CardContent className="p-6 text-center">
                        <div className="p-3 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                          <BarChart3 className="h-6 w-6 text-green-400" />
                        </div>
                        <h3 className="font-semibold text-white mb-2">
                          Analytics
                        </h3>
                        <p className="text-sm text-gray-400 mb-4">
                          View detailed reports and insights
                        </p>
                        <Link href="/admin">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white bg-transparent"
                          >
                            View
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              )}
              <TabsContent value="profile" className="space-y-6">
                <ProfileTab />
              </TabsContent>
              {/* Orders Tab */}
              <TabsContent value="orders" className="space-y-6">
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <ShoppingCart className="mr-2 h-5 w-5 text-blue-400" />
                      Recent Orders
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Latest customer orders and their status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="animate-pulse">
                            <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                              <div className="flex items-center space-x-4">
                                <div className="h-4 bg-gray-700 rounded w-20"></div>
                                <div className="h-4 bg-gray-700 rounded w-32"></div>
                              </div>
                              <div className="h-6 bg-gray-700 rounded w-16"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {recentOrders.length === 0 ? (
                          <Card className="p-6 ">
                            <CardContent className="p-6 text-center">
                              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                              <h3 className="text-xl font-semibold text-white mb-2">
                                No Orders Found
                              </h3>
                              <p className="text-gray-400">
                                You haven&apos;t placed any orders yet.
                              </p>
                            </CardContent>
                          </Card>
                        ) : (
                          recentOrders.map((order, index) => (
                            <OrderCard
                              key={order._id || index}
                              order={order}
                              isAdmin={isAdmin}
                            />
                          ))
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              {/* Wishlist Tab */}
              <TabsContent value="wishlist" className="space-y-6">
                <WishlistTab />
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6">
                <SettingTab />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
