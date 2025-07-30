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
import Image from "next/image";
import { useGetOrdersQuery } from "@/redux/api/productapi";

const Tabs = ({ children, defaultValue, className = "" }) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue);
  return (
    <div className={className} data-active-tab={activeTab}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { activeTab, setActiveTab })
      )}
    </div>
  );
};

const TabsList = ({ children, className = "", activeTab, setActiveTab }) => (
  <div
    className={`flex space-x-1 p-1 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl ${className}`}
  >
    {React.Children.map(children, (child) =>
      React.cloneElement(child, { activeTab, setActiveTab })
    )}
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
  const router = useRouter();
  const { data: orderData, isLoading, error } = useGetOrdersQuery();

  // Mock top products data to avoid undefined errors
  const topProducts = [
    { name: "Wireless Headphones", sales: 150, revenue: "$13,499.50" },
    { name: "Gaming Mouse", sales: 120, revenue: "$5,519.80" },
    { name: "Mechanical Keyboard", sales: 80, revenue: "$10,399.20" },
    { name: "Phone Case", sales: 200, revenue: "$3,998.00" },
  ];

  // Use orderData if available, otherwise fall back to mock orders
  const recentOrders =
    orderData?.orders?.length > 0
      ? orderData.orders.slice(0, 5)
      : [
          {
            id: "ORD-001",
            customer: "John Doe",
            product: "Wireless Headphones",
            amount: "$89.99",
            status: "delivered",
            date: "2024-01-15",
          },
          {
            id: "ORD-002",
            customer: "Jane Smith",
            product: "Gaming Mouse",
            amount: "$45.99",
            status: "processing",
            date: "2024-01-15",
          },
          {
            id: "ORD-003",
            customer: "Mike Johnson",
            product: "Mechanical Keyboard",
            amount: "$129.99",
            status: "shipped",
            date: "2024-01-14",
          },
        ];

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
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "shipped":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "processing":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

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
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Activity className="h-4 w-4 text-green-400" />
                <span>Welcome back, {session?.user?.name ?? "User"}</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="w-full sm:w-auto flex space-x-1 p-1 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl">
                <TabsTrigger value="profile">
                  <User className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger value="orders">
                  <Package className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Orders</span>
                </TabsTrigger>
                <TabsTrigger value="wishlist">
                  <Heart className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Wishlist</span>
                </TabsTrigger>
                <TabsTrigger value="settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Settings</span>
                </TabsTrigger>
                {session?.user?.role === "admin" && (
                  <TabsTrigger value="admin">
                    <Shield className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Admin Panel</span>
                  </TabsTrigger>
                )}
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                <ProfileTab />
              </TabsContent>

              {/* Orders Tab */}
              <TabsContent value="orders" className="space-y-6">
                <Card className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <Package className="mr-2 h-5 w-5 text-purple-400" />
                      My Orders
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Track and manage your orders
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="animate-pulse">
                            <div className="flex items-center space-x-4 p-4 bg-gray-800/30 rounded-lg">
                              <div className="h-16 w-16 bg-gray-700 rounded-lg"></div>
                              <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                              </div>
                              <div className="h-6 w-20 bg-gray-700 rounded"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (orderData?.orders ?? []).length === 0 ? (
                      <div className="text-center py-12">
                        <Package className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">
                          No orders yet
                        </h3>
                        <p className="text-gray-400 mb-6">
                          Start shopping to see your orders here
                        </p>
                        <Link href="/products">
                          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                            Browse Products
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {(orderData?.orders ?? []).map((order, index) => (
                          <div
                            key={order?.id ?? `order-${index}`}
                            className="bg-gray-800/30 rounded-lg border border-gray-700/30 p-4 hover:bg-gray-800/40 transition-all duration-300"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
                              <div className="flex items-center space-x-4">
                                <div>
                                  <h3 className="font-semibold text-white">
                                    {order?.id ?? "N/A"}
                                  </h3>
                                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                                    <Calendar className="h-4 w-4" />
                                    <span>
                                      {order?.date
                                        ? new Date(
                                            order.date
                                          ).toLocaleDateString()
                                        : "N/A"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <div
                                  className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                    order?.status ?? "unknown"
                                  )}`}
                                >
                                  {getStatusIcon(order?.status ?? "unknown")}
                                  <span className="capitalize">
                                    {order?.status ?? "Unknown"}
                                  </span>
                                </div>
                                <span className="font-semibold text-white">
                                  {order?.total ?? "$0.00"}
                                </span>
                              </div>
                            </div>

                            <div className="space-y-3 mb-4">
                              {(order?.items ?? []).map((item, itemIndex) => (
                                <div
                                  key={itemIndex}
                                  className="flex items-center space-x-3"
                                >
                                  <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-gray-700">
                                    <Image
                                      src={item?.image ?? "/placeholder.svg"}
                                      alt={item?.name ?? "Product"}
                                      fill
                                      className="object-cover"
                                      sizes="48px"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="text-white font-medium text-sm">
                                      {item?.name ?? "Unknown Product"}
                                    </h4>
                                    <p className="text-gray-400 text-xs">
                                      Qty: {item?.quantity ?? 0}
                                    </p>
                                  </div>
                                  <span className="text-white font-medium text-sm">
                                    {item?.price ?? "$0.00"}
                                  </span>
                                </div>
                              ))}
                            </div>

                            <div className="border-t border-gray-700/50 pt-3">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                                <div className="flex items-center space-x-2 text-sm text-gray-400">
                                  <MapPin className="h-4 w-4" />
                                  <span className="truncate">
                                    {order?.shippingAddress ?? "N/A"}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {order?.trackingNumber && (
                                    <div className="text-sm text-gray-400">
                                      Tracking:{" "}
                                      <span className="text-purple-400">
                                        {order.trackingNumber}
                                      </span>
                                    </div>
                                  )}
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white bg-transparent"
                                  >
                                    <Eye className="h-4 w-4 mr-1" />
                                    Details
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20">
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Delivered</p>
                          <p className="text-lg font-semibold text-white">
                            {
                              (orderData?.orders ?? []).filter(
                                (order) => order?.status === "delivered"
                              ).length
                            }
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20">
                          <Truck className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Shipped</p>
                          <p className="text-lg font-semibold text-white">
                            {
                              (orderData?.orders ?? []).filter(
                                (order) => order?.status === "shipped"
                              ).length
                            }
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20">
                          <Clock className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Processing</p>
                          <p className="text-lg font-semibold text-white">
                            {
                              (orderData?.orders ?? []).filter(
                                (order) => order?.status === "processing"
                              ).length
                            }
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20">
                          <Package className="h-5 w-5 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Total Orders</p>
                          <p className="text-lg font-semibold text-white">
                            {(orderData?.orders ?? []).length}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Wishlist Tab */}
              <TabsContent value="wishlist" className="space-y-6">
                <WishlistTab />
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6">
                <SettingTab />
              </TabsContent>

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

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="flex items-center text-white">
                        <Settings className="mr-2 h-5 w-5 text-purple-400" />
                        Quick Actions
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Common administrative tasks
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Link href="/admin/products" className="block">
                        <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold transition-all duration-300 hover:scale-105">
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
                        <BarChart3 className="mr-2 h-4 w-4" />
                        View Analytics
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

                  <Card className="hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="flex items-center text-white">
                        <Server className="mr-2 h-5 w-5 text-blue-400" />
                        System Status
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Current system health and performance
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Server className="h-4 w-4 text-green-400" />
                          <span className="text-white">Server Status</span>
                        </div>
                        <Badge
                          variant="success"
                          className="border border-green-500/30"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Online
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Database className="h-4 w-4 text-green-400" />
                          <span className="text-white">Database</span>
                        </div>
                        <Badge
                          variant="success"
                          className="border border-green-500/30"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <CreditCard className="h-4 w-4 text-green-400" />
                          <span className="text-white">Payment Gateway</span>
                        </div>
                        <Badge
                          variant="success"
                          className="border border-green-500/30"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Mail className="h-4 w-4 text-yellow-400" />
                          <span className="text-white">Email Service</span>
                        </div>
                        <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Warning
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Recent Orders Tab */}
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
                      <div className="space-y-3">
                        {recentOrders.map((order, index) => (
                          <div
                            key={order.id || `order-${index}`}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700/50 hover:bg-gray-800/50 transition-colors space-y-3 sm:space-y-0"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
                              <div>
                                <p className="font-semibold text-white text-sm sm:text-base">
                                  {order.id || "N/A"}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-400">
                                  {order.customer || "Unknown"}
                                </p>
                              </div>
                              <div>
                                <p className="text-white text-sm sm:text-base">
                                  {order.product || "No product"}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-400">
                                  {order.amount || "$0"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end space-x-3">
                              <Badge
                                className={`${getStatusColor(
                                  order.status
                                )} border text-xs`}
                              >
                                {getStatusIcon(order.status)}
                                <span className="ml-1">
                                  {(order.status || "N/A")
                                    .charAt(0)
                                    .toUpperCase() +
                                    (order.status || "N/A").slice(1)}
                                </span>
                              </Badge>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-gray-400 hover:text-white"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Top Products Tab */}
              <TabsContent value="products" className="space-y-6">
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <Package className="mr-2 h-5 w-5 text-purple-400" />
                      Top Selling Products
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Best performing products this month
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="animate-pulse">
                            <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                              <div className="flex items-center space-x-4">
                                <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                                <div className="h-4 bg-gray-700 rounded w-32"></div>
                              </div>
                              <div className="h-4 bg-gray-700 rounded w-20"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {topProducts.map((product, index) => (
                          <div
                            key={index}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700/50 hover:bg-gray-800/50 transition-colors space-y-3 sm:space-y-0"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {index + 1}
                              </div>
                              <div>
                                <p className="font-semibold text-white text-sm sm:text-base">
                                  {product.name || "No product"}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-400">
                                  {product.sales || 0} units sold
                                </p>
                              </div>
                            </div>
                            <div className="text-left sm:text-right">
                              <p className="font-semibold text-white text-sm sm:text-base">
                                {product.revenue || "$0"}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-400">
                                Revenue
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
