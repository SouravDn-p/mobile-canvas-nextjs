"use client";

import { useState, useEffect } from "react";

export default function Loading() {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Loading");

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    const textInterval = setInterval(() => {
      setLoadingText((prev) => {
        if (prev === "Loading...") return "Loading";
        return prev + ".";
      });
    }, 500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 flex items-center justify-center">
      <div className="text-center space-y-8">
        {/* Animated Logo */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl blur-xl opacity-75 animate-pulse"></div>
          <div className="relative bg-white rounded-xl p-6 shadow-2xl">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg animate-bounce"></div>
          </div>
        </div>

        {/* Brand Name */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Mobile Canvas
          </h1>
          <p className="text-indigo-300 text-lg">Tech & Beyond</p>
        </div>

        {/* Loading Animation */}
        <div className="space-y-6">
          {/* Spinner */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-700 rounded-full"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin"></div>
              <div className="absolute top-2 left-2 w-12 h-12 border-4 border-transparent border-t-purple-500 rounded-full animate-spin animation-delay-150"></div>
              <div className="absolute top-4 left-4 w-8 h-8 border-4 border-transparent border-t-pink-500 rounded-full animate-spin animation-delay-300"></div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-80 mx-auto space-y-3">
            <div className="flex justify-between text-sm text-gray-300">
              <span>{loadingText}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Loading Messages */}
          <div className="space-y-2">
            <p className="text-gray-300 text-lg">
              Preparing your experience...
            </p>
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce animation-delay-100"></div>
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce animation-delay-200"></div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 max-w-2xl mx-auto">
          {[
            { icon: "📱", title: "Latest Tech", desc: "Cutting-edge devices" },
            { icon: "🚚", title: "Fast Shipping", desc: "Quick delivery" },
            { icon: "🛡️", title: "Secure", desc: "Protected shopping" },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-4 border border-gray-700 animate-fade-in"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="text-2xl mb-2">{feature.icon}</div>
              <h3 className="text-white font-semibold text-sm">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-xs">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .animation-delay-100 {
          animation-delay: 0.1s;
        }
        .animation-delay-150 {
          animation-delay: 0.15s;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
