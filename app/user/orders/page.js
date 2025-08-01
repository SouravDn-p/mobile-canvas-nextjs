"use client";;

import { useState } from "react";
import Image from "next/image";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  X,
  Eye,
  Download,
  Filter,
  Search,
  Calendar,
  DollarSign,
  ShoppingBag,
} from "lucide-react";
import { useSession } from "next-auth/react";
import {
  useGetOrdersByEmailQuery,
  useGetOrdersQuery,
} from "@/redux/api/productapi";

import LoadingSpinner from "@/app/components/shared/LoadingSpinner";
import AccessDenied from "@/app/components/shared/AccessDenied";
import Button from "@/app/components/ui/button";
import Card from "@/app/components/ui/card";
import Badge from "@/app/components/ui/badge";
import CardContent from "@/app/components/ui/cardContent";
import OrderCard from "@/app/components/order/OrderCard";

const Input = ({ className = "", ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-gray-600 bg-gray-800/50 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    {...props}
  />
);

const Select = ({ children, className = "", ...props }) => (
  <select
    className={`flex h-10 w-full rounded-md border border-gray-600 bg-gray-800/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    {...props}
  >
    {children}
  </select>
);

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const email = session?.user?.email;
  const isAdmin = session?.user?.role === "admin";

  // API calls
  const { data: userOrdersData, isLoading: userOrdersLoading } =
    useGetOrdersByEmailQuery(email, {
      skip: !email || isAdmin,
    });
  const { data: allOrdersData, isLoading: allOrdersLoading } =
    useGetOrdersQuery({
      skip: !isAdmin,
    });

  // State for filtering and searching
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  // Loading state
  if (status === "loading" || userOrdersLoading || allOrdersLoading) {
    return <LoadingSpinner />;
  }

  // Unauthenticated state
  if (status === "unauthenticated") {
    return <AccessDenied />;
  }

  // Get orders based on user role
  const rawOrders = isAdmin ? allOrdersData?.orders : userOrdersData?.orders;
  const orders = rawOrders;

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items?.some((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      order.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    const matchesDate = (() => {
      if (dateFilter === "all") return true;
      const orderDate = new Date(order.createdAt);
      const now = new Date();

      switch (dateFilter) {
        case "week":
          return now - orderDate <= 7 * 24 * 60 * 60 * 1000;
        case "month":
          return now - orderDate <= 30 * 24 * 60 * 60 * 1000;
        case "year":
          return now - orderDate <= 365 * 24 * 60 * 60 * 1000;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Calculate stats
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const deliveredOrders = orders.filter(
    (order) => order.status === "delivered"
  ).length;
  const pendingOrders = orders.filter((order) =>
    ["processing", "shipped"].includes(order.status)
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto py-4 sm:py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {isAdmin ? "All Orders" : "My Orders"}
              </h1>
              <p className="mt-2 text-gray-400 text-sm sm:text-base">
                {isAdmin
                  ? "Manage and track all customer orders"
                  : "Track your order history and status"}
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-400 mb-1">
                      Total Orders
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-white">
                      {totalOrders}
                    </p>
                  </div>
                  <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20">
                    <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-400 mb-1">
                      Total Spent
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-white">
                      ৳ {totalSpent.toFixed(2)}
                    </p>
                  </div>
                  <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20">
                    <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-400 mb-1">
                      Delivered
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-white">
                      {deliveredOrders}
                    </p>
                  </div>
                  <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20">
                    <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-400 mb-1">
                      Pending
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-white">
                      {pendingOrders}
                    </p>
                  </div>
                  <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-r from-orange-500/20 to-red-500/20">
                    <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-orange-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Search Orders
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by order ID, product, or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Status
                  </label>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Date Range
                  </label>
                  <Select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  >
                    <option value="all">All Time</option>
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                    <option value="year">Last Year</option>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                      setDateFilter("all");
                    }}
                    className="w-full"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No Orders Found
                  </h3>
                  <p className="text-gray-400">
                    {searchTerm ||
                    statusFilter !== "all" ||
                    dateFilter !== "all"
                      ? "Try adjusting your filters to see more results."
                      : "You haven't placed any orders yet."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredOrders.map((order, index) => (
                <OrderCard
                  key={order._id || index}
                  order={order}
                  isAdmin={isAdmin}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
