"use client";

import {
  Package,
  Zap,
  Star,
  TrendingUp,
  ShoppingBag,
  BarChart3,
} from "lucide-react";
import { BiMobile } from "react-icons/bi";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br p-12 from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 ">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 animate-bounce delay-100 px-16">
          <Package className="h-8 w-8 text-blue-400/30" />
        </div>
        <div className="absolute top-32 right-32 animate-bounce delay-300">
          <Zap className="h-12 w-12 text-yellow-400/30" />
        </div>
        <div className="absolute bottom-32 left-32 animate-bounce delay-500">
          <Star className="h-7 w-7 text-purple-400/30" />
        </div>
        <div className="absolute bottom-20 right-20 animate-bounce delay-700">
          <TrendingUp className="h-8 w-8 text-green-400/30" />
        </div>
        <div className="absolute top-1/2 left-10 animate-bounce delay-200">
          <ShoppingBag className="h-6 w-6 text-pink-400/30" />
        </div>
        <div className="absolute top-1/2 right-10 animate-bounce delay-600">
          <BarChart3 className="h-7 w-7 text-orange-400/30" />
        </div>
      </div>

      {/* Main Loading Content */}
      <div className="relative z-10 text-center">
        {/* Logo with Pulse Animation */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-xl opacity-50 animate-pulse"></div>
          <div className="relative p-6 rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 shadow-2xl transform hover:scale-105 transition-transform duration-300">
            <BiMobile
              className="h-16 w-16 text-white animate-spin "
              style={{ animationDuration: "3s" }}
            />
          </div>
        </div>

        {/* Loading Text with Gradient */}
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
          Mobile Canvas
        </h1>

        <p className="text-xl text-gray-300 mb-8 animate-fade-in">
          Loading your products...
        </p>

        {/* Animated Progress Bars */}
        <div className="w-80 mx-auto space-y-4">
          {/* Main Progress Bar */}
          <div className="relative">
            <div className="h-3 bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-loading-bar shadow-lg"></div>
            </div>
            <div className="absolute inset-0 h-3 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full animate-shimmer"></div>
          </div>

          {/* Secondary Progress Indicators */}
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce delay-100"></div>
            <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce delay-200"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce delay-300"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce delay-400"></div>
          </div>
        </div>

        {/* Loading Steps */}
        <div className="mt-12 space-y-3">
          <div className="flex items-center justify-center space-x-3 text-gray-400 animate-fade-in-up">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm">Connecting to database...</span>
          </div>
          <div className="flex items-center justify-center space-x-3 text-gray-400 animate-fade-in-up delay-500">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm">Fetching product data...</span>
          </div>
          <div className="flex items-center justify-center space-x-3 text-gray-400 animate-fade-in-up delay-1000">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span className="text-sm">Preparing interface...</span>
          </div>
        </div>

        {/* Spinning Ring Loader */}
        <div className="mt-12 flex justify-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-700 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
            <div
              className="absolute top-2 left-2 w-12 h-12 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"
              style={{
                animationDirection: "reverse",
                animationDuration: "1.5s",
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Custom CSS Animations */}
      <style jsx>{`
        @keyframes loading-bar {
          0% {
            width: 0%;
          }
          50% {
            width: 70%;
          }
          100% {
            width: 100%;
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-loading-bar {
          animation: loading-bar 3s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-in-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }

        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-300 {
          animation-delay: 0.3s;
        }
        .delay-400 {
          animation-delay: 0.4s;
        }
        .delay-500 {
          animation-delay: 0.5s;
        }
        .delay-600 {
          animation-delay: 0.6s;
        }
        .delay-700 {
          animation-delay: 0.7s;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}
