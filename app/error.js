"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Error({ error, reset }) {
  const [errorDetails, setErrorDetails] = useState({
    message: "Something went wrong!",
    code: "UNKNOWN_ERROR",
    timestamp: new Date().toISOString(),
  });

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application Error:", error);

    // Parse error details
    if (error) {
      setErrorDetails({
        message: error.message || "An unexpected error occurred",
        code: error.code || "UNKNOWN_ERROR",
        timestamp: new Date().toISOString(),
      });
    }
  }, [error]);

  const handleReportError = () => {
    // Implement error reporting logic
    console.log("Reporting error:", errorDetails);
    alert("Error report sent! Thank you for helping us improve.");
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 flex items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-2xl mx-auto">
        {/* Error Icon Animation */}
        <div className="relative">
          <div className="text-8xl md:text-9xl animate-bounce">⚠️</div>
          <div className="absolute inset-0 text-8xl md:text-9xl opacity-20 animate-pulse">
            💥
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Oops! Something Went Wrong
          </h1>
          <p className="text-xl text-gray-300 max-w-lg mx-auto">
            We encountered an unexpected error. Don't worry, our team has been
            notified and we're working on a fix.
          </p>
        </div>

        {/* Error Details */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700 text-left max-w-lg mx-auto">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            Error Details
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Message:</span>
              <span className="text-white font-mono">
                {errorDetails.message}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Code:</span>
              <span className="text-red-400 font-mono">
                {errorDetails.code}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Time:</span>
              <span className="text-gray-300 font-mono">
                {new Date(errorDetails.timestamp).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            🔄 Try Again
          </button>
          <button
            onClick={handleRefresh}
            className="bg-white/10 backdrop-blur-xl text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 transform hover:scale-105 shadow-lg border border-white/20"
          >
            🔃 Refresh Page
          </button>
          <Link
            href="/"
            className="bg-gray-800/50 backdrop-blur-xl text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105 shadow-lg border border-gray-600 inline-block text-center"
          >
            🏠 Go Home
          </Link>
        </div>

        {/* Help Section */}
        <div className="bg-gray-900/30 backdrop-blur-xl rounded-2xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Need Help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <button
              onClick={handleReportError}
              className="flex flex-col items-center p-4 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition-colors border border-gray-600 hover:border-red-500"
            >
              <span className="text-2xl mb-2">📧</span>
              <span className="text-white font-semibold">Report Error</span>
              <span className="text-gray-400 text-sm">
                Send error details to our team
              </span>
            </button>
            <Link
              href="/support"
              className="flex flex-col items-center p-4 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition-colors border border-gray-600 hover:border-blue-500"
            >
              <span className="text-2xl mb-2">💬</span>
              <span className="text-white font-semibold">Contact Support</span>
              <span className="text-gray-400 text-sm">
                Get help from our team
              </span>
            </Link>
            <Link
              href="/status"
              className="flex flex-col items-center p-4 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition-colors border border-gray-600 hover:border-green-500"
            >
              <span className="text-2xl mb-2">📊</span>
              <span className="text-white font-semibold">System Status</span>
              <span className="text-gray-400 text-sm">
                Check service availability
              </span>
            </Link>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-blue-500/10 backdrop-blur-xl rounded-xl p-4 border border-blue-500/30 max-w-lg mx-auto">
          <h4 className="text-blue-300 font-semibold mb-2">💡 Quick Tips</h4>
          <ul className="text-blue-200 text-sm space-y-1 text-left">
            <li>• Try refreshing the page</li>
            <li>• Check your internet connection</li>
            <li>• Clear your browser cache</li>
            <li>• Try again in a few minutes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
