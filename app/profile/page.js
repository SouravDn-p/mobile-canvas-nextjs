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
  Star,
  Award,
  Activity,
  Calendar,
  MapPin,
  Phone,
  Globe,
  Github,
  Twitter,
  Linkedin,
  Package,
  TrendingUp,
  ShoppingBag,
  BarChart3,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

// Enhanced Inline Components with Dark Theme
const Button = ({
  children,
  className = "",
  variant = "default",
  size = "default",
  type = "button",
  disabled = false,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 transform hover:scale-105";

  const variants = {
    default:
      "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl",
    outline:
      "border border-gray-600 bg-gray-800/50 text-gray-200 hover:bg-gray-700/50 backdrop-blur-sm hover:border-gray-500",
    ghost: "hover:bg-gray-800/50 text-gray-300 hover:text-white",
    success:
      "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl",
    premium:
      "bg-gradient-to-r from-yellow-600 to-orange-600 text-white hover:from-yellow-700 hover:to-orange-700 shadow-lg hover:shadow-xl",
  };

  const sizes = {
    default: "h-11 px-6 py-2",
    sm: "h-9 rounded-lg px-4",
    lg: "h-12 rounded-xl px-8",
  };

  const classes = `${baseClasses} ${variants[variant]} ${
    sizes[size]
  } ${className} ${
    disabled ? "opacity-50 cursor-not-allowed transform-none" : ""
  }`;

  return (
    <button type={type} className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  );
};

const Card = ({ children, className = "", variant = "default", ...props }) => {
  const variants = {
    default:
      "rounded-2xl border border-gray-700/50 bg-gray-900/50 text-gray-100 shadow-xl backdrop-blur-sm",
    gradient:
      "rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/30 text-gray-100 shadow-xl backdrop-blur-sm",
    glass:
      "rounded-2xl bg-gray-900/30 border border-gray-700/30 text-gray-100 shadow-xl backdrop-blur-xl",
    premium:
      "rounded-2xl bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border border-yellow-500/30 text-gray-100 shadow-xl backdrop-blur-sm",
  };

  return (
    <div className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = "", ...props }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className = "", ...props }) => (
  <h3
    className={`text-xl font-semibold leading-none tracking-tight ${className}`}
    {...props}
  >
    {children}
  </h3>
);

const CardDescription = ({ children, className = "", ...props }) => (
  <p className={`text-sm text-gray-400 ${className}`} {...props}>
    {children}
  </p>
);

const CardContent = ({ children, className = "", ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

const Badge = ({ children, className = "", variant = "default" }) => {
  const variants = {
    default: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
    admin: "bg-red-500/20 text-red-300 border border-red-500/30",
    premium: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
    success: "bg-green-500/20 text-green-300 border border-green-500/30",
    purple: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-sm ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

const StatCard = ({
  icon: Icon,
  title,
  value,
  description,
  color,
  bgGradient,
  glowColor,
}) => (
  <Card
    className={`hover:shadow-2xl ${glowColor} shadow-xl group cursor-pointer transition-all duration-500`}
  >
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
        <div
          className={`p-3 rounded-xl bg-gradient-to-r ${bgGradient} group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <Card variant="glass" className="p-8 text-center max-w-md">
          <div className="mb-6">
            <Shield className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Access Denied
            </h2>
            <p className="text-gray-400">
              You must be logged in to view this page.
            </p>
          </div>
          <Link href="/login">
            <Button variant="default" className="w-full cursor-pointer">
              Sign In
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const { user } = session;

  const stats = [
    {
      title: "Products Managed",
      value: "1,234",
      description: "+12% this month",
      icon: Package,
      color: "text-blue-400",
      bgGradient: "from-blue-500/20 to-cyan-500/20",
      glowColor: "shadow-blue-500/20",
    },
    {
      title: "Orders Processed",
      value: "856",
      description: "+8% this week",
      icon: ShoppingBag,
      color: "text-green-400",
      bgGradient: "from-green-500/20 to-emerald-500/20",
      glowColor: "shadow-green-500/20",
    },
    {
      title: "Revenue Impact",
      value: "$45.2K",
      description: "+15% this quarter",
      icon: TrendingUp,
      color: "text-purple-400",
      bgGradient: "from-purple-500/20 to-pink-500/20",
      glowColor: "shadow-purple-500/20",
    },
    {
      title: "Efficiency Score",
      value: "98.5%",
      description: "Above average",
      icon: BarChart3,
      color: "text-orange-400",
      bgGradient: "from-orange-500/20 to-red-500/20",
      glowColor: "shadow-orange-500/20",
    },
  ];

  const recentActivities = [
    {
      action: "Updated product inventory",
      item: "Wireless Headphones",
      time: "2 hours ago",
      type: "update",
    },
    {
      action: "Added new supplier",
      item: "TechCorp Solutions",
      time: "5 hours ago",
      type: "add",
    },
    {
      action: "Generated monthly report",
      item: "Q1 Analytics",
      time: "1 day ago",
      type: "report",
    },
    {
      action: "Approved purchase order",
      item: "PO-2024-001",
      time: "2 days ago",
      type: "approve",
    },
  ];

  const achievements = [
    {
      title: "Inventory Master",
      description: "Managed 1000+ products",
      icon: Award,
      color: "text-yellow-400",
    },
    {
      title: "Efficiency Expert",
      description: "98%+ accuracy rate",
      icon: Star,
      color: "text-blue-400",
    },
    {
      title: "Team Leader",
      description: "Led 5+ successful projects",
      icon: Shield,
      color: "text-purple-400",
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

  const getActivityIcon = (type) => {
    switch (type) {
      case "update":
        return <Edit className="h-4 w-4 text-blue-400" />;
      case "add":
        return <Package className="h-4 w-4 text-green-400" />;
      case "report":
        return <BarChart3 className="h-4 w-4 text-purple-400" />;
      case "approve":
        return <CheckCircle className="h-4 w-4 text-orange-400" />;
      default:
        return <Activity className="h-4 w-4 text-gray-400" />;
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

      <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8 relative z-10">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Profile Dashboard
              </h1>
              <p className="mt-2 text-gray-400">
                Manage your account and view your performance
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <Button
                variant="default"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="mr-2 h-4 w-4" />
                {isEditing ? "Save Changes" : "Edit Profile"}
              </Button>
            </div>
          </div>

          {/* Profile Header Card */}
          <Card variant="gradient" className="mb-8 overflow-hidden">
            <div className="relative">
              {/* Cover Background */}
              <div className="h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-4 right-4">
                  <Badge
                    variant={getRoleVariant(user.role)}
                    className="text-sm px-4 py-2"
                  >
                    <Shield className="mr-1 h-4 w-4" />
                    {user.role?.toUpperCase() || "USER"}
                  </Badge>
                </div>
              </div>

              {/* Profile Content */}
              <CardContent className="pt-0 pb-6">
                <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6 -mt-16">
                  {/* Profile Image */}
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-gray-800 bg-gray-800 shadow-2xl">
                      <Image
                        src={
                          user.image || "/placeholder.svg?height=200&width=200"
                        }
                        alt="Profile"
                        width={128}
                        height={128}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <button className="absolute bottom-2 right-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg">
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">
                        {user.name || "Unnamed User"}
                      </h2>
                      <div className="flex flex-wrap items-center gap-4 text-gray-400">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          {user.email}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          {user.location}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          Joined {user.joinDate}
                        </div>
                      </div>
                    </div>

                    {user.bio && (
                      <p className="text-gray-300 max-w-2xl leading-relaxed">
                        {user.bio}
                      </p>
                    )}

                    {/* Contact Info */}
                    <div className="flex flex-wrap gap-4">
                      {user.phone && (
                        <div className="flex items-center text-sm text-gray-400">
                          <Phone className="h-4 w-4 mr-2" />
                          {user.phone}
                        </div>
                      )}
                      {user.website && (
                        <div className="flex items-center text-sm text-gray-400">
                          <Globe className="h-4 w-4 mr-2" />
                          {user.website}
                        </div>
                      )}
                      {user.department && (
                        <div className="flex items-center text-sm text-gray-400">
                          <User className="h-4 w-4 mr-2" />
                          {user.department}
                        </div>
                      )}
                    </div>

                    {/* Social Links */}
                    <div className="flex space-x-3">
                      <button className="p-2 bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors">
                        <Github className="h-5 w-5" />
                      </button>
                      <button className="p-2 bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors">
                        <Twitter className="h-5 w-5" />
                      </button>
                      <button className="p-2 bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors">
                        <Linkedin className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <Card variant="gradient">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="mr-2 h-6 w-6 text-blue-400" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>
                    Your latest actions and updates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-4 p-4 border border-gray-700/50 rounded-xl hover:bg-gray-800/30 transition-all duration-300"
                      >
                        <div className="flex-shrink-0 p-2 rounded-lg bg-gray-800/50">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-white">
                            {activity.action}
                          </p>
                          <p className="text-sm text-gray-400">
                            {activity.item}
                          </p>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {activity.time}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Achievements & Admin Tools */}
            <div className="space-y-6">
              {/* Achievements */}
              <Card variant="glass">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="mr-2 h-6 w-6 text-yellow-400" />
                    Achievements
                  </CardTitle>
                  <CardDescription>
                    Your accomplishments and milestones
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {achievements.map((achievement, index) => {
                      const Icon = achievement.icon;
                      return (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-3 rounded-lg bg-gray-800/30"
                        >
                          <Icon className={`h-8 w-8 ${achievement.color}`} />
                          <div>
                            <p className="font-medium text-white text-sm">
                              {achievement.title}
                            </p>
                            <p className="text-xs text-gray-400">
                              {achievement.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Admin Tools */}
              {user.role === "admin" && (
                <Card variant="premium">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="mr-2 h-6 w-6 text-yellow-400" />
                      Admin Tools
                    </CardTitle>
                    <CardDescription>
                      Administrative functions and controls
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Package className="mr-2 h-4 w-4" />
                        Manage Products
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <User className="mr-2 h-4 w-4" />
                        View All Users
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        System Settings
                      </Button>
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
