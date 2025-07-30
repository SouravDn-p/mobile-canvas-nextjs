"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Package,
  Search,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  DollarSign,
  Calendar,
  User,
  MapPin,
  Phone,
  Mail,
  Download,
  RefreshCw,
  AlertTriangle,
  ShoppingBag,
  CreditCard,
} from "lucide-react";
import Image from "next/image";
import {
  useGetOrdersQuery,
  useUpdateOrderMutation,
} from "@/redux/api/productapi";
import Button from "@/app/components/ui/button";
import Card from "@/app/components/ui/card";
import CardContent from "@/app/components/ui/cardContent";
import CardHeader from "@/app/components/ui/cardHeader";
import CardTitle from "@/app/components/ui/card/cardTitle";
import CardDescription from "@/app/components/ui/card/CardDescription";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import Link from "next/link";

const AdminOrdersPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data: ordersData, isLoading, error, refetch } = useGetOrdersQuery();
  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPayment, setFilterPayment] = useState("all");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session?.user?.role !== "admin") {
      router.push("/login");
    }
  }, [session, status, router]);

  // Updated mock orders data from provided JSON
  const mockOrders = [
    {
      _id: "686e9dac767ed8847ab8683e",
      email: "sdsouravdebnath27@gmail.com",
      customerName: "Sourav Debnath",
      customerPhone: "01663423432",
      items: [
        {
          productId: "685ba1b1ec7db7325ac4c921",
          name: "Desk Lamp",
          price: 49.99,
          quantity: 1,
          image:
            "https://www.gadstyle.com/wp-content/uploads/2025/05/usb-rechargeable-table-lamp-touch-dimming-portable-night-light-2600mah-1.webp",
        },
      ],
      total: 59.98,
      status: "processing",
      payment: "pending",
      shippingAddress: {
        firstName: "Sourav",
        lastName: "Debnath",
        address: "kalikaccha",
        city: "Brahmanbaria",
        state: "Dhaka",
        zipCode: "3430",
        country: "Bangladesh",
      },
      paymentMethod: {
        type: "Cash On Delivery",
        mobileNumber: "01663423432",
      },
      createdAt: "2025-07-09T16:49:48.467Z",
      updatedAt: "2025-07-09T16:49:48.467Z",
    },
    {
      _id: "686e9a26767ed8847ab8683d",
      email: "sdsouravdebnath27@gmail.com",
      customerName: "Sourav Debnath",
      customerPhone: "8801634234323",
      items: [
        {
          productId: "68660ded3ca5534a438b268e",
          name: "Bose QuietComfort Earbuds",
          price: 279,
          quantity: 1,
          image:
            "https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg",
        },
      ],
      total: 279,
      status: "processing",
      payment: "pending",
      shippingAddress: {
        firstName: "Sourav",
        lastName: "Debnath",
        address: "kalikaccha",
        city: "Brahmanbaria",
        state: "Rajshahi",
        zipCode: "3430",
        country: "Bangladesh",
      },
      paymentMethod: {
        type: "Cash On Delivery",
        mobileNumber: "8801634234323",
      },
      createdAt: "2025-07-09T16:34:46.581Z",
      updatedAt: "2025-07-09T16:34:46.581Z",
    },
    {
      _id: "686e99ad767ed8847ab8683c",
      email: "sdsouravdebnath27@gmail.com",
      customerName: "Sourav Debnath",
      customerPhone: "8801634234323",
      items: [
        {
          productId: "68660ded3ca5534a438b268e",
          name: "Bose QuietComfort Earbuds",
          price: 279,
          quantity: 1,
          image:
            "https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg",
        },
      ],
      total: 279,
      status: "processing",
      payment: "pending",
      shippingAddress: {
        firstName: "Sourav",
        lastName: "Debnath",
        address: "kalikaccha",
        city: "Brahmanbaria",
        state: "Rajshahi",
        zipCode: "3430",
        country: "Bangladesh",
      },
      paymentMethod: {
        type: "Cash On Delivery",
        mobileNumber: "8801634234323",
      },
      createdAt: "2025-07-09T16:32:44.481Z",
      updatedAt: "2025-07-09T16:32:44.481Z",
    },
    {
      _id: "686e9724767ed8847ab8683b",
      email: "sdsouravdebnath27@gmail.com",
      customerName: "Sourav Debnath",
      customerPhone: null,
      items: [
        {
          productId: "p1001",
          name: "Wireless Mouse",
          quantity: 2,
          price: 19.99,
          image: "/placeholder.svg",
        },
        {
          productId: "p1003",
          name: "USB-C Hub",
          quantity: 1,
          price: 34.99,
          image: "/placeholder.svg",
        },
      ],
      total: 74.97,
      status: "processing",
      payment: "pending",
      shippingAddress: {
        firstName: "Sourav",
        lastName: "Debnath",
        address: "kalikaccha",
        city: "Brahmanbaria",
        state: "Rajshahi",
        zipCode: "3430",
        country: "Bangladesh",
      },
      paymentMethod: {
        type: "Cash On Delivery",
        mobileNumber: null,
      },
      createdAt: "2025-07-09T16:21:56.091Z",
      updatedAt: "2025-07-09T16:21:56.091Z",
    },
  ];

  // Use API data if available, else fallback to mockOrders
  const orders =
    ordersData?.orders?.length > 0 ? ordersData.orders : mockOrders;

  // Filter and sort orders
  const filteredOrders = orders
    .filter((order) => {
      const matchesSearch =
        (order?.customerName?.toLowerCase() || "").includes(
          searchTerm.toLowerCase()
        ) ||
        (order?.email?.toLowerCase() || "").includes(
          searchTerm.toLowerCase()
        ) ||
        (order?._id?.toLowerCase() || "").includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "all" || order?.status === filterStatus;
      const matchesPayment =
        filterPayment === "all" || order?.payment === filterPayment;
      return matchesSearch && matchesStatus && matchesPayment;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "highest":
          return b.total - a.total;
        case "lowest":
          return a.total - b.total;
        default:
          return 0;
      }
    });

  const getOrderStats = () => {
    return {
      total: orders.length || 0,
      pending: orders.filter((o) => o?.status === "pending").length || 0,
      processing: orders.filter((o) => o?.status === "processing").length || 0,
      shipped: orders.filter((o) => o?.status === "shipped").length || 0,
      delivered: orders.filter((o) => o?.status === "delivered").length || 0,
      cancelled: orders.filter((o) => o?.status === "cancelled").length || 0,
      totalRevenue:
        orders.reduce((sum, order) => sum + (order?.total || 0), 0) || 0,
      paidOrders: orders.filter((o) => o?.payment === "paid").length || 0,
    };
  };

  const stats = getOrderStats();

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "shipped":
        return <Truck className="h-4 w-4 text-blue-400" />;
      case "processing":
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case "pending":
        return <AlertTriangle className="h-4 w-4 text-orange-400" />;
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
      case "pending":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "failed":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "refunded":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const handleStatusChange = async (orderId, newStatus, newPaymentStatus) => {
    console.log(orderId, newStatus, newPaymentStatus);
    try {
      await updateOrder({
        id: orderId,
        data: {
          status: newStatus,
          payment: newPaymentStatus || undefined,
          updatedAt: new Date().toISOString(),
        },
      }).unwrap();
      await refetch();
      console.log("Order updated");
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <span className="text-white text-lg">
            Loading Orders Management...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <Card className="p-6 sm:p-8 text-center max-w-md w-full bg-gray-800/30 border border-gray-700/50">
          <div className="mb-6">
            <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Error Loading Orders
            </h2>
            <p className="text-gray-400 text-sm sm:text-base">
              {error?.message || "Failed to load orders data"}
            </p>
          </div>
          <Button
            variant="default"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            onClick={() => refetch()}
            aria-label="Retry loading orders"
          >
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  if (!session || session?.user?.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto py-4 sm:py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Orders Management
              </h1>
              <p className="mt-2 text-gray-400 text-sm sm:text-base">
                Manage customer orders, update statuses, and track deliveries
              </p>
            </div>
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <Button
                onClick={() => refetch()}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-500 bg-transparent flex-1 sm:flex-none"
                aria-label="Refresh orders list"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-500 bg-transparent flex-1 sm:flex-none"
                aria-label="Export orders data"
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
            {[
              {
                title: "Total Orders",
                value: stats.total,
                icon: ShoppingBag,
                bgGradient: "from-purple-500/20 to-pink-500/20",
                color: "text-purple-400",
              },
              {
                title: "Pending",
                value: stats.pending,
                icon: AlertTriangle,
                bgGradient: "from-orange-500/20 to-red-500/20",
                color: "text-orange-400",
              },
              {
                title: "Processing",
                value: stats.processing,
                icon: Clock,
                bgGradient: "from-yellow-500/20 to-orange-500/20",
                color: "text-yellow-400",
              },
              {
                title: "Shipped",
                value: stats.shipped,
                icon: Truck,
                bgGradient: "from-blue-500/20 to-cyan-500/20",
                color: "text-blue-400",
              },
              {
                title: "Delivered",
                value: stats.delivered,
                icon: CheckCircle,
                bgGradient: "from-green-500/20 to-emerald-500/20",
                color: "text-green-400",
              },
              {
                title: "Cancelled",
                value: stats.cancelled,
                icon: XCircle,
                bgGradient: "from-red-500/20 to-pink-500/20",
                color: "text-red-400",
              },
              {
                title: "Revenue",
                value: `$${stats.totalRevenue.toFixed(0)}`,
                icon: DollarSign,
                bgGradient: "from-green-500/20 to-blue-500/20",
                color: "text-green-400",
              },
              {
                title: "Paid",
                value: stats.paidOrders,
                icon: CreditCard,
                bgGradient: "from-emerald-500/20 to-teal-500/20",
                color: "text-emerald-400",
              },
            ].map((stat, index) => (
              <Card
                key={index}
                className="bg-gray-800/30 border-gray-700/50 hover:shadow-lg transition-all duration-300 group"
              >
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-400">
                        {stat.title}
                      </p>
                      <p className="text-lg font-bold text-white">
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={`p-2 rounded-lg bg-gradient-to-r ${stat.bgGradient}`}
                    >
                      <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters and Search */}
          <Card className="bg-gray-800/30 border-gray-700/50 hover:shadow-lg transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                {/* Search */}
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by order ID, customer name, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-sm"
                    aria-label="Search orders"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full lg:w-40 px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-sm"
                  aria-label="Filter by order status"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                {/* Payment Filter */}
                <select
                  value={filterPayment}
                  onChange={(e) => setFilterPayment(e.target.value)}
                  className="w-full lg:w-40 px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-sm"
                  aria-label="Filter by payment status"
                >
                  <option value="all">All Payments</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full lg:w-40 px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-sm"
                  aria-label="Sort orders"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Amount</option>
                  <option value="lowest">Lowest Amount</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Orders List */}
          <Card className="bg-gray-800/30 border-gray-700/50 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Package className="mr-2 h-5 w-5 text-purple-400" />
                Orders ({filteredOrders.length})
              </CardTitle>
              <CardDescription className="text-gray-400">
                Manage customer orders and update their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="p-4 bg-gray-800/30 rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div className="h-5 bg-gray-700 rounded w-32"></div>
                          <div className="h-6 bg-gray-700 rounded w-20"></div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-700 rounded w-48"></div>
                          <div className="h-4 bg-gray-700 rounded w-36"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">
                    No orders found
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <div
                      key={order?._id || `order-${Math.random()}`}
                      className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50 hover:bg-gray-800/50 transition-colors"
                    >
                      {/* Order Header */}
                      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 space-y-3 lg:space-y-0">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h3 className="font-semibold text-white text-lg">
                              {order?._id || "Unknown Order"}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {order?.createdAt
                                  ? new Date(
                                      order.createdAt
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </span>
                              <span className="flex items-center">
                                <DollarSign className="h-3 w-3 mr-1" />$
                                {(order?.total || 0).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {/* Order Status Dropdown */}
                          <select
                            value={order?.status || "pending"}
                            onChange={(e) =>
                              handleStatusChange(
                                order?._id,
                                e.target.value,
                                order?.payment
                              )
                            }
                            disabled={isUpdating}
                            className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                              order?.status || "pending"
                            )} bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50`}
                            aria-label={`Update status for order ${
                              order?._id || "unknown"
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>

                          {/* Payment Status Dropdown */}
                          <select
                            value={order?.payment || "pending"}
                            onChange={(e) =>
                              handleStatusChange(
                                order?._id,
                                order?.status,
                                e.target.value
                              )
                            }
                            disabled={isUpdating}
                            className={`px-3 py-1 text-xs font-medium rounded-full border ${getPaymentStatusColor(
                              order?.payment || "pending"
                            )} bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50`}
                            aria-label={`Update payment status for order ${
                              order?._id || "unknown"
                            }`}
                          >
                            <option value="pending">Payment Pending</option>
                            <option value="paid">Paid</option>
                            <option value="failed">Failed</option>
                            <option value="refunded">Refunded</option>
                          </select>
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <h4 className="font-medium text-white">
                            Customer Information
                          </h4>
                          <div className="space-y-1 text-sm text-gray-400">
                            <div className="flex items-center">
                              <User className="h-3 w-3 mr-2" />
                              <span>
                                {order?.customerName || "Unknown Customer"}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Mail className="h-3 w-3 mr-2" />
                              <span>{order?.email || "No email"}</span>
                            </div>
                            <div className="flex items-center">
                              <Phone className="h-3 w-3 mr-2" />
                              <span>
                                {order?.customerPhone ||
                                  order?.paymentMethod?.mobileNumber ||
                                  "No phone"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium text-white">
                            Shipping Address
                          </h4>
                          <div className="text-sm text-gray-400">
                            <div className="flex items-start">
                              <MapPin className="h-3 w-3 mr-2 mt-0.5 flex-shrink-0" />
                              <span>
                                {order?.shippingAddress
                                  ? `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}, ${order.shippingAddress.country}`
                                  : "No address"}
                              </span>
                            </div>
                            {order?.trackingNumber && (
                              <div className="flex items-center mt-1">
                                <Truck className="h-3 w-3 mr-2" />
                                <span>Tracking: {order.trackingNumber}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="space-y-3 mb-4">
                        <h4 className="font-medium text-white">Order Items</h4>
                        <div className="space-y-2">
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
                                  (item.price || 0) * (item.quantity || 1)
                                ).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex justify-between items-center pt-3 border-t border-gray-700/50">
                        <div className="text-sm text-gray-400">
                          Payment Method:{" "}
                          <span className="capitalize">
                            {order?.paymentMethod?.type?.replace("_", " ") ||
                              "Unknown"}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Link href={`/admin/orders/${order?._id}`}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-500 bg-transparent"
                              aria-label={`View details for order ${
                                order?._id || "unknown"
                              }`}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
