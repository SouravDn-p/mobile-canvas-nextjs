import React from "react";
import {
  User,
  Settings,
  Edit,
  Star,
  Activity,
  Package,
  ShoppingBag,
  BarChart3,
  Clock,
  CheckCircle,
  ShoppingCart,
  Heart,
  CreditCard,
  UserCheck,
} from "lucide-react";
import Card from "../ui/card";
import CardHeader from "../ui/cardHeader";
import CardTitle from "../ui/card/cardTitle";
import CardDescription from "../ui/card/CardDescription";
import CardContent from "../ui/cardContent";

const RecentActivity = ({ isAdmin, recentActivities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case "update":
        return <Edit className="h-4 w-4 text-blue-400" />;
      case "add":
        return <Package className="h-4 w-4 text-green-400" />;
      case "report":
        return <BarChart3 className="h-4 w-4 text-purple-400" />;
      case "approve":
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "support":
        return <UserCheck className="h-4 w-4 text-orange-400" />;
      case "system":
        return <Settings className="h-4 w-4 text-gray-400" />;
      case "order":
        return <ShoppingBag className="h-4 w-4 text-blue-400" />;
      case "cart":
        return <ShoppingCart className="h-4 w-4 text-green-400" />;
      case "review":
        return <Star className="h-4 w-4 text-yellow-400" />;
      case "profile":
        return <User className="h-4 w-4 text-purple-400" />;
      case "wishlist":
        return <Heart className="h-4 w-4 text-pink-400" />;
      case "coupon":
        return <CreditCard className="h-4 w-4 text-orange-400" />;
      default:
        return <Activity className="h-4 w-4 text-gray-400" />;
    }
  };
  return (
    <div className="lg:col-span-2">
      <Card variant="gradient">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="mr-2 h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Your latest {isAdmin ? "administrative" : "shopping"}
            actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 border border-gray-700/50 rounded-xl hover:bg-gray-800/30 transition-all duration-300"
              >
                <div className="flex-shrink-0 p-2 rounded-lg bg-gray-800/50">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm sm:text-base truncate">
                    {activity.action}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400 truncate">
                    {activity.item}
                  </p>
                </div>
                <div className="flex items-center text-xs text-gray-500 flex-shrink-0">
                  <Clock className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">{activity.time}</span>
                  <span className="sm:hidden">
                    {activity.time.split(" ")[0]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecentActivity;
