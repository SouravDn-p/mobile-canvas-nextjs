"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import {
  Home,
  BarChart3,
  ShoppingCart,
  User,
  LogIn,
  UserPlus,
  Menu,
  X,
  ChevronDown,
  Settings,
  CreditCard,
  LogOut,
  Heart,
  Package,
  Search,
  Trash2,
  Plus,
  Minus,
} from "lucide-react";

export default function EcommerceNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen || isCartOpen) {
        setIsUserMenuOpen(false);
        setIsCartOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isUserMenuOpen, isCartOpen]);

  const isActive = (path) => {
    return pathname === path;
  };

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/products", label: "Products", icon: Package },
    { href: "/categories", label: "Categories", icon: BarChart3 },
    { href: "/deals", label: "Deals", icon: Heart },
  ];

  const userMenuItems = [
    { href: "/profile", label: "My Profile", icon: User },
    { href: "/orders", label: "My Orders", icon: Package },
    { href: "/wishlist", label: "Wishlist", icon: Heart },
    { href: "/wallet", label: "Wallet", icon: CreditCard },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/95 backdrop-blur-xl shadow-2xl shadow-purple-500/10 border-b border-gray-800/50"
          : "bg-gradient-to-r from-black via-gray-900 to-black backdrop-blur-sm border-b border-gray-800/30"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-3 hover:opacity-90 transition-all duration-300 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-gradient-to-r from-purple-600 to-cyan-600 p-1 rounded-xl">
                <div className="bg-black rounded-lg p-1">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-md flex items-center justify-center">
                    <span className="text-black font-bold text-sm">EC</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                E-Commerce
              </span>
              <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                Shop Smart
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 group ${
                    isActive(link.href)
                      ? "text-white"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {isActive(link.href) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-xl border border-purple-500/30" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-cyan-600/0 group-hover:from-purple-600/10 group-hover:to-cyan-600/10 rounded-xl transition-all duration-300" />
                  <Icon className="h-4 w-4 relative z-10" />
                  <span className="font-medium relative z-10">
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsCartOpen(!isCartOpen);
              }}
              className="relative flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-xl transition-all duration-300 group"
            >
              <div className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="font-medium">Cart</span>
            </button>

            {!session?.user ? (
              <>
                <Link href="/login">
                  <button className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-xl transition-all duration-300 group">
                    <LogIn className="h-4 w-4" />
                    <span>Login</span>
                  </button>
                </Link>
                <Link href="/register">
                  <button className="relative flex items-center space-x-2 px-6 py-2 rounded-xl transition-all duration-300 group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 transition-all duration-300 group-hover:from-purple-500 group-hover:to-cyan-500" />
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/80 to-cyan-600/80 blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                    <UserPlus className="h-4 w-4 relative z-10" />
                    <span className="font-medium relative z-10">Register</span>
                  </button>
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  className="flex items-center space-x-3 p-1 rounded-xl transition-all duration-300 hover:bg-gray-800/50 group"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsUserMenuOpen(!isUserMenuOpen);
                  }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
                    <Image
                      src={
                        session.user.image ||
                        "/placeholder.svg?height=40&width=40"
                      }
                      alt="Profile"
                      width={40}
                      height={40}
                      className="relative w-10 h-10 rounded-full border-2 border-gray-700 group-hover:border-purple-400 transition-all duration-300"
                    />
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-white font-medium text-sm">
                      {session.user.name || "User"}
                    </p>
                    <p className="text-gray-400 text-xs truncate max-w-32">
                      {session.user.email}
                    </p>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${
                      isUserMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Cart */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsCartOpen(!isCartOpen);
              }}
              className="relative p-2 text-gray-300 hover:text-white rounded-lg hover:bg-gray-800/50 transition-all duration-300"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white focus:outline-none p-2 rounded-lg hover:bg-gray-800/50 transition-all duration-300"
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
          <div className="md:hidden border-t border-gray-800/50 mt-2 animate-in slide-in-from-top-2 duration-200">
            <div className="px-2 pt-2 pb-4 space-y-2 bg-black/50 backdrop-blur-sm rounded-b-2xl">
              {/* Mobile Search */}
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                />
              </div>

              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive(link.href)
                        ? "bg-gradient-to-r from-purple-600/20 to-cyan-600/20 text-white border border-purple-500/30"
                        : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                );
              })}

              <div className="border-t border-gray-800/50 pt-4 mt-4">
                {!session?.user ? (
                  <div className="space-y-2">
                    <Link
                      href="/login"
                      className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-xl transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LogIn className="h-5 w-5" />
                      <span>Login</span>
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:from-purple-500 hover:to-cyan-500 rounded-xl transition-all duration-300 shadow-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <UserPlus className="h-5 w-5" />
                      <span>Register</span>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-purple-600/10 to-cyan-600/10 rounded-xl border border-gray-800/50">
                      <Image
                        src={
                          session.user.image ||
                          "/placeholder.svg?height=32&width=32"
                        }
                        alt="Profile"
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full border border-purple-500/50"
                      />
                      <div>
                        <p className="text-white font-medium text-sm">
                          {session.user.name || "User"}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {session.user.email}
                        </p>
                      </div>
                    </div>

                    {userMenuItems.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={index}
                          href={item.href}
                          className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-cyan-600/20 rounded-xl transition-all duration-300"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}

                    <button
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-600/20 rounded-xl transition-all duration-300"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Dropdown Menu */}
      {isUserMenuOpen && session?.user && (
        <div className="absolute right-4 top-16 mt-2 w-64 rounded-2xl overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
          <div className="bg-black/95 backdrop-blur-xl border border-gray-800/50 shadow-2xl shadow-purple-500/10">
            {/* User Info Header */}
            <div className="p-4 border-b border-gray-800/50 bg-gradient-to-r from-purple-600/10 to-cyan-600/10">
              <div className="flex items-center space-x-3">
                <Image
                  src={
                    session.user.image || "/placeholder.svg?height=40&width=40"
                  }
                  alt="Profile"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full border-2 border-purple-500/50"
                />
                <div>
                  <p className="text-white font-semibold text-sm">
                    {session.user.name || "User"}
                  </p>
                  <p className="text-gray-400 text-xs truncate">
                    {session.user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              {userMenuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={index}
                    href={item.href}
                    className="flex items-center space-x-3 px-3 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-cyan-600/20 transition-all duration-300 group"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4 group-hover:text-purple-400 transition-colors duration-300" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Logout Section */}
            <div className="p-2 border-t border-gray-800/50">
              <button
                onClick={() => {
                  signOut();
                  setIsUserMenuOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-600/20 transition-all duration-300 group"
              >
                <LogOut className="h-4 w-4" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Dropdown */}
      {isCartOpen && (
        <div className="absolute right-4 top-16 mt-2 w-96 rounded-2xl overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
          <div className="bg-black/95 backdrop-blur-xl border border-gray-800/50 shadow-2xl shadow-purple-500/10">
            {/* Cart Header */}
            <div className="p-4 border-b border-gray-800/50 bg-gradient-to-r from-purple-600/10 to-cyan-600/10">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold text-lg">
                  Shopping Cart
                </h3>
                <span className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-sm px-2 py-1 rounded-full">
                  {cartCount} items
                </span>
              </div>
            </div>

            {/* Cart Items */}
            <div className="max-h-96 overflow-y-auto">
              {cartItems.length === 0 ? (
                <div className="p-8 text-center">
                  <ShoppingCart className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Your cart is empty</p>
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-xl"
                    >
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={60}
                        height={60}
                        className="w-15 h-15 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="text-white font-medium text-sm">
                          {item.name}
                        </h4>
                        <p className="text-purple-400 font-semibold">
                          ${item.price}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors duration-200"
                          >
                            <Minus className="h-3 w-3 text-white" />
                          </button>
                          <span className="text-white text-sm w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors duration-200"
                          >
                            <Plus className="h-3 w-3 text-white" />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-400 hover:text-red-300 p-1 rounded-lg hover:bg-red-600/20 transition-all duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cartItems.length > 0 && (
              <div className="p-4 border-t border-gray-800/50 bg-gradient-to-r from-purple-600/5 to-cyan-600/5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white font-semibold">Total:</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    ${cartTotal.toLocaleString()}
                  </span>
                </div>
                <div className="space-y-2">
                  <Link href="/cart">
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-all duration-300"
                    >
                      View Cart
                    </button>
                  </Link>
                  <Link href="/checkout">
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white rounded-xl transition-all duration-300 font-semibold"
                    >
                      Checkout
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
