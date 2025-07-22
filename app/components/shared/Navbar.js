"use client";

import Link from "next/link";
import {
  Home,
  ShoppingCart,
  BarChart3,
  LogIn,
  UserPlus,
  Menu,
  X,
  User,
  ChevronDown,
  Settings,
  BarChart3Icon,
  Package,
  Heart,
  CreditCard,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import logo from "@/public/logo.jpg";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { MdOutlineDashboard, MdOutlineLogout } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { data: session, status } = useSession();

  // Mock cart data - replace with your actual cart state management
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "iPhone 15 Pro",
      price: 999,
      quantity: 1,
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 2,
      name: "MacBook Air M2",
      price: 1299,
      quantity: 1,
      image: "/placeholder.svg?height=60&width=60",
    },
  ]);
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      setCartItems(cartItems.filter((item) => item.id !== id));
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest(".user-dropdown")) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isUserMenuOpen]);

  const isActive = (path) => {
    return pathname === path;
  };

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    // { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/products", label: "Products", icon: ShoppingCart },
    { href: "/profile", label: "Profile", icon: User },
  ];

  const userMenuItems = [
    {
      to: "/profile",
      icon: <FaUserCircle className="w-4 h-4" />,
      label: "Your Profile",
    },
    // {
    //   to: "/dashboard",
    //   icon: <MdOutlineDashboard className="w-4 h-4" />,
    //   label: "Dashboard",
    // },
    {
      to: "/user/cart",
      label: "Cart Item",
      icon: <Package className="w-4 h-4" />,
    },
    {
      to: "/user/orders",
      label: "My Orders",
      icon: <Package className="w-4 h-4" />,
    },
    {
      to: "/user/wishlist",
      label: "Wishlist",
      icon: <Heart className="w-4 h-4" />,
    },
    {
      to: "/settings",
      icon: <Settings className="w-4 h-4" />,
      label: "Settings",
    },
  ];

  const adminMenuItems = [
    {
      to: "/admin",
      icon: <BarChart3Icon className="w-4 h-4" />,
      label: "Admin Dashboard",
    },
    {
      to: "/dashboard",
      icon: <MdOutlineDashboard className="w-4 h-4" />,
      label: "Dashboard",
    },
    {
      to: "/settings",
      icon: <Settings className="w-4 h-4" />,
      label: "Settings",
    },
  ];

  return (
    <nav className="bg-gray-900/95 backdrop-blur-sm shadow-2xl border-b border-gray-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 hover:opacity-80 transition-all duration-300 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-300 rounded-xl p-1">
                <Image
                  src={logo || "/placeholder.svg"}
                  alt="Mobile Canvas Logo"
                  width={40}
                  height={40}
                  className="rounded-lg cursor-pointer"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl tracking-tight transition-all duration-300 font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Mobile Canvas
              </span>
              <span
                className={`text-sm font-medium transition-all duration-300 ${
                  scrolled ? "text-white/90 drop-shadow-md" : "text-blue-300"
                }`}
              >
                Tech & Beyond
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 group ${
                    isActive(link.href)
                      ? "text-blue-300"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {isActive(link.href) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl border border-blue-500/30" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-purple-600/0 group-hover:from-blue-600/10 group-hover:to-purple-600/10 rounded-xl transition-all duration-300" />
                  <Icon className="h-4 w-4 relative z-10" />
                  <span className="font-medium relative z-10">
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {!session?.user?.email ? (
              <>
                <Link href="/login">
                  <button className="flex items-center cursor-pointer space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-xl transition-all duration-300 group">
                    <LogIn className="h-4 w-4" />
                    <span>Login</span>
                  </button>
                </Link>
                <Link href="/register">
                  <button className="relative flex items-center cursor-pointer space-x-2 px-4 py-2 rounded-xl transition-all duration-300 group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-purple-600/80 blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                    <UserPlus className="h-4 w-4 relative z-10 text-white" />
                    <span className="relative z-10 text-white font-medium">
                      Register
                    </span>
                  </button>
                </Link>
              </>
            ) : (
              <>
                <div className="relative user-dropdown">
                  <button
                    className="flex items-center space-x-3 p-1 rounded-xl transition-all duration-300 hover:bg-gray-800/50 group"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsUserMenuOpen(!isUserMenuOpen);
                    }}
                  >
                    <div className="relative cursor-pointer">
                      <div className="absolute cursor-pointer inset-0 bg-gradient-to-r from-pink-500 to-purple-400 rounded-full blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
                      <Image
                        src={
                          session?.user?.image ||
                          "https://i.ibb.co/Y75m1Mk9/Final-Boss.jpg" ||
                          "/placeholder.svg"
                        }
                        alt="Profile"
                        width={36}
                        height={36}
                        className=" relative w-9 h-9 rounded-full border-2 border-pink-400 group-hover:border-purple-400 transition-all duration-300 cursor-pointer"
                      />
                    </div>
                    <div className="hidden lg:block text-left cursor-pointer">
                      <p className="text-white font-medium text-sm">
                        {session.user?.name || "User"}
                      </p>
                      <p className="text-gray-400 text-xs truncate max-w-32">
                        {session.user?.email}
                      </p>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${
                        isUserMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-2xl overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
                      <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 shadow-2xl shadow-purple-500/10">
                        {/* Menu Items */}
                        <div className="p-2">
                          {(session?.user?.role === "user"
                            ? userMenuItems
                            : adminMenuItems
                          ).map((item, index) => (
                            <Link
                              key={index}
                              href={item.to}
                              className="flex items-center gap-3 py-3 px-4 transition-all duration-200 relative overflow-hidden text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 rounded-xl group"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <span className="text-blue-300 group-hover:text-purple-400 transition-all duration-300">
                                {item.icon}
                              </span>
                              <span className="relative z-10 font-medium">
                                {item.label}
                              </span>
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent hover:from-pink-500/5 hover:to-purple-400/5 transition-all duration-200 opacity-0 hover:opacity-100"></div>
                            </Link>
                          ))}
                        </div>

                        {/* Logout Section */}
                        <div className="p-2 border-t border-gray-700/50">
                          <button
                            onClick={() => {
                              signOut();
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 py-3 px-4 transition-all duration-200 relative overflow-hidden text-red-400 hover:text-red-300 hover:bg-red-600/20 rounded-xl group"
                          >
                            <MdOutlineLogout className="w-4 h-4" />
                            <span className="relative z-10 font-medium">
                              Logout
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white focus:outline-none focus:text-white transition-colors duration-300 p-2 rounded-lg hover:bg-gray-800/50 cursor-pointer"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-700/50 mt-2 animate-in slide-in-from-top-2 duration-200">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900/50 backdrop-blur-sm rounded-b-2xl">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-300 ${
                      isActive(link.href)
                        ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-300 border border-blue-500/30"
                        : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                );
              })}

              <div className="border-t border-gray-700/50 pt-3 mt-3">
                {!session?.user?.email ? (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center space-x-3 px-3 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-xl transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LogIn className="h-5 w-5" />
                      <span>Login</span>
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center cursor-pointer space-x-3 px-3 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 rounded-xl transition-all duration-300 mt-2 shadow-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <UserPlus className="h-5 w-5" />
                      <span>Register</span>
                    </Link>
                  </>
                ) : (
                  <div className="space-y-2">
                    {/* Mobile User Menu Items */}

                    {(session?.user?.role === "user"
                      ? userMenuItems
                      : adminMenuItems
                    ).map((item, index) => (
                      <Link
                        key={index}
                        href={item.to}
                        className="flex items-center space-x-3 px-3 py-3 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 rounded-xl transition-all duration-300"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="text-blue-300">{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    ))}

                    {/* Mobile Logout */}
                    <button
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-3 text-red-400 hover:text-red-300 hover:bg-red-600/20 rounded-xl transition-all duration-300"
                    >
                      <MdOutlineLogout className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
