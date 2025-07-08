"use client";
import { useState } from "react";
import Image from "next/image";
import {
  User,
  Mail,
  Shield,
  Settings,
  Edit,
  Camera,
  Calendar,
  MapPin,
  Phone,
  Globe,
  Github,
  Twitter,
  Linkedin,
  Package,
  ShoppingBag,
  BarChart3,
  Save,
  X,
  ShoppingCart,
  Heart,
  History,
  CreditCard,
  Truck,
  Users,
  DollarSign,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Button from "../components/ui/button";
import Card from "../components/ui/card";
import Badge from "../components/ui/badge";
import CardHeader from "../components/ui/cardHeader";
import CardTitle from "../components/ui/card/cardTitle";
import CardDescription from "../components/ui/card/CardDescription";
import CardContent from "../components/ui/cardContent";
import StatCard from "../components/ui/StateCard";
import ActionButton from "../components/ui/ActionButton";
import RecentActivity from "../components/profile/RecentActivity";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import AccessDenied from "../components/shared/AccessDenied";

const Input = ({ className = "", ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-gray-600 bg-gray-800/50 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    {...props}
  />
);

export default function ProfilePage() {
  const { data: session, status } = useSession();

  // Profile editing state
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    location: "",
    phone: "",
    website: "",
    department: "",
  });

  // Initialize form data when session is loaded
  useState(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        email: session.user.email || "",
        bio: session.user.bio || "",
        location: session.user.location || "",
        phone: session.user.phone || "",
        website: session.user.website || "",
        department: session.user.department || "",
      });
    }
  }, [session]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setIsEditing(false);
    console.log("Profile data to save:", formData);
    console.log("Profile image to upload:", profileImage);
  };

  const handleCancelEdit = () => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        email: session.user.email || "",
        bio: session.user.bio || "",
        location: session.user.location || "",
        phone: session.user.phone || "",
        website: session.user.website || "",
        department: session.user.department || "",
      });
    }
    setProfileImagePreview(null);
    setProfileImage(null);
    setIsEditing(false);
  };

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  if (!session) {
    return <AccessDenied />;
  }

  const { user } = session;
  const isAdmin = user?.role === "admin";

  // Different stats for admin vs user
  const adminStats = [
    {
      title: "Total Users",
      value: "2,847",
      description: "+12% this month",
      icon: Users,
      color: "text-blue-400",
      bgGradient: "from-blue-500/20 to-cyan-500/20",
      glowColor: "shadow-blue-500/20",
    },
    {
      title: "Products Managed",
      value: "1,234",
      description: "+8% this week",
      icon: Package,
      color: "text-green-400",
      bgGradient: "from-green-500/20 to-emerald-500/20",
      glowColor: "shadow-green-500/20",
    },
    {
      title: "Total Revenue",
      value: "$125.4K",
      description: "+15% this quarter",
      icon: DollarSign,
      color: "text-purple-400",
      bgGradient: "from-purple-500/20 to-pink-500/20",
      glowColor: "shadow-purple-500/20",
    },
    {
      title: "System Health",
      value: "99.2%",
      description: "All systems operational",
      icon: BarChart3,
      color: "text-orange-400",
      bgGradient: "from-orange-500/20 to-red-500/20",
      glowColor: "shadow-orange-500/20",
    },
  ];

  const userStats = [
    {
      title: "Total Orders",
      value: "24",
      description: "3 this month",
      icon: ShoppingBag,
      color: "text-blue-400",
      bgGradient: "from-blue-500/20 to-cyan-500/20",
      glowColor: "shadow-blue-500/20",
    },
    {
      title: "Cart Items",
      value: "7",
      description: "$234.50 total",
      icon: ShoppingCart,
      color: "text-green-400",
      bgGradient: "from-green-500/20 to-emerald-500/20",
      glowColor: "shadow-green-500/20",
    },
    {
      title: "Wishlist",
      value: "12",
      description: "2 on sale",
      icon: Heart,
      color: "text-purple-400",
      bgGradient: "from-purple-500/20 to-pink-500/20",
      glowColor: "shadow-purple-500/20",
    },
    {
      title: "Total Spent",
      value: "$1,847",
      description: "Since joining",
      icon: CreditCard,
      color: "text-orange-400",
      bgGradient: "from-orange-500/20 to-red-500/20",
      glowColor: "shadow-orange-500/20",
    },
  ];

  // Different recent activities for admin vs user
  const adminActivities = [
    {
      action: "Approved new user registration",
      item: "john.doe@example.com",
      time: "15 minutes ago",
      type: "approve",
    },
    {
      action: "Updated product inventory",
      item: "iPhone 15 Pro - Added 50 units",
      time: "1 hour ago",
      type: "update",
    },
    {
      action: "Resolved customer support ticket",
      item: "Ticket #2847 - Refund processed",
      time: "2 hours ago",
      type: "support",
    },
    {
      action: "Generated monthly sales report",
      item: "December 2024 Analytics",
      time: "4 hours ago",
      type: "report",
    },
    {
      action: "Added new supplier",
      item: "TechCorp Solutions - Electronics",
      time: "6 hours ago",
      type: "add",
    },
    {
      action: "System maintenance completed",
      item: "Database optimization",
      time: "1 day ago",
      type: "system",
    },
  ];

  const userActivities = [
    {
      action: "Placed new order",
      item: "Order #ORD-2024-1847 - $89.99",
      time: "2 hours ago",
      type: "order",
    },
    {
      action: "Added item to cart",
      item: "Wireless Bluetooth Headphones",
      time: "5 hours ago",
      type: "cart",
    },
    {
      action: "Left product review",
      item: "MacBook Pro M3 - 5 stars",
      time: "1 day ago",
      type: "review",
    },
    {
      action: "Updated shipping address",
      item: "Changed to work address",
      time: "2 days ago",
      type: "profile",
    },
    {
      action: "Added to wishlist",
      item: "Gaming Mechanical Keyboard",
      time: "3 days ago",
      type: "wishlist",
    },
    {
      action: "Redeemed coupon code",
      item: "SAVE20 - 20% off electronics",
      time: "1 week ago",
      type: "coupon",
    },
  ];

  const stats = isAdmin ? adminStats : userStats;
  const recentActivities = isAdmin ? adminActivities : userActivities;

  // User action buttons
  const userActions = [
    {
      icon: ShoppingCart,
      title: "View Cart",
      description: "7 items • $234.50",
      onClick: () => console.log("Navigate to cart"),
    },
    {
      icon: History,
      title: "Order History",
      description: "View all 24 orders",
      onClick: () => console.log("Navigate to order history"),
    },
    {
      icon: Heart,
      title: "Wishlist",
      description: "12 saved items",
      onClick: () => console.log("Navigate to wishlist"),
    },
    {
      icon: Truck,
      title: "Track Orders",
      description: "2 orders in transit",
      onClick: () => console.log("Navigate to order tracking"),
    },
  ];

  const getRoleVariant = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "admin";
      case "premium":
        return "premium";
      default:
        return "default";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
      </div>
      <div className="max-w-7xl mx-auto py-4 sm:py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Profile Dashboard
              </h1>
              <p className="mt-2 text-gray-400 text-sm sm:text-base">
                Manage your account and view your{" "}
                {isAdmin ? "system" : "shopping"} performance
              </p>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none bg-transparent"
              >
                <Settings className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </Button>
              {isEditing ? (
                <>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={handleSaveProfile}
                    className="flex-1 sm:flex-none"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Save</span>
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleCancelEdit}
                    className="flex-1 sm:flex-none"
                  >
                    <X className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Cancel</span>
                  </Button>
                </>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="flex-1 sm:flex-none"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Edit Profile</span>
                </Button>
              )}
            </div>
          </div>

          {/* Profile Header Card */}
          <Card variant="gradient" className="overflow-hidden">
            <div className="relative">
              {/* Cover Background */}
              <div className="h-24 sm:h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4">
                  <Badge
                    variant={getRoleVariant(user.role)}
                    className="text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
                  >
                    <Shield className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                    {user.role?.toUpperCase() || "USER"}
                  </Badge>
                </div>
              </div>
              {/* Profile Content */}
              <CardContent className="pt-0 pb-4 sm:pb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-6 -mt-12 sm:-mt-16">
                  {/* Profile Image */}
                  <div className="relative group mx-auto sm:mx-0">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-4 border-gray-800 bg-gray-800 shadow-2xl">
                      <Image
                        src={
                          profileImagePreview ||
                          user.image ||
                          "/placeholder.svg?height=200&width=200"
                        }
                        alt="Profile"
                        width={128}
                        height={128}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    {isEditing ? (
                      <label
                        htmlFor="profile-image-upload"
                        className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 p-1.5 sm:p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg cursor-pointer"
                      >
                        <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
                        <input
                          id="profile-image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                    ) : (
                      <button className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 p-1.5 sm:p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg">
                        <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                    )}
                  </div>
                  {/* Profile Info */}
                  <div className="flex-1 space-y-3 sm:space-y-4 w-full">
                    {isEditing ? (
                      <div className="space-y-3 sm:space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">
                              Name
                            </label>
                            <Input
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              placeholder="Your name"
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">
                              Email
                            </label>
                            <Input
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="Your email"
                              className="text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">
                            Bio
                          </label>
                          <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            placeholder="Tell us about yourself"
                            className="flex w-full rounded-md border border-gray-600 bg-gray-800/50 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[60px] sm:min-h-[80px]"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">
                              Location
                            </label>
                            <Input
                              name="location"
                              value={formData.location}
                              onChange={handleInputChange}
                              placeholder="Your location"
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">
                              Phone
                            </label>
                            <Input
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="Your phone number"
                              className="text-sm"
                            />
                          </div>
                          <div className="sm:col-span-2 lg:col-span-1">
                            <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">
                              Department
                            </label>
                            <Input
                              name="department"
                              value={formData.department}
                              onChange={handleInputChange}
                              placeholder="Your department"
                              className="text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">
                            Website
                          </label>
                          <Input
                            name="website"
                            value={formData.website}
                            onChange={handleInputChange}
                            placeholder="Your website"
                            className="text-sm"
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="text-center sm:text-left">
                          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                            {user.name || "Unnamed User"}
                          </h2>
                          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 sm:gap-4 text-gray-400 text-sm">
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span className="truncate">{user.email}</span>
                            </div>
                            {user.location && (
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                                <span className="truncate">
                                  {user.location}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span>Joined {user.joinDate || "2023"}</span>
                            </div>
                          </div>
                        </div>
                        {user.bio && (
                          <p className="text-gray-300 leading-relaxed text-center sm:text-left text-sm sm:text-base">
                            {user.bio}
                          </p>
                        )}
                        {/* Contact Info */}
                        <div className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4">
                          {user.phone && (
                            <div className="flex items-center text-xs sm:text-sm text-gray-400">
                              <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span className="truncate">{user.phone}</span>
                            </div>
                          )}
                          {user.website && (
                            <div className="flex items-center text-xs sm:text-sm text-gray-400">
                              <Globe className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span className="truncate">{user.website}</span>
                            </div>
                          )}
                          {user.department && (
                            <div className="flex items-center text-xs sm:text-sm text-gray-400">
                              <User className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span className="truncate">
                                {user.department}
                              </span>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                    {/* Social Links */}
                    <div className="flex justify-center sm:justify-start space-x-3">
                      <button className="p-2 cursor-pointer bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors">
                        <Github className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                      <button className="p-2 cursor-pointer bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors">
                        <X className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                      <button className="p-2 cursor-pointer bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors">
                        <Linkedin className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Recent Activity */}
            <RecentActivity
              isAdmin={isAdmin}
              recentActivities={recentActivities}
            />

            {/* User Actions or Admin Tools */}
            <div className="space-y-6">
              {isAdmin ? (
                /* Admin Tools */
                <Card variant="premium">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="mr-2 h-5 w-5 sm:h-6 sm:w-6 text-yellow-400" />
                      Admin Tools
                    </CardTitle>
                    <CardDescription>
                      Administrative functions and controls
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <ActionButton
                        icon={Package}
                        title="Manage Products"
                        description="Add, edit, remove products"
                        onClick={() =>
                          console.log("Navigate to product management")
                        }
                      />
                      <ActionButton
                        icon={Users}
                        title="User Management"
                        description="View and manage users"
                        onClick={() =>
                          console.log("Navigate to user management")
                        }
                      />
                      <ActionButton
                        icon={BarChart3}
                        title="Analytics Dashboard"
                        description="View system analytics"
                        onClick={() => console.log("Navigate to analytics")}
                      />
                      <ActionButton
                        icon={Settings}
                        title="System Settings"
                        description="Configure system settings"
                        onClick={() => console.log("Navigate to settings")}
                      />
                    </div>
                  </CardContent>
                </Card>
              ) : (
                /* User Actions */
                <Card variant="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <ShoppingBag className="mr-2 h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                      Quick Actions
                    </CardTitle>
                    <CardDescription>
                      Manage your shopping experience
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {userActions.map((action, index) => (
                        <ActionButton key={index} {...action} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
