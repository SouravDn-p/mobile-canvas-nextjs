"use client";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "../components/ui/button";
import Card from "../components/ui/card";
import CardContent from "../components/ui/cardContent";
import CardHeader from "../components/ui/cardHeader";
import CardTitle from "../components/ui/card/cardTitle";
import CardDescription from "../components/ui/card/CardDescription";
import Badge from "../components/ui/badge";
import Link from "next/link";
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Eye,
  Settings,
  BarChart3,
  Activity,
  Server,
  Database,
  CreditCard,
  Mail,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  ListOrderedIcon,
} from "lucide-react";
import {
  useGetOrdersQuery,
  useGetProductsQuery,
  useGetAllUsersQuery,
} from "@/redux/api/productapi";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";

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
    className={`px-4 py-2  text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${
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

export default function AdminPage() {
  const { data: session, status } = useSession();
  const { data: orderData, isLoading, error, refetch } = useGetOrdersQuery();
  const { data: productData } = useGetProductsQuery();
  const { data: userData } = useGetAllUsersQuery();
  const productsData = productData?.data;

  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session?.user?.role !== "admin") {
      router.push("/login");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <span className="text-white text-lg">Loading Admin Dashboard...</span>
        </div>
      </div>
    );
  }

  if (!session || session?.user?.role !== "admin") {
    return null;
  }

  const stats = [
    {
      title: "Total Revenue",
      value: orderData?.orders?.reduce ((acc, order) => acc + order.total, 0)?.toFixed(2) ?? "0.00",
      change: "+12.5%",
      icon: DollarSign,
      color: "text-green-400",
      bgGradient: "from-green-500/20 to-emerald-500/20",
      glowColor: "shadow-green-500/20",
    },
    {
      title: "Total Orders",
      value: orderData?.orders?.length?.toString() ?? "0",
      change: "+8.2%",
      icon: ShoppingCart,
      color: "text-blue-400",
      bgGradient: "from-blue-500/20 to-cyan-500/20",
      glowColor: "shadow-blue-500/20",
    },
    {
      title: "Total Products",
      value: productsData?.length?.toString() ?? "0",
      change: "+3.1%",
      icon: Package,
      color: "text-purple-400",
      bgGradient: "from-purple-500/20 to-pink-500/20",
      glowColor: "shadow-purple-500/20",
    },
    {
      title: "Total Users",
      value: userData?.users?.length?.toString() ?? "0",
      change: "+15.3%",
      icon: Users,
      color: "text-orange-400",
      bgGradient: "from-orange-500/20 to-red-500/20",
      glowColor: "shadow-orange-500/20",
    },
  ];

  const recentOrders =
    orderData?.orders?.length > 0
      ? orderData?.orders?.slice(0, 5)
      : [
          {
            id: "ORD-001",
            customer: "John Doe",
            product: "Wireless Headphones",
            amount: "$89.99",
            status: "completed",
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
        ];

  const topProducts = productsData?.length > 0 ? productsData?.slice(0, 4) : [];

  const getStatusColor = (status) => {
    if (!status) return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "processing":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "shipped":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "pending":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <CheckCircle className="h-3 w-3" />;
      case "processing":
        return <Clock className="h-3 w-3" />;
      case "shipped":
        return <Zap className="h-3 w-3" />;
      default:
        return <Activity className="h-3 w-3" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto py-4 sm:py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="space-y-6 cursor-pointer sm:space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="mt-2 text-gray-400 text-sm sm:text-base">
                Welcome back, {session?.user?.name ?? "Admin"}. Here&apos;
                what&apos; happening with your store.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="success" className="px-3 py-1">
                <Activity className="h-3 w-3 mr-1" />
                System Online
              </Badge>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <Card className="border-red-500/50 bg-red-500/10">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 text-red-400">
                  <AlertTriangle className="h-5 w-5" />
                  <span>
                    Error loading data:{" "}
                    {error.message || "Please try again later"}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-300 group"
              >
                <CardContent className="pt-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-medium text-gray-400 mb-1">
                        {stat.title}
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-white mb-2">
                        {stat.value || "0"}
                      </p>
                      <div className="flex items-center text-xs text-green-400">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        <span>{stat.change || "0%"} from last month</span>
                      </div>
                    </div>
                    <div
                      className={`p-2 sm:p-3 rounded-xl bg-gradient-to-r ${stat.bgGradient} group-hover:scale-110 transition-transform duration-300`}
                    >
                      <stat.icon
                        className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="space-y-6 cursor-pointer">
            <TabsList className="w-full sm:w-auto cursor-pointer">
              <TabsTrigger className="cursor-pointer" value="overview">
                Overview
              </TabsTrigger>
              <TabsTrigger className="cursor-pointer" value="orders">
                Recent Orders
              </TabsTrigger>
              <TabsTrigger className="cursor-pointer" value="products">
                Top Products
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 cursor-pointer">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Actions */}
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
                    <Link href="/admin/orders" className="block">
                      <Button
                        variant="outline"
                        className="w-full border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-500 bg-transparent"
                      >
                        <ListOrderedIcon className="mr-2 h-4 w-4" />
                        Manage Orders
                      </Button>
                    </Link>
                    <Link href="/admin/users" className="block">
                      <Button
                        variant="outline"
                        className="w-full border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-500 bg-transparent"
                      >
                        <Users className="mr-2 h-4 w-4" />
                        Manage Users
                      </Button>
                    </Link>
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

                {/* System Status */}
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

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6 cursor-pointer">
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
                      {recentOrders?.map((order, index) => (
                        <div
                          key={order._id || `order-${index}`}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700/50 hover:bg-gray-800/50 transition-colors space-y-3 sm:space-y-0"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
                            <div>
                              <p className="font-semibold text-white text-sm sm:text-base">
                                {order._id || "N/A"}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-400">
                                {order.shippingAddress.firstName +
                                  " " +
                                  order.shippingAddress.lastName || "Unknown"}
                              </p>{" "}
                              <p className="text-xs sm:text-sm pt-1 text-gray-400">
                                Total : ৳ {order.total || "৳ 0"}
                              </p>
                            </div>
                            <div>
                              <div className="space-y-3 mb-4">
                                <h4 className="font-medium text-white">
                                  Order Items
                                </h4>
                                <div className="space-y-2 md:flex gap-2 md:space-y-0 md:space-x-2">
                                  {order?.items?.map((item, index) => (
                                    <div
                                      key={`${order._id}-${index}`}
                                      className="flex items-center space-x-3 p-2 bg-gray-800/50 rounded-lg"
                                    >
                                      <Avatar className="h-10 w-10">
                                        <AvatarImage
                                          src={item.image || "/placeholder.svg"}
                                          alt={item.name || "Product"}
                                        />
                                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                          {item.name?.charAt(0) || "P"}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1">
                                        <p className="text-white font-medium text-sm">
                                          {item.name || "Unknown Product"}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                          Qty: {item.quantity || 1} × $
                                          {(item.price || 0).toFixed(2)}
                                        </p>
                                      </div>
                                      <span className="text-white font-medium text-sm">
                                        $
                                        {(
                                          (item.price || 0) *
                                          (item.quantity || 1)
                                        ).toFixed(2)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
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
                            <Link href={`/admin/orders/${order._id}`}>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-gray-400 hover:text-white"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-6 cursor-pointer">
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
                              {product.revenue || "৳ 0"}
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
  );
}
