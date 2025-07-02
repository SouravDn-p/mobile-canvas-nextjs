"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import Badge from "../components/ui/badge";
import Input from "../components/ui/input";
import Label from "../components/ui/Label";
import { Textarea } from "../components/ui/textarea";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import {
  User,
  Package,
  ShoppingBag,
  Heart,
  Settings,
  Edit,
  Save,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Card from "../components/ui/card";
import CardContent from "../components/ui/cardContent";
import CardHeader from "../components/ui/cardHeader";
import CardTitle from "../components/ui/card/cardTitle";
import CardDescription from "../components/ui/card/CardDescription";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Initialize userProfile with default values
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, Anytown, ST 12345",
    bio: "Tech enthusiast and gadget lover",
    joinDate: "2023-01-15",
    avatar:
      session?.user?.image ||
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Update userProfile when session data becomes available
  useEffect(() => {
    if (session?.user) {
      setUserProfile((prev) => ({
        ...prev,
        name: session.user.name || "",
        email: session.user.email || "",
        avatar: session.user.image || prev.avatar,
      }));
    }
  }, [session]);

  // Show loading or return null while checking auth
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-brEs-br from-black via-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  // Mock order history
  const orderHistory = [
    {
      id: "ORD-001",
      date: "2024-01-15",
      status: "delivered",
      total: 1199.99,
      items: [
        {
          name: "iPhone 15 Pro Max",
          price: 1199.99,
          quantity: 1,
          image:
            "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg",
        },
      ],
    },
    {
      id: "ORD-002",
      date: "2024-01-10",
      status: "shipped",
      total: 899.99,
      items: [
        {
          name: 'iPad Pro 12.9"',
          price: 899.99,
          quantity: 1,
          image:
            "https://images.pexels.com/photos/1334598/pexels-photo-1334598.jpeg",
        },
      ],
    },
    {
      id: "ORD-003",
      date: "2024-01-05",
      status: "processing",
      total: 649.98,
      items: [
        {
          name: "AirPods Pro",
          price: 249.99,
          quantity: 1,
          image:
            "https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg",
        },
        {
          name: "Apple Watch Series 9",
          price: 399.99,
          quantity: 1,
          image:
            "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg",
        },
      ],
    },
    {
      id: "ORD-004",
      date: "2023-12-20",
      status: "cancelled",
      total: 1299.99,
      items: [
        {
          name: 'MacBook Pro 16"',
          price: 1299.99,
          quantity: 1,
          image: "https://images.pexels.com/photos/18105/pexels-photo.jpg",
        },
      ],
    },
  ];

  // Mock wishlist
  const wishlist = [
    {
      id: "1",
      name: "Samsung Galaxy S24 Ultra",
      price: 1099,
      image:
        "https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg",
      inStock: true,
    },
    {
      id: "2",
      name: "Sony WH-1000XM5",
      price: 399,
      image:
        "https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg",
      inStock: true,
    },
    {
      id: "3",
      name: "Dell XPS 13",
      price: 1199,
      image: "https://images.pexels.com/photos/18105/pexels-photo.jpg",
      inStock: false,
    },
  ];

  const handleSaveProfile = async () => {
    setIsEditing(false);
    // Here you would typically save to backend
    try {
      // Example API call to update user profile
      // await fetch('/api/user', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(userProfile)
      // });
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "shipped":
        return <Truck className="h-4 w-4 text-blue-400" />;
      case "processing":
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-500/20 text-green-400";
      case "shipped":
        return "bg-blue-500/20 text-blue-400";
      case "processing":
        return "bg-yellow-500/20 text-yellow-400";
      case "cancelled":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Dashboard</h1>
          <p className="text-gray-400">
            {session.user.role === "admin"
              ? "Admin Dashboard: Manage users and products"
              : "Manage your profile and view your activity"}
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="glass border-white/10 border rounded-md">
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-green-500/20 cursor-pointer "
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="data-[state=active]:bg-green-500/20 cursor-pointer"
            >
              <Package className="mr-2 h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger
              value="wishlist"
              className="data-[state=active]:bg-green-500/20 cursor-pointer"
            >
              <Heart className="mr-2 h-4 w-4" />
              Wishlist
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-green-500/20 cursor-pointer"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
            {session.user.role === "admin" && (
              <TabsTrigger
                value="admin"
                className="data-[state=active]:bg-green-500/20 cursor-pointer"
              >
                <Settings className="mr-2 h-4 w-4" />
                Admin Panel
              </TabsTrigger>
            )}
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="glass border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">
                      Profile Information
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Manage your personal information
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() =>
                      isEditing ? handleSaveProfile() : setIsEditing(true)
                    }
                    className="bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 text-black"
                  >
                    {isEditing ? (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save
                      </>
                    ) : (
                      <>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={userProfile.avatar}
                      alt={userProfile.name}
                    />
                    <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-400 text-black text-xl">
                      {userProfile.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {userProfile.name}
                    </h3>
                    <p className="text-gray-400">{userProfile.email}</p>
                    <div className="flex items-center mt-2 text-sm text-gray-400">
                      <Calendar className="mr-1 h-3 w-3" />
                      Member since{" "}
                      {new Date(userProfile.joinDate).toLocaleDateString()}
                    </div>
                    {session.user.role === "admin" && (
                      <Badge className="mt-2 bg-purple-500/20 text-purple-400">
                        Admin
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-white">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        value={userProfile.name}
                        onChange={(e) =>
                          setUserProfile({
                            ...userProfile,
                            name: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        className="glass border-white/20 bg-white/5 text-white disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-white">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={userProfile.email}
                        onChange={(e) =>
                          setUserProfile({
                            ...userProfile,
                            email: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        className="glass border-white/20 bg-white/5 text-white disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-white">
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        value={userProfile.phone}
                        onChange={(e) =>
                          setUserProfile({
                            ...userProfile,
                            phone: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        className="glass border-white/20 bg-white/5 text-white disabled:opacity-50"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address" className="text-white">
                        Address
                      </Label>
                      <Input
                        id="address"
                        value={userProfile.address}
                        onChange={(e) =>
                          setUserProfile({
                            ...userProfile,
                            address: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        className="glass border-white/20 bg-white/5 text-white disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio" className="text-white">
                        Bio
                      </Label>
                      <Textarea
                        id="bio"
                        value={userProfile.bio}
                        onChange={(e) =>
                          setUserProfile({
                            ...userProfile,
                            bio: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        className="glass border-white/20 bg-white/5 text-white disabled:opacity-50"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Order History</CardTitle>
                <CardDescription className="text-gray-400">
                  View and track your orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderHistory.map((order) => (
                    <div
                      key={order.id}
                      className="glass rounded-lg p-4 border border-white/5"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h4 className="font-semibold text-white">
                              {order.id}
                            </h4>
                            <p className="text-sm text-gray-400">
                              {new Date(order.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(order.status)}
                            <Badge className={getStatusColor(order.status)}>
                              {order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-white">
                            ${order.total.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-400">
                            {order.items.length} item(s)
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-3"
                          >
                            <Image
                              width={500}
                              height={500}
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <p className="text-white text-sm">{item.name}</p>
                              <p className="text-gray-400 text-xs">
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <p className="text-white text-sm">
                              ${item.price.toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist" className="space-y-6">
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-white">My Wishlist</CardTitle>
                <CardDescription className="text-gray-400">
                  Items you&apos;ve saved for later
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wishlist.map((item) => (
                    <div
                      key={item.id}
                      className="glass rounded-lg p-4 border border-white/5"
                    >
                      <Image
                        width={500}
                        height={500}
                        src={item.image}
                        alt={item.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                      <h4 className="font-semibold text-white mb-2">
                        {item.name}
                      </h4>
                      <div className="flex items-center justify-between">
                        <p className="text-green-400 font-semibold">
                          ${item.price}
                        </p>
                        <Badge
                          className={
                            item.inStock
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }
                        >
                          {item.inStock ? "In Stock" : "Out of Stock"}
                        </Badge>
                      </div>
                      <div className="flex space-x-2 mt-3">
                        <Button
                          size="sm"
                          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 text-black"
                          disabled={!item.inStock}
                        >
                          <ShoppingBag className="mr-1 h-3 w-3" />
                          Add to Cart
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Account Settings</CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage your account preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 text-black">
                    Change Password
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10"
                  >
                    Two-Factor Authentication
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10"
                  >
                    Download My Data
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Notifications</CardTitle>
                  <CardDescription className="text-gray-400">
                    Choose what you want to be notified about
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white">Order Updates</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">New Products</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Promotions</span>
                    <input type="checkbox" className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Newsletter</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Admin Panel Tab */}
          {session.user.role === "admin" && (
            <TabsContent value="admin" className="space-y-6">
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Admin Panel</CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage users and products
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-400 hover:from-purple-600 hover:to-indigo-500 text-white">
                    Manage Users
                  </Button>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-400 hover:from-purple-600 hover:to-indigo-500 text-white">
                    Manage Products
                  </Button>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-400 hover:from-purple-600 hover:to-indigo-500 text-white">
                    View Analytics
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
