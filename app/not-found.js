"use client";
import React from "react";
import { Home, ArrowLeft, Search } from "lucide-react";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/1089438/pexels-photo-1089438.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')`,
        }}
      >
        <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm"></div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-2xl mx-auto">
          {/* 404 Number */}
          <div className="mb-8">
            <h1 className="text-9xl md:text-[12rem] font-black text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text leading-none">
              404
            </h1>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-indigo-400/20 blur-xl"></div>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Oops! Page Not Found
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed max-w-lg mx-auto">
              The page you&aposre looking for seems to have vanished into the
              digital void. Don&apost worry, even the best explorers sometimes
              take a wrong turn.
            </p>
          </div>

          {/* Search Suggestion */}
          <div className="mb-12 p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 max-w-md mx-auto">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Search className="h-6 w-6 text-blue-400" />
              <span className="text-gray-300 font-medium">
                Quick Suggestions
              </span>
            </div>
            <div className="space-y-2 text-sm text-gray-400">
              <p>• Check the URL for typos</p>
              <p>• Return to the homepage</p>
              <p>• Use the navigation menu</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href={"http://localhost:3000/"}>
              <button className="group bg-gradient-to-r cursor-pointer from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 flex items-center space-x-3">
                <Home className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                <span>Back to Home</span>
              </button>
            </Link>

            <button
              onClick={() => window.history.back()}
              className="group cursor-pointer bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 border border-white/20 hover:border-white/30 flex items-center space-x-3"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
              <span>Go Back</span>
            </button>
          </div>

          {/* Decorative Elements */}
          <div className="mt-16 flex justify-center space-x-8 opacity-30">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default NotFoundPage;
