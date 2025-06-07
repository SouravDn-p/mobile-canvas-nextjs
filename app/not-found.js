"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setIsRedirecting(true);
          setTimeout(() => router.push("/"), 1000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleStopRedirect = () => {
    setCountdown(0);
    setIsRedirecting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 flex items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-2xl mx-auto">
        {/* 404 Animation */}
        <div className="relative">
          <div className="text-9xl md:text-[12rem] font-bold text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text animate-pulse">
            404
          </div>
          <div className="absolute inset-0 text-9xl md:text-[12rem] font-bold text-white/5 animate-bounce">
            404
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Oops! Page Not Found
          </h1>
          <p className="text-xl text-gray-300 max-w-lg mx-auto">
            The page you're looking for seems to have vanished into the digital
            void. Don't worry, it happens to the best of us!
          </p>
        </div>

        {/* Animated Icons */}
        <div className="flex justify-center space-x-4 my-8">
          <div className="text-4xl animate-bounce">🔍</div>
          <div className="text-4xl animate-bounce animation-delay-100">❓</div>
          <div className="text-4xl animate-bounce animation-delay-200">😅</div>
        </div>

        {/* Search Suggestions */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700 space-y-4">
          <h2 className="text-2xl font-bold text-white">What can you do?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm">1</span>
              </div>
              <div>
                <h3 className="text-white font-semibold">Check the URL</h3>
                <p className="text-gray-400 text-sm">
                  Make sure the web address is spelled correctly
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm">2</span>
              </div>
              <div>
                <h3 className="text-white font-semibold">Go back</h3>
                <p className="text-gray-400 text-sm">
                  Return to the previous page you were on
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm">3</span>
              </div>
              <div>
                <h3 className="text-white font-semibold">Search products</h3>
                <p className="text-gray-400 text-sm">
                  Use our search to find what you need
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-indigo-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm">4</span>
              </div>
              <div>
                <h3 className="text-white font-semibold">Contact support</h3>
                <p className="text-gray-400 text-sm">
                  Get help from our customer service team
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            🏠 Back to Home
          </Link>
          <Link
            href="/products"
            className="bg-white/10 backdrop-blur-xl text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 transform hover:scale-105 shadow-lg border border-white/20"
          >
            🛍️ Browse Products
          </Link>
          <button
            onClick={() => router.back()}
            className="bg-gray-800/50 backdrop-blur-xl text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105 shadow-lg border border-gray-600"
          >
            ← Go Back
          </button>
        </div>

        {/* Auto Redirect */}
        {countdown > 0 && !isRedirecting && (
          <div className="bg-yellow-500/10 backdrop-blur-xl rounded-xl p-4 border border-yellow-500/30">
            <p className="text-yellow-300">
              Automatically redirecting to home page in{" "}
              <span className="font-bold text-yellow-400">{countdown}</span>{" "}
              seconds
            </p>
            <button
              onClick={handleStopRedirect}
              className="mt-2 text-yellow-400 hover:text-yellow-300 underline text-sm"
            >
              Cancel redirect
            </button>
          </div>
        )}

        {isRedirecting && (
          <div className="bg-green-500/10 backdrop-blur-xl rounded-xl p-4 border border-green-500/30">
            <p className="text-green-300">Redirecting to home page...</p>
          </div>
        )}

        {/* Popular Categories */}
        <div className="bg-gray-900/30 backdrop-blur-xl rounded-2xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">
            Popular Categories
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              {
                name: "Smartphones",
                icon: "📱",
                href: "/products?category=phones",
              },
              {
                name: "Tablets",
                icon: "📟",
                href: "/products?category=tablets",
              },
              {
                name: "Laptops",
                icon: "💻",
                href: "/products?category=laptops",
              },
              {
                name: "Accessories",
                icon: "🎧",
                href: "/products?category=accessories",
              },
              {
                name: "Wearables",
                icon: "⌚",
                href: "/products?category=wearables",
              },
            ].map((category, index) => (
              <Link
                key={index}
                href={category.href}
                className="flex flex-col items-center p-3 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105 border border-gray-600 hover:border-indigo-500"
              >
                <span className="text-2xl mb-1">{category.icon}</span>
                <span className="text-white text-sm font-medium text-center">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .animation-delay-100 {
          animation-delay: 0.1s;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  );
}
