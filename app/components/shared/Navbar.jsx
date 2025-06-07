"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/public/logo.jpg";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItemsCount, setCartItemsCount] = useState(3);
  const [wishlistCount, setWishlistCount] = useState(2);
  const [notificationCount, setNotificationCount] = useState(2);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCategoryClick = (category) => {
    router.push(`/products/${category}`);
    setIsMenuOpen(false);
  };

  const cartItems = [
    {
      id: 1,
      name: "iPhone 15 Pro",
      price: 999,
      image: "/placeholder.svg?height=50&width=50",
    },
    {
      id: 2,
      name: "MacBook Air",
      price: 1299,
      image: "/placeholder.svg?height=50&width=50",
    },
    {
      id: 3,
      name: "AirPods Pro",
      price: 249,
      image: "/placeholder.svg?height=50&width=50",
    },
  ];

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <nav
      className={`sticky top-0 z-50  transition-all duration-500 ${
        scrolled
          ? "bg-white/10 backdrop-blur-2xl border-b border-white/20 shadow-2xl shadow-black/10"
          : "bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl blur-sm opacity-75 group-hover:opacity-100 group-hover:blur-md transition-all duration-300 animate-pulse"></div>
              <div className="relative bg-white rounded-xl shadow-lg">
                <Image
                  src={logo}
                  alt="Mobile Canvas Logo"
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span
                className={`font-bold text-xl tracking-tight transition-all duration-300 ${
                  scrolled ? "text-white drop-shadow-lg" : "text-white"
                }`}
              >
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
          <div className="hidden lg:flex lg:items-center lg:space-x-1">
            <Link
              href="/product"
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${
                scrolled
                  ? "text-white hover:bg-white/20 hover:shadow-lg hover:backdrop-blur-xl"
                  : "text-white hover:bg-white/20 hover:shadow-lg"
              }`}
            >
              All Products
            </Link>

            <Link
              href="/about"
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 relative ${
                scrolled
                  ? "text-white hover:bg-white/20 hover:shadow-lg hover:backdrop-blur-xl"
                  : "text-white hover:bg-white/20 hover:shadow-lg"
              }`}
            >
              About Us
            </Link>
            <Link
              href="/deals"
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 relative ${
                scrolled
                  ? "text-white hover:bg-white/20 hover:shadow-lg hover:backdrop-blur-xl"
                  : "text-white hover:bg-white/20 hover:shadow-lg"
              }`}
            >
              Hot Deals
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full animate-bounce">
                New
              </span>
            </Link>

            <Link
              href="/support"
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${
                scrolled
                  ? "text-white hover:bg-white/20 hover:shadow-lg hover:backdrop-blur-xl"
                  : "text-white hover:bg-white/20 hover:shadow-lg"
              }`}
            >
              Support
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Notifications */}
            <button
              className={`hidden sm:flex p-2 rounded-xl relative transition-all duration-300 hover:scale-110 ${
                scrolled
                  ? "text-white hover:bg-white/20 hover:shadow-lg hover:backdrop-blur-xl"
                  : "text-white hover:bg-white/20"
              }`}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-5 5v-5zM10.07 2.82l3.93 3.93-3.93 3.93-3.93-3.93 3.93-3.93z"
                />
              </svg>
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                  {notificationCount}
                </span>
              )}
            </button>

            {/* Wishlist */}
            <button
              className={`hidden sm:flex p-2 rounded-xl relative transition-all duration-300 hover:scale-110 ${
                scrolled
                  ? "text-white hover:bg-white/20 hover:shadow-lg hover:backdrop-blur-xl"
                  : "text-white hover:bg-white/20"
              }`}
              onClick={() => router.push("/wishlist")}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <div className="relative">
              <button
                className={`p-2 rounded-xl relative transition-all duration-300 hover:scale-110 ${
                  scrolled
                    ? "text-white hover:bg-white/20 hover:shadow-lg hover:backdrop-blur-xl"
                    : "text-white hover:bg-white/20"
                }`}
                onClick={() => setIsCartOpen(!isCartOpen)}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l-2.5 5m0 0h14M7 13h10"
                  />
                </svg>
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              {/* Cart Dropdown */}
              {isCartOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-lg text-gray-800">
                        Shopping Cart
                      </h3>
                      <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm px-3 py-1 rounded-full">
                        {cartItemsCount} items
                      </span>
                    </div>
                    <div className="space-y-4 max-h-64 overflow-y-auto">
                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            width={50}
                            height={50}
                            className="rounded-lg shadow-md"
                          />
                          <div className="flex-1">
                            <div className="font-semibold text-gray-800">
                              {item.name}
                            </div>
                            <div className="text-indigo-600 font-bold">
                              ${item.price}
                            </div>
                          </div>
                          <button className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-colors">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-gray-200 mt-4 pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-bold text-lg text-gray-800">
                          Total: ${totalPrice.toLocaleString()}
                        </span>
                      </div>
                      <button
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                        onClick={() => {
                          router.push("/cart");
                          setIsCartOpen(false);
                        }}
                      >
                        View Cart & Checkout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                  scrolled
                    ? "text-white hover:bg-white/20 hover:shadow-lg hover:backdrop-blur-xl"
                    : "text-white hover:bg-white/20"
                }`}
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50">
                  <div className="p-2">
                    {isAuthenticated ? (
                      <>
                        <button
                          className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center space-x-3"
                          onClick={() => {
                            router.push("/profile");
                            setIsUserMenuOpen(false);
                          }}
                        >
                          <svg
                            className="w-4 h-4 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          <span className="font-medium text-gray-700">
                            My Profile
                          </span>
                        </button>
                        <button
                          className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center space-x-3"
                          onClick={() => {
                            router.push("/orders");
                            setIsUserMenuOpen(false);
                          }}
                        >
                          <svg
                            className="w-4 h-4 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                          </svg>
                          <span className="font-medium text-gray-700">
                            My Orders
                          </span>
                        </button>

                        <button
                          className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-50 transition-colors flex items-center space-x-3 text-red-600"
                          onClick={() => {
                            setIsAuthenticated(false);
                            setIsUserMenuOpen(false);
                          }}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          <span className="font-medium">Logout</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center space-x-3"
                          onClick={() => {
                            router.push("/login");
                            setIsUserMenuOpen(false);
                          }}
                        >
                          <svg
                            className="w-4 h-4 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                            />
                          </svg>
                          <span className="font-medium text-gray-700">
                            Sign In
                          </span>
                        </button>
                        <button
                          className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center space-x-3"
                          onClick={() => {
                            router.push("/register");
                            setIsUserMenuOpen(false);
                          }}
                        >
                          <svg
                            className="w-4 h-4 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                            />
                          </svg>
                          <span className="font-medium text-gray-700">
                            Sign Up
                          </span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className={`lg:hidden p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                scrolled
                  ? "text-white hover:bg-white/20 hover:shadow-lg hover:backdrop-blur-xl"
                  : "text-white hover:bg-white/20"
              }`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={
                    isMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-white/20">
          <div className="px-4 py-6 space-y-2 bg-black/20 backdrop-blur-xl">
            <Link
              href="/product"
              className="block px-4 py-3 rounded-xl text-white hover:bg-white/20 transition-all duration-300 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              All Products
            </Link>
            <Link
              href="/about"
              className="flex items-center justify-between px-4 py-3 rounded-xl text-white hover:bg-white/20 transition-all duration-300 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              <span>About Us</span>
            </Link>
            <Link
              href="/deals"
              className="flex items-center justify-between px-4 py-3 rounded-xl text-white hover:bg-white/20 transition-all duration-300 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              <span>Hot Deals</span>
              <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full">
                New
              </span>
            </Link>

            <Link
              href="/support"
              className="block px-4 py-3 rounded-xl text-white hover:bg-white/20 transition-all duration-300 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Support
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
