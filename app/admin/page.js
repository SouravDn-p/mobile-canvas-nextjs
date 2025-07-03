"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/radix/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import Link from "next/link";
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Plus,
  BarChart3,
  Settings,
} from "lucide-react";
import Badge from "../components/ui/badge";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "loading" && (!session || session.user.role !== "admin")) {
      router.push("/login");
    }
  }, [session, status, router]);

  if (status === "loading" || !session || session.user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Mock data for admin dashboard
  const stats = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      change: "+20.1%",
      icon: DollarSign,
      color: "from-green-500 to-emerald-400",
    },
    {
      title: "Total Orders",
      value: "2,350",
      change: "+180.1%",
      icon: ShoppingCart,
      color: "from-blue-500 to-cyan-400",
    },
    {
      title: "Total Products",
      value: "573",
      change: "+19%",
      icon: Package,
      color: "from-purple-500 to-pink-400",
    },
    {
      title: "Total Users",
      value: "12,234",
      change: "+201",
      icon: Users,
      color: "from-orange-500 to-red-400",
    },
  ];

  const recentOrders = [
    {
      id: "ORD-001",
      customer: "John Doe",
      product: "iPhone 15 Pro",
      amount: "$1,199",
      status: "completed",
    },
    {
      id: "ORD-002",
      customer: "Jane Smith",
      product: "MacBook Pro",
      amount: "$2,399",
      status: "processing",
    },
    {
      id: "ORD-003",
      customer: "Bob Johnson",
      product: "iPad Pro",
      amount: "$899",
      status: "shipped",
    },
    {
      id: "ORD-004",
      customer: "Alice Brown",
      product: "AirPods Pro",
      amount: "$249",
      status: "pending",
    },
    {
      id: "ORD-005",
      customer: "Charlie Wilson",
      product: "Apple Watch",
      amount: "$399",
      status: "completed",
    },
  ];

  const topProducts = [
    { name: "iPhone 15 Pro Max", sales: 234, revenue: "$280,566" },
    { name: 'MacBook Pro 16"', sales: 123, revenue: "$294,777" },
    { name: 'iPad Pro 12.9"', sales: 189, revenue: "$169,911" },
    { name: "AirPods Pro", sales: 456, revenue: "$113,544" },
    { name: "Apple Watch Series 9", sales: 234, revenue: "$93,366" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400";
      case "processing":
        return "bg-yellow-500/20 text-yellow-400";
      case "shipped":
        return "bg-blue-500/20 text-blue-400";
      case "pending":
        return "bg-gray-500/20 text-gray-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-400">
            Welcome back, {session.user.name}. Here&apos;s what&apos;s happening
            with your store.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="glass border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-white">
                      {stat.value}
                    </p>
                    <p className="text-xs text-green-400 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {stat.change} from last month
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-full bg-gradient-to-r ${stat.color}`}
                  >
                    <stat.icon className="h-6 w-6 text-black" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="glass border-white/10">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-green-500/20 cursor-pointer"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="data-[state=active]:bg-green-500/20 cursor-pointer"
            >
              Recent Orders
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className="data-[state=active]:bg-green-500/20 cursor-pointer"
            >
              Top Products
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                  <CardDescription className="text-gray-400">
                    Common administrative tasks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 ">
                  <Button className="w-full bg-gradient-to-r flex cursor-pointer from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 text-black font-semibold">
                    <Link
                      href="/admin/products"
                      className="flex items-center text-center "
                    >
                      <Package className="mr-2 h-4 w-4" />
                      Manage Products
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Manage Users
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10"
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Analytics
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    System Settings
                  </Button>
                </CardContent>
              </Card>

              {/* System Status */}
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">System Status</CardTitle>
                  <CardDescription className="text-gray-400">
                    Current system health and performance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white">Server Status</span>
                    <Badge className="bg-green-500/20 text-green-400">
                      Online
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Database</span>
                    <Badge className="bg-green-500/20 text-green-400">
                      Connected
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Payment Gateway</span>
                    <Badge className="bg-green-500/20 text-green-400">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Email Service</span>
                    <Badge className="bg-yellow-500/20 text-yellow-400">
                      Warning
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Recent Orders</CardTitle>
                <CardDescription className="text-gray-400">
                  Latest customer orders and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 glass rounded-lg border border-white/5"
                    >
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-semibold text-white">{order.id}</p>
                          <p className="text-sm text-gray-400">
                            {order.customer}
                          </p>
                        </div>
                        <div>
                          <p className="text-white">{order.product}</p>
                          <p className="text-sm text-gray-400">
                            {order.amount}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </Badge>
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-white">
                  Top Selling Products
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Best performing products this month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 glass rounded-lg border border-white/5"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h- personally identifiable information h-8 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full flex items-center justify-center text-black font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-white">
                            {product.name}
                          </p>
                          <p className="text-sm text-gray-400">
                            {product.sales} units sold
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white">
                          {product.revenue}
                        </p>
                        <p className="text-sm text-gray-400">Revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
