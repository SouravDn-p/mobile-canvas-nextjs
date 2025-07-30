import { Badge, Calendar, CheckCircle, Clock, Download, Eye, Package, ShoppingBag, Truck, X } from "lucide-react";
import Card from "../ui/card";
import CardContent from "../ui/cardContent";
import Button from "../ui/button";
import Image from "next/image";
import { useState } from "react";

const OrderCard = ({ order, isAdmin = false }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "success";
      case "shipped":
        return "default";
      case "processing":
        return "purple";
      case "cancelled":
        return "admin";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "processing":
        return <Clock className="h-4 w-4" />;
      case "cancelled":
        return <X className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0 mb-4">
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <h3 className="font-semibold text-white text-lg">
                Order #{order._id?.slice(-8) || order.id || "12345678"}
              </h3>
              <Badge variant={getStatusColor(order.status)} className="w-fit">
                {getStatusIcon(order.status)}
                <span className="ml-1 capitalize">
                  {order.status || "Processing"}
                </span>
              </Badge>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-400 mt-2 space-y-1 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(order.createdAt || new Date())}
              </div>
              <div className="flex items-center">
                ৳ {order.total?.toFixed(2) || "0.00"}
              </div>
              <div className="flex items-center">
                <ShoppingBag className="h-4 w-4 mr-1" />
                {order.items?.length || 0} items
              </div>
              {isAdmin && (
                <div className="flex items-center">
                  <span className="text-xs">Customer: {order.email}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex space-x-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="flex-1 sm:flex-none"
            >
              <Eye className="h-4 w-4 mr-2" />
              {showDetails ? "Hide" : "View"} Details
            </Button>
            <Button variant="ghost" size="sm" className="flex-1 sm:flex-none">
              <Download className="h-4 w-4 mr-2" />
              Invoice
            </Button>
          </div>
        </div>

        {showDetails && (
          <div className="border-t border-gray-700 pt-4 space-y-4">
            <div className="grid gap-4">
              {order.items?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-3 bg-gray-800/30 rounded-lg"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-700 rounded-lg flex-shrink-0">
                    <Image
                      src={item.image || "/placeholder.svg?height=64&width=64"}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white truncate">
                      {item.name}
                    </h4>
                    <p className="text-sm text-gray-400">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-white">
                      ৳ {(item.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-400">${item.price}/each</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-gray-800/30 rounded-lg p-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal:</span>
                  <span className="text-white">
                    ৳ {(order.total * 0.9).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Shipping:</span>
                  <span className="text-white">
                    ৳ {(order.total * 0.1).toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-gray-600 pt-2">
                  <div className="flex justify-between font-semibold">
                    <span className="text-white">Total:</span>
                    <span className="text-white">
                      ৳ {order.total?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderCard;