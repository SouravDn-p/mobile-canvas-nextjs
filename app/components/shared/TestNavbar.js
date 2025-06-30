"use client";

import Link from "next/link";
import {
  Package,
  Home,
  ShoppingCart,
  BarChart3,
  LogIn,
  UserPlus,
  Menu,
  X,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import logo from "@/public/logo.jpg";
import Image from "next/image";

export default function TestNavbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // if (status === "loading") {
  //   return <Loading />;
  // }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) => {
    return pathname === path;
  };

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/products", label: "Products", icon: ShoppingCart },
    { href: "/profile", label: "Profile", icon: User },
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
            <div className=" rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-300">
              <Image
                src={logo}
                alt="Mobile Canvas Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <span
                className={` text-xl tracking-tight transition-all duration-300  font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent
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
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    isActive(link.href)
                      ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-300 border border-blue-500/30"
                      : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link href="/login">
              <button className="flex items-center cursor-pointer space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-xl transition-all duration-300">
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </button>
            </Link>
            <Link href="/register">
              <button className="flex items-center cursor-pointer space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                <UserPlus className="h-4 w-4" />
                <span>Register</span>
              </button>
            </Link>
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
          <div className="md:hidden border-t border-gray-700/50 mt-2">
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
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
