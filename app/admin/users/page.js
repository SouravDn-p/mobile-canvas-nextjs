"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "@/app/components/ui/button";
import Card from "@/app/components/ui/card";
import CardContent from "@/app/components/ui/cardContent";
import CardHeader from "@/app/components/ui/cardHeader";
import CardTitle from "@/app/components/ui/card/cardTitle";
import CardDescription from "@/app/components/ui/card/CardDescription";
import Badge from "@/app/components/ui/badge";
import {
  Users,
  Search,
  Edit,
  Trash2,
  Shield,
  ShieldCheck,
  Mail,
  Calendar,
  Activity,
  UserPlus,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import Image from "next/image";
import { useGetAllUsersQuery } from "@/redux/api/productapi";

const UserManagementPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data: userData, isLoading, error } = useGetAllUsersQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState([]);

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
          <span className="text-white text-lg">Loading User Management...</span>
        </div>
      </div>
    );
  }

  if (!session || session?.user?.role !== "admin") {
    return null;
  }

  // Mock users data with more comprehensive information
  const mockUsers = userData?.users || [];

  // Filter users based on search and filters
  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getUserStats = () => {
    return {
      total: mockUsers.length,
      active: mockUsers.filter((u) => u.status === "active").length,
      inactive: mockUsers.filter((u) => u.status === "inactive").length,
      suspended: mockUsers.filter((u) => u.status === "suspended").length,
      admins: mockUsers.filter((u) => u.role === "admin").length,
      users: mockUsers.filter((u) => u.role === "user").length,
    };
  };

  const stats = getUserStats();

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "inactive":
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case "suspended":
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "inactive":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "suspended":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <ShieldCheck className="h-4 w-4 text-purple-400" />;
      case "moderator":
        return <Shield className="h-4 w-4 text-blue-400" />;
      default:
        return <Users className="h-4 w-4 text-gray-400" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "moderator":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
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
        <div className="space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                User Management
              </h1>
              <p className="mt-2 text-gray-400 text-sm sm:text-base">
                Manage user accounts, roles, and permissions
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
              <Button
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-500 bg-transparent"
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 ">
            <Card className="hover:shadow-lg transition-all duration-300 group ">
              <CardContent className="pt-4 ">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-400">
                      Total Users
                    </p>
                    <p className="text-xl font-bold text-white">
                      {stats.total}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20">
                    <Users className="h-4 w-4 text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 group">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-400">Active</p>
                    <p className="text-xl font-bold text-white">
                      {stats.active}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 group">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-400">
                      Inactive
                    </p>
                    <p className="text-xl font-bold text-white">
                      {stats.inactive}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20">
                    <Clock className="h-4 w-4 text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 group">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-400">
                      Suspended
                    </p>
                    <p className="text-xl font-bold text-white">
                      {stats.suspended}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-gradient-to-r from-red-500/20 to-pink-500/20">
                    <XCircle className="h-4 w-4 text-red-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 group">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-400">Admins</p>
                    <p className="text-xl font-bold text-white">
                      {stats.admins}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20">
                    <ShieldCheck className="h-4 w-4 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 group">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-400">Regular</p>
                    <p className="text-xl font-bold text-white">
                      {stats.users}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-gradient-to-r from-gray-500/20 to-slate-500/20">
                    <Users className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                  />
                </div>

                {/* Role Filter */}
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                  <option value="user">User</option>
                </select>

                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Users className="mr-2 h-5 w-5 text-purple-400" />
                Users ({filteredUsers.length})
              </CardTitle>
              <CardDescription className="text-gray-400">
                Manage user accounts and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="flex items-center space-x-4 p-4 bg-gray-800/30 rounded-lg">
                        <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                          <div className="h-3 bg-gray-700 rounded w-1/3"></div>
                        </div>
                        <div className="h-6 bg-gray-700 rounded w-16"></div>
                        <div className="h-6 bg-gray-700 rounded w-20"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">
                    No users found
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex flex-col lg:flex-row lg:items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700/50 hover:bg-gray-800/50 transition-colors space-y-4 lg:space-y-0"
                    >
                      <div className="flex items-center space-x-4">
                        <Image
                          src={user.avatar || "/placeholder.svg"}
                          alt={user.name}
                          width={40}
                          height={40}
                          className="rounded-full bg-gray-700"
                        />
                        <div>
                          <h3 className="font-semibold text-white">
                            {user.name}
                          </h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-400">
                            <Mail className="h-3 w-3" />
                            <span>{user.email}</span>
                          </div>
                          <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              Joined{" "}
                              {new Date(user.joinDate).toLocaleDateString()}
                            </span>
                            <span className="flex items-center">
                              <Activity className="h-3 w-3 mr-1" />
                              Last active{" "}
                              {new Date(user.lastActive).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <div className="flex items-center space-x-2">
                          <Badge
                            className={`${getRoleColor(
                              user.role
                            )} border text-xs`}
                          >
                            {getRoleIcon(user.role)}
                            <span className="ml-1 capitalize">{user.role}</span>
                          </Badge>
                          <Badge
                            className={`${getStatusColor(
                              user.status
                            )} border text-xs`}
                          >
                            {getStatusIcon(user.status)}
                            <span className="ml-1 capitalize">
                              {user.status}
                            </span>
                          </Badge>
                        </div>

                        <div className="text-right text-sm">
                          <p className="text-white font-medium">
                            {user.totalOrders} orders
                          </p>
                          <p className="text-gray-400">
                            ${user.totalSpent?.toFixed(2)} spent
                          </p>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-gray-400 hover:text-white"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-gray-400 hover:text-white"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-gray-400 hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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

export default UserManagementPage;
