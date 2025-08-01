"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Button from "@/app/components/ui/button";
import Card from "@/app/components/ui/card";
import CardContent from "@/app/components/ui/cardContent";
import CardHeader from "@/app/components/ui/cardHeader";
import CardTitle from "@/app/components/ui/card/cardTitle";
import CardDescription from "@/app/components/ui/card/CardDescription";
import {
  ArrowLeft,
  Edit,
  Save,
  X,
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
  CreditCard,
  AlertTriangle,
  ShoppingBag,
  Copy,
  Printer,
  RefreshCw,
  Trash2,
  MoreVertical,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  useGetOrderByIdQuery,
  useUpdateOrderMutation,
} from "@/redux/api/productapi";
import { useMemo } from "react";

const OrderDetailsPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const orderId = params.id;

  const {
    data: orderData,
    isLoading,
    error,
    refetch,
  } = useGetOrderByIdQuery(orderId);
  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [editedOrder, setEditedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [showMobileActions, setShowMobileActions] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session?.user?.role !== "admin") {
      router.push("/login");
    }
  }, [session, status, router]);

  // Use actual order data from API
  const actualOrder = useMemo(() => orderData || null, [orderData]);

  useEffect(() => {
    if (actualOrder) {
      setEditedOrder({ ...actualOrder });
    }
  }, [actualOrder]);

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <span className="text-white text-base sm:text-lg text-center">
            Loading Order Details...
          </span>
        </div>
      </div>
    );
  }

  if (!session || session?.user?.role !== "admin") {
    return null;
  }

  if (error || !actualOrder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <Card className="border-red-500/50 bg-red-500/10 max-w-md w-full">
          <CardContent className="p-4 sm:p-6 text-center">
            <AlertTriangle className="h-10 w-10 sm:h-12 sm:w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
              Order Not Found
            </h3>
            <p className="text-gray-400 mb-4 text-sm sm:text-base">
              The order you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
            <Link href="/admin/orders">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 w-full sm:w-auto">
                Back to Orders
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

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

  const handleSave = async () => {
    try {
      await updateOrder({
        id: orderId,
        data: {
          ...editedOrder,
          updatedAt: new Date().toISOString(),
        },
      }).unwrap();
      setIsEditing(false);
      await refetch();
    } catch (error) {
      console.error("Failed to update order:", error);
    }
  };

  const handleCancel = () => {
    setEditedOrder({ ...actualOrder });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditedOrder((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddressChange = (field, value) => {
    setEditedOrder((prev) => ({
      ...prev,
      shippingAddress: {
        ...prev.shippingAddress,
        [field]: value,
      },
    }));
  };

  const handleItemChange = (index, field, value) => {
    setEditedOrder((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleRemoveItem = (index) => {
    setEditedOrder((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const toggleItemExpansion = (index) => {
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const calculateTotals = () => {
    const subtotal =
      editedOrder?.items?.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ) || 0;
    const tax = subtotal * 0.08; // 8% tax
    const shipping = orderData?.orders?.shipping || 0; // Fixed shipping
    const discount = 0;
    const total = subtotal + tax + shipping - discount;
    return { subtotal, tax, shipping, discount, total };
  };

  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Link href="/admin/orders">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-500 bg-transparent"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Back to Orders</span>
                  <span className="sm:hidden">Back</span>
                </Button>
              </Link>

              {/* Mobile Actions Menu */}
              <div className="sm:hidden relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMobileActions(!showMobileActions)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-500 bg-transparent"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>

                {showMobileActions && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleCancel}
                          disabled={isUpdating}
                          className="w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-700 flex items-center space-x-2 border-b border-gray-700"
                        >
                          <X className="h-4 w-4" />
                          <span>Cancel</span>
                        </button>
                        <button
                          onClick={handleSave}
                          disabled={isUpdating}
                          className="w-full px-4 py-3 text-left text-green-400 hover:bg-gray-700 flex items-center space-x-2"
                        >
                          <Save className="h-4 w-4" />
                          <span>
                            {isUpdating ? "Saving..." : "Save Changes"}
                          </span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => refetch()}
                          className="w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-700 flex items-center space-x-2 border-b border-gray-700"
                        >
                          <RefreshCw className="h-4 w-4" />
                          <span>Refresh</span>
                        </button>
                        <button className="w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-700 flex items-center space-x-2 border-b border-gray-700">
                          <Printer className="h-4 w-4" />
                          <span>Print</span>
                        </button>
                        <button
                          onClick={() => setIsEditing(true)}
                          className="w-full px-4 py-3 text-left text-purple-400 hover:bg-gray-700 flex items-center space-x-2"
                        >
                          <Edit className="h-4 w-4" />
                          <span>Edit Order</span>
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Order Details
                </h1>
                <p className="mt-1 sm:mt-2 text-gray-400 text-xs sm:text-sm lg:text-base break-all sm:break-normal">
                  Order #{actualOrder._id}
                </p>
              </div>

              {/* Desktop Actions */}
              <div className="hidden sm:flex items-center space-x-2 lg:space-x-3">
                {isEditing ? (
                  <>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-500 bg-transparent"
                      disabled={isUpdating}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      size="sm"
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                      disabled={isUpdating}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {isUpdating ? "Saving..." : "Save"}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => refetch()}
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-500 bg-transparent"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      <span className="hidden lg:inline">Refresh</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-500 bg-transparent"
                    >
                      <Printer className="mr-2 h-4 w-4" />
                      <span className="hidden lg:inline">Print</span>
                    </Button>
                    <Button
                      onClick={() => setIsEditing(true)}
                      size="sm"
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      <span className="hidden lg:inline">Edit</span>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Order Status and Quick Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-3 sm:p-4">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-400">
                    Order Status
                  </p>
                  {isEditing ? (
                    <select
                      value={editedOrder?.status || ""}
                      onChange={(e) =>
                        handleInputChange("status", e.target.value)
                      }
                      className="w-full bg-gray-800/50 border border-gray-700/50 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 p-2"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  ) : (
                    <div
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        actualOrder.status
                      )}`}
                    >
                      {getStatusIcon(actualOrder.status)}
                      <span className="ml-1 capitalize">
                        {actualOrder.status}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-3 sm:p-4">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-400">
                    Payment Status
                  </p>
                  {isEditing ? (
                    <select
                      value={editedOrder?.payment || ""}
                      onChange={(e) =>
                        handleInputChange("payment", e.target.value)
                      }
                      className="w-full bg-gray-800/50 border border-gray-700/50 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 p-2"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  ) : (
                    <div
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(
                        actualOrder.payment
                      )}`}
                    >
                      <span className="capitalize">{actualOrder.payment}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-400">
                      Total Amount
                    </p>
                    <p className="text-lg sm:text-xl font-bold text-white">
                      ৳ {actualOrder.total.toFixed(2)}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20">
                    <DollarSign className="h-4 w-4 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-400">
                      Order Date
                    </p>
                    <p className="text-sm font-semibold text-white">
                      {new Date(actualOrder.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20">
                    <Calendar className="h-4 w-4 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <div className="overflow-x-auto">
            <div className="flex space-x-1 p-1 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl w-fit min-w-full sm:min-w-0">
              <button
                onClick={() => setActiveTab("details")}
                className={`px-3 sm:px-4 cursor-pointer py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
                  activeTab === "details"
                    ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30"
                    : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                Order Details
              </button>
              <button
                onClick={() => setActiveTab("customer")}
                className={`px-3 sm:px-4 cursor-pointer py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
                  activeTab === "customer"
                    ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30"
                    : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                Customer Info
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`px-3 sm:px-4 cursor-pointer py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
                  activeTab === "history"
                    ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30"
                    : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                Order History
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "details" && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
              {/* Order Items */}
              <div className="xl:col-span-2">
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="flex items-center text-white text-base sm:text-lg">
                      <ShoppingBag className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
                      Order Items
                    </CardTitle>
                    <CardDescription className="text-gray-400 text-xs sm:text-sm">
                      Products in this order
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3 sm:space-y-4">
                      {(editedOrder?.items || []).map((item, index) => (
                        <div
                          key={index}
                          className="bg-gray-800/30 rounded-lg border border-gray-700/50 overflow-hidden"
                        >
                          {/* Mobile Layout */}
                          <div className="sm:hidden">
                            <div className="p-3 space-y-3">
                              <div className="flex items-start space-x-3">
                                <Image
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.name}
                                  width={60}
                                  height={60}
                                  className="rounded-lg bg-gray-700 object-cover flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  {isEditing ? (
                                    <input
                                      type="text"
                                      value={item.name}
                                      onChange={(e) =>
                                        handleItemChange(
                                          index,
                                          "name",
                                          e.target.value
                                        )
                                      }
                                      className="w-full bg-gray-800/50 border border-gray-700/50 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    />
                                  ) : (
                                    <h3 className="font-semibold text-white text-sm leading-tight">
                                      {item.name}
                                    </h3>
                                  )}
                                  <p className="text-xs text-gray-400 mt-1">
                                    ID: {item.productId}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-white text-sm">
                                    ৳ {(item.price * item.quantity).toFixed(2)}
                                  </p>
                                </div>
                              </div>

                              <button
                                onClick={() => toggleItemExpansion(index)}
                                className="flex items-center justify-between w-full text-left text-gray-400 hover:text-white transition-colors"
                              >
                                <span className="text-xs">
                                  {expandedItems[index]
                                    ? "Hide details"
                                    : "Show details"}
                                </span>
                                {expandedItems[index] ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </button>

                              {expandedItems[index] && (
                                <div className="pt-2 border-t border-gray-700/50 space-y-2">
                                  {isEditing ? (
                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <label className="text-xs text-gray-400">
                                          Price
                                        </label>
                                        <input
                                          type="number"
                                          value={item.price}
                                          onChange={(e) =>
                                            handleItemChange(
                                              index,
                                              "price",
                                              Number.parseFloat(e.target.value)
                                            )
                                          }
                                          className="w-full bg-gray-800/50 border border-gray-700/50 rounded px-2 py-1 text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                          step="0.01"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-xs text-gray-400">
                                          Quantity
                                        </label>
                                        <input
                                          type="number"
                                          value={item.quantity}
                                          onChange={(e) =>
                                            handleItemChange(
                                              index,
                                              "quantity",
                                              Number.parseInt(e.target.value)
                                            )
                                          }
                                          className="w-full bg-gray-800/50 border border-gray-700/50 rounded px-2 py-1 text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                          min="1"
                                        />
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-between text-xs text-gray-400">
                                      <span>
                                        Price: ৳{item.price.toFixed(2)}
                                      </span>
                                      <span>Qty: {item.quantity}</span>
                                    </div>
                                  )}

                                  {isEditing && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleRemoveItem(index)}
                                      className="w-full mt-2 border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500 bg-transparent"
                                    >
                                      <Trash2 className="h-3 w-3 mr-2" />
                                      Remove Item
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Desktop Layout */}
                          <div className="hidden sm:flex items-center space-x-4 p-4">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              width={80}
                              height={80}
                              className="rounded-lg bg-gray-700 object-cover"
                            />
                            <div className="flex-1 space-y-2">
                              {isEditing ? (
                                <>
                                  <input
                                    type="text"
                                    value={item.name}
                                    onChange={(e) =>
                                      handleItemChange(
                                        index,
                                        "name",
                                        e.target.value
                                      )
                                    }
                                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                  />
                                  <div className="flex space-x-2">
                                    <input
                                      type="number"
                                      value={item.price}
                                      onChange={(e) =>
                                        handleItemChange(
                                          index,
                                          "price",
                                          Number.parseFloat(e.target.value)
                                        )
                                      }
                                      className="w-24 bg-gray-800/50 border border-gray-700/50 rounded px-2 py-1 text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                      step="0.01"
                                    />
                                    <input
                                      type="number"
                                      value={item.quantity}
                                      onChange={(e) =>
                                        handleItemChange(
                                          index,
                                          "quantity",
                                          Number.parseInt(e.target.value)
                                        )
                                      }
                                      className="w-16 bg-gray-800/50 border border-gray-700/50 rounded px-2 py-1 text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                      min="1"
                                    />
                                  </div>
                                </>
                              ) : (
                                <>
                                  <h3 className="font-semibold text-white">
                                    {item.name}
                                  </h3>
                                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                                    <span>Product ID: {item.productId}</span>
                                    <span>Price: ৳{item.price.toFixed(2)}</span>
                                    <span>Qty: {item.quantity}</span>
                                  </div>
                                </>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-white text-lg">
                                ৳ {(item.price * item.quantity).toFixed(2)}
                              </p>
                              {isEditing && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRemoveItem(index)}
                                  className="mt-2 border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500 bg-transparent"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div>
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="flex items-center text-white text-base sm:text-lg">
                      <DollarSign className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                      Order Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4 pt-0">
                    <div className="flex justify-between text-gray-400 text-sm">
                      <span>Subtotal:</span>
                      <span>৳ {totals.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-400 text-sm">
                      <span>Shipping:</span>
                      <span>৳ {totals.shipping.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-700/50 pt-3 sm:pt-4">
                      <div className="flex justify-between text-white font-semibold text-base sm:text-lg">
                        <span>Total:</span>
                        <span>৳ {actualOrder.total.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="space-y-3 pt-3 sm:pt-4 border-t border-gray-700/50">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-400 mb-1">
                          Payment Method
                        </p>
                        <div className="flex items-center space-x-2">
                          <CreditCard className="h-4 w-4 text-gray-400" />
                          <span className="text-white text-sm">
                            {actualOrder.paymentMethod.type}
                          </span>
                        </div>
                        {actualOrder.paymentMethod.mobileNumber && (
                          <div className="flex items-center space-x-2 mt-1">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-white text-sm">
                              {actualOrder.paymentMethod.mobileNumber}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "customer" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Customer Information */}
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center text-white text-base sm:text-lg">
                    <User className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4 pt-0">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-400 mb-1">
                      Email
                    </p>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedOrder?.email || ""}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="w-full bg-gray-800/50 border border-gray-700/50 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-white text-sm break-all">
                          {actualOrder.email}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-400 mb-1">
                      Customer Name
                    </p>
                    <p className="text-white text-sm">
                      {actualOrder.shippingAddress.firstName}{" "}
                      {actualOrder.shippingAddress.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-400 mb-1">
                      Order ID
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-mono text-xs break-all">
                        {actualOrder._id}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(actualOrder._id)}
                        className="p-1 h-6 w-6 text-gray-400 hover:text-white flex-shrink-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center text-white text-base sm:text-lg">
                    <MapPin className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="First Name"
                          value={editedOrder?.shippingAddress?.firstName || ""}
                          onChange={(e) =>
                            handleAddressChange("firstName", e.target.value)
                          }
                          className="bg-gray-800/50 border border-gray-700/50 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        />
                        <input
                          type="text"
                          placeholder="Last Name"
                          value={editedOrder?.shippingAddress?.lastName || ""}
                          onChange={(e) =>
                            handleAddressChange("lastName", e.target.value)
                          }
                          className="bg-gray-800/50 border border-gray-700/50 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Address"
                        value={editedOrder?.shippingAddress?.address || ""}
                        onChange={(e) =>
                          handleAddressChange("address", e.target.value)
                        }
                        className="w-full bg-gray-800/50 border border-gray-700/50 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="City"
                          value={editedOrder?.shippingAddress?.city || ""}
                          onChange={(e) =>
                            handleAddressChange("city", e.target.value)
                          }
                          className="bg-gray-800/50 border border-gray-700/50 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        />
                        <input
                          type="text"
                          placeholder="State"
                          value={editedOrder?.shippingAddress?.state || ""}
                          onChange={(e) =>
                            handleAddressChange("state", e.target.value)
                          }
                          className="bg-gray-800/50 border border-gray-700/50 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="ZIP Code"
                          value={editedOrder?.shippingAddress?.zipCode || ""}
                          onChange={(e) =>
                            handleAddressChange("zipCode", e.target.value)
                          }
                          className="bg-gray-800/50 border border-gray-700/50 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        />
                        <input
                          type="text"
                          placeholder="Country"
                          value={editedOrder?.shippingAddress?.country || ""}
                          onChange={(e) =>
                            handleAddressChange("country", e.target.value)
                          }
                          className="bg-gray-800/50 border border-gray-700/50 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-white text-sm space-y-1">
                      <p className="font-medium">
                        {actualOrder.shippingAddress.firstName}{" "}
                        {actualOrder.shippingAddress.lastName}
                      </p>
                      <p>{actualOrder.shippingAddress.address}</p>
                      <p>
                        {actualOrder.shippingAddress.city},{" "}
                        {actualOrder.shippingAddress.state}{" "}
                        {actualOrder.shippingAddress.zipCode}
                      </p>
                      <p>{actualOrder.shippingAddress.country}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "history" && (
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center text-white text-base sm:text-lg">
                  <Clock className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                  Order History
                </CardTitle>
                <CardDescription className="text-gray-400 text-xs sm:text-sm">
                  Timeline of order status changes and updates
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                    <div className="p-2 rounded-full bg-green-500/20 flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
                        <h4 className="font-medium text-white text-sm">
                          Order Created
                        </h4>
                        <span className="text-xs text-gray-400">
                          {new Date(actualOrder.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-400 text-xs sm:text-sm mt-1">
                        Order was successfully placed
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        Updated by: System
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                    <div
                      className={`p-2 rounded-full flex-shrink-0 ${getStatusColor(
                        actualOrder.status
                      )
                        .replace("text-", "bg-")
                        .replace("border-", "")
                        .replace("/30", "/20")}`}
                    >
                      {getStatusIcon(actualOrder.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
                        <h4 className="font-medium text-white capitalize text-sm">
                          Status: {actualOrder.status}
                        </h4>
                        <span className="text-xs text-gray-400">
                          {new Date(actualOrder.updatedAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-400 text-xs sm:text-sm mt-1">
                        Order status updated to {actualOrder.status}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        Updated by: Admin
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                    <div
                      className={`p-2 rounded-full flex-shrink-0 ${getPaymentStatusColor(
                        actualOrder.payment
                      )
                        .replace("text-", "bg-")
                        .replace("border-", "")
                        .replace("/30", "/20")}`}
                    >
                      <DollarSign className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
                        <h4 className="font-medium text-white capitalize text-sm">
                          Payment: {actualOrder.payment}
                        </h4>
                        <span className="text-xs text-gray-400">
                          {new Date(actualOrder.updatedAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-400 text-xs sm:text-sm mt-1">
                        Payment status: {actualOrder.payment}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        Method: {actualOrder.paymentMethod.type}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes Section */}
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center text-white text-base sm:text-lg">
                <Edit className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
                Order Notes
              </CardTitle>
              <CardDescription className="text-gray-400 text-xs sm:text-sm">
                Internal notes and customer requests
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {isEditing ? (
                <textarea
                  value={editedOrder?.notes || ""}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Add notes about this order..."
                  rows={4}
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                />
              ) : (
                <p className="text-white text-sm">
                  {actualOrder.notes || "No notes available for this order."}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Click outside to close mobile actions */}
      {showMobileActions && (
        <div
          className="fixed inset-0 z-40 sm:hidden"
          onClick={() => setShowMobileActions(false)}
        />
      )}
    </div>
  );
};

export default OrderDetailsPage;
