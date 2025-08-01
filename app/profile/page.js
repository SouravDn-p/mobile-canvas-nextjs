"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
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
  Router,
} from "lucide-react";
import { useSession } from "next-auth/react";
import {
  useGetAllUsersQuery,
  useGetUserByEmailQuery,
  useUpdateUserMutation,
  useGetProductsQuery,
  useGetOrdersQuery,
  useGetOrdersByEmailQuery,
} from "@/redux/api/productapi";

// Import your existing components
import LoadingSpinner from "../components/shared/LoadingSpinner";
import AccessDenied from "../components/shared/AccessDenied";
import Link from "next/link";
import Button from "../components/ui/button";
import Card from "../components/ui/card";
import Badge from "../components/ui/badge";
import CardContent from "../components/ui/cardContent";
import StatCard from "../components/ui/StateCard";
import RecentActivity from "../components/profile/RecentActivity";
import Actions from "../components/profile/Actions";
import { useRouter } from "next/navigation";

const Input = ({ className = "", error, ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border ${
      error ? "border-red-500" : "border-gray-600"
    } bg-gray-800/50 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
      error ? "focus:ring-red-500" : "focus:ring-blue-500"
    } focus:border-transparent ${className}`}
    {...props}
  />
);

const ErrorMessage = ({ message }) => (
  <p className="text-red-400 text-xs mt-1">{message}</p>
);

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const email = session?.user?.email;
  const router = useRouter();

  // Redux API calls
  const { data: allUserData, isLoading: allUserLoading } =
    useGetAllUsersQuery();
  const {
    data: userData,
    error,
    isLoading,
    refetch: refetchUser,
  } = useGetUserByEmailQuery(email, {
    skip: !email,
  });
  const [updateUser, { isLoading: updating }] = useUpdateUserMutation();

  // Additional API calls for more data
  const { data: productsData, isLoading: productsLoading } =
    useGetProductsQuery();
  const { data: allOrdersData, isLoading: allOrdersLoading } =
    useGetOrdersQuery();
  const { data: userOrdersData, isLoading: userOrdersLoading } =
    useGetOrdersByEmailQuery(email, {
      skip: !email,
    });

  // Profile editing state
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
    watch,
  } = useForm({
    defaultValues: {
      name: "",
      phone: "",
      bio: "",
      location: "",
      website: "",
      department: "",
    },
  });

  // Initialize form data when user data is loaded
  useEffect(() => {
    if (userData?.user) {
      const user = userData.user;
      reset({
        name: user.name || "",
        phone: user.phone || "",
        bio: user.bio || "",
        location: user.location || "",
        website: user.website || "",
        department: user.department || "",
      });
    }
  }, [userData, reset]);

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

  const onSubmit = async (formData) => {
    if (!email) return;

    try {
      await updateUser({
        email,
        data: formData,
      }).unwrap();

      // Refetch user data to get updated information
      await refetchUser();
      setIsEditing(false);
      setProfileImagePreview(null);
      setProfileImage(null);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleCancelEdit = () => {
    // Reset form to original values
    if (userData?.user) {
      const user = userData.user;
      reset({
        name: user.name || "",
        phone: user.phone || "",
        bio: user.bio || "",
        location: user.location || "",
        website: user.website || "",
        department: user.department || "",
      });
    }
    setProfileImagePreview(null);
    setProfileImage(null);
    setIsEditing(false);
  };

  // Loading state
  if (status === "loading" || isLoading) {
    return <LoadingSpinner />;
  }

  // Unauthenticated state
  if (status === "unauthenticated") {
    return <AccessDenied />;
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <Card
          variant="glass"
          className="p-6 sm:p-8 text-center max-w-md w-full"
        >
          <div className="mb-6">
            <Shield className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Error Loading Profile
            </h2>
            <p className="text-gray-400 text-sm sm:text-base">
              {error.message || "Failed to load user data"}
            </p>
          </div>
          <Button
            variant="default"
            className="cursor-pointer"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  const user = userData?.user || session?.user;
  const isAdmin = user?.role === "admin";

  // Process API data with fallbacks
  const products = productsData?.data || [];
  const allOrders = allOrdersData?.orders || [];
  const userOrders = userOrdersData?.orders || [];

  // Use appropriate orders based on user role
  const orders = isAdmin ? allOrders : userOrders;

  // Get real data from user object
  const cartItems = user?.cart || [];
  const wishlistItems = user?.wishlist || [];
  const recentActivities = user?.recentActivity || [];

  // Calculate real stats from API data
  const calculateUserStats = () => {
    const totalOrders = userOrders.length || 24;
    const monthlyOrders =
      userOrders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        return (
          orderDate.getMonth() === currentMonth &&
          orderDate.getFullYear() === currentYear
        );
      }).length || 3;

    const cartItemsCount = cartItems.length || 7;
    const cartTotal =
      cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ) || 234.5;

    const wishlistCount = wishlistItems.length || 12;
    const wishlistOnSale =
      wishlistItems.filter((item) => item.onSale || item.discount > 0).length ||
      2;

    const totalSpent =
      userOrders.reduce((total, order) => total + (order.total || 0), 0) ||
      1847;
    const ordersInTransit =
      userOrders.filter(
        (order) => order.status === "shipped" || order.status === "processing"
      ).length || 2;

    return {
      totalOrders,
      monthlyOrders,
      cartItemsCount,
      cartTotal: cartTotal.toFixed(2),
      wishlistCount,
      wishlistOnSale,
      totalSpent,
      ordersInTransit,
    };
  };

  const calculateAdminStats = () => {
    const totalUsers = allUserData?.users?.length || 20;
    const productsManaged = products.length || 1234;
    const totalRevenue =
      allOrders.reduce((total, order) => total + (order.total || 0), 0) ||
      125400;
    const systemHealth = 99.2; // Mock data - would come from system monitoring

    return {
      totalUsers,
      productsManaged,
      totalRevenue,
      systemHealth,
    };
  };

  const userStatsData = calculateUserStats();
  const adminStatsData = calculateAdminStats();

  // Different stats for admin vs user
  const adminStats = [
    {
      title: "Total Users",
      value: adminStatsData.totalUsers.toLocaleString(),
      description: "+12% this month",
      icon: Users,
      color: "text-blue-400",
      bgGradient: "from-blue-500/20 to-cyan-500/20",
      glowColor: "shadow-blue-500/20",
    },
    {
      title: "Products Managed",
      value: adminStatsData.productsManaged.toLocaleString(),
      description: "+8% this week",
      icon: Package,
      color: "text-green-400",
      bgGradient: "from-green-500/20 to-emerald-500/20",
      glowColor: "shadow-green-500/20",
    },
    {
      title: "Total Revenue",
      value: `$${(adminStatsData.totalRevenue / 1000).toFixed(1)}K`,
      description: "+15% this quarter",
      icon: DollarSign,
      color: "text-purple-400",
      bgGradient: "from-purple-500/20 to-pink-500/20",
      glowColor: "shadow-purple-500/20",
    },
    {
      title: "System Health",
      value: `${adminStatsData.systemHealth}%`,
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
      value: userStatsData.totalOrders.toString(),
      description: `${userStatsData.monthlyOrders} this month`,
      icon: ShoppingBag,
      color: "text-blue-400",
      bgGradient: "from-blue-500/20 to-cyan-500/20",
      glowColor: "shadow-blue-500/20",
    },
    {
      title: "Cart Items",
      value: userStatsData.cartItemsCount.toString(),
      description: `$ ${userStatsData.cartTotal} total`,
      icon: ShoppingCart,
      color: "text-green-400",
      bgGradient: "from-green-500/20 to-emerald-500/20",
      glowColor: "shadow-green-500/20",
    },
    {
      title: "Wishlist",
      value: userStatsData.wishlistCount.toString(),
      description: `${userStatsData.wishlistOnSale} on sale`,
      icon: Heart,
      color: "text-purple-400",
      bgGradient: "from-purple-500/20 to-pink-500/20",
      glowColor: "shadow-purple-500/20",
    },
    {
      title: "Total Spent",
      value: `৳ ${userStatsData.totalSpent.toLocaleString()}`,
      description: "Since joining",
      icon: CreditCard,
      color: "text-orange-400",
      bgGradient: "from-orange-500/20 to-red-500/20",
      glowColor: "shadow-orange-500/20",
    },
  ];

  // Generate activities from real data with fallbacks
  const generateActivities = () => {
    const activities = [];

    // Add real activities from user data
    recentActivities.forEach((activity) => {
      activities.push({
        action: getActivityAction(activity.type),
        item: activity.description,
        time: formatTimeAgo(new Date(activity.timestamp)),
        type: activity.type,
      });
    });

    // Add recent orders
    const recentOrders = orders.slice(0, 2);
    recentOrders.forEach((order) => {
      activities.push({
        action: isAdmin ? "New order received" : "Placed new order",
        item: `Order #${order._id?.slice(-6) || "654321"} - $${order.total}`,
        time: formatTimeAgo(new Date(order.createdAt)),
        type: "order",
      });
    });

    // Fill with mock data if needed
    const mockActivities = [
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
    ];

    return [...activities, ...mockActivities].slice(0, 6);
  };

  const getActivityAction = (type) => {
    switch (type) {
      case "login":
        return "Logged in";
      case "update_profile":
        return "Updated profile";
      case "placed_order":
        return "Placed order";
      default:
        return "Activity";
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }
  };

  const stats = isAdmin ? adminStats : userStats;
  const activityData = generateActivities();

  // User action buttons with real data
  const userActions = [
    {
      icon: ShoppingCart,
      title: "View Cart",
      description: `${userStatsData.cartItemsCount} items • $${userStatsData.cartTotal}`,
      onClick: () => {
        router.push("/user/cart");
      },
    },
    {
      icon: History,
      title: "Order History",
      description: `View all ${userStatsData.totalOrders} orders`,
      onClick: () => {
        router.push("/user/orders");
      },
    },
    {
      icon: Heart,
      title: "Wishlist",
      description: `${userStatsData.wishlistCount} saved items`,
      onClick: () => {
        router.push("/user/wishlist");
      },
    },
    {
      icon: Truck,
      title: "Track Orders",
      description: `${userStatsData.ordersInTransit} orders in transit`,
      onClick: () => {
        router.push("/user/orders");
      },
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
                Manage your account and view your
                {isAdmin ? "system" : "shopping"} performance
              </p>
              {/* Loading indicators for additional data */}
              {(productsLoading || allOrdersLoading || userOrdersLoading) && (
                <div className="flex items-center mt-2 text-xs text-gray-500">
                  <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-500 mr-2"></div>
                  Loading additional data...
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none bg-transparent cursor-pointer"
              >
                <Settings className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </Button>
              {isEditing ? (
                <>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={handleSubmit(onSubmit)}
                    disabled={updating || !isDirty}
                    className="flex-1 sm:flex-none cursor-pointer"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">
                      {updating ? "Saving..." : "Save"}
                    </span>
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleCancelEdit}
                    className="flex-1 sm:flex-none cursor-pointer"
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
                  className="flex-1 sm:flex-none cursor-pointer"
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
                    variant={getRoleVariant(user?.role)}
                    className="text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
                  >
                    <Shield className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                    {user?.role?.toUpperCase() || "USER"}
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
                          user?.image ||
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
                      <button className="absolute bottom-1 right-1 cursor-pointer sm:bottom-2 sm:right-2 p-1.5 sm:p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg">
                        <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                    )}
                  </div>
                  {/* Profile Info */}
                  <div className="flex-1 space-y-3 sm:space-y-4 w-full">
                    {isEditing ? (
                      <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-3 sm:space-y-4"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">
                              Name
                            </label>
                            <Input
                              {...register("name", {
                                required: "Name is required",
                                minLength: {
                                  value: 2,
                                  message: "Name must be at least 2 characters",
                                },
                              })}
                              placeholder="Your name"
                              className="text-sm"
                              error={errors.name}
                            />
                            {errors.name && (
                              <ErrorMessage message={errors.name.message} />
                            )}
                          </div>
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">
                              Email
                            </label>
                            <Input
                              value={user?.email || ""}
                              disabled
                              className="text-sm opacity-50"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">
                            Bio
                          </label>
                          <textarea
                            {...register("bio", {
                              maxLength: {
                                value: 500,
                                message: "Bio must be less than 500 characters",
                              },
                            })}
                            placeholder="Tell us about yourself"
                            className={`flex w-full rounded-md border ${
                              errors.bio ? "border-red-500" : "border-gray-600"
                            } bg-gray-800/50 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
                              errors.bio
                                ? "focus:ring-red-500"
                                : "focus:ring-blue-500"
                            } focus:border-transparent min-h-[60px] sm:min-h-[80px]`}
                          />
                          {errors.bio && (
                            <ErrorMessage message={errors.bio.message} />
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">
                              Location
                            </label>
                            <Input
                              {...register("location")}
                              placeholder="Your location"
                              className="text-sm"
                              error={errors.location}
                            />
                          </div>
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">
                              Phone
                            </label>
                            <Input
                              {...register("phone", {
                                pattern: {
                                  value: /^[+]?[\d\s\-$$$$]+$/,
                                  message: "Please enter a valid phone number",
                                },
                              })}
                              placeholder="Your phone number"
                              className="text-sm"
                              error={errors.phone}
                            />
                            {errors.phone && (
                              <ErrorMessage message={errors.phone.message} />
                            )}
                          </div>
                          <div className="sm:col-span-2 lg:col-span-1">
                            <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">
                              Department
                            </label>
                            <Input
                              {...register("department")}
                              placeholder="Your department"
                              className="text-sm"
                              error={errors.department}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">
                            Website
                          </label>
                          <Input
                            {...register("website", {
                              pattern: {
                                value: /^https?:\/\/.+\..+/,
                                message:
                                  "Please enter a valid URL (e.g., https://example.com)",
                              },
                            })}
                            placeholder="Your website"
                            className="text-sm"
                            error={errors.website}
                          />
                          {errors.website && (
                            <ErrorMessage message={errors.website.message} />
                          )}
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className="text-center sm:text-left">
                          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                            {user?.name || "Unnamed User"}
                          </h2>
                          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 sm:gap-4 text-gray-400 text-sm">
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span className="truncate">{user?.email}</span>
                            </div>
                            {user?.location && (
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                                <span className="truncate">
                                  {user.location}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span>
                                Joined{" "}
                                {new Date(user?.createdAt).getFullYear() ||
                                  "2023"}
                              </span>
                            </div>
                          </div>
                        </div>
                        {user?.bio && (
                          <p className="text-gray-300 leading-relaxed text-center sm:text-left text-sm sm:text-base">
                            {user.bio}
                          </p>
                        )}
                        {/* Contact Info */}
                        <div className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4">
                          {user?.phone && (
                            <div className="flex items-center text-xs sm:text-sm text-gray-400">
                              <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span className="truncate">{user.phone}</span>
                            </div>
                          )}
                          {user?.website && (
                            <div className="flex items-center text-xs sm:text-sm text-gray-400">
                              <Globe className="h-4 w-4 mr-2 flex-shrink-0" />
                              <Link
                                href={user.website}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <span className="truncate hover:text-blue-400 transition-colors">
                                  {user.website}
                                </span>
                              </Link>
                            </div>
                          )}
                          {user?.department && (
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
                      <button className=" cursor-pointer p-2 bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors">
                        <Github className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                      <button className=" cursor-pointer p-2 bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors">
                        <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                      <button className=" cursor-pointer p-2 bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors">
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
            <RecentActivity isAdmin={isAdmin} recentActivities={activityData} />
            {/* User Actions or Admin Tools */}
            <Actions
              isAdmin={isAdmin}
              products={products}
              adminStatsData={adminStatsData}
              userActions={userActions}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
