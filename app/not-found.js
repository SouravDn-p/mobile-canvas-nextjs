import React from "react";
import Image from "@/public/logos/hero1.png";
const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: Image,
        }}
      >
        <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm"></div>
      </div>

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
              The page you&apos;re looking for seems to have vanished into the
              digital void. Don&apos;t worry, even the best explorers sometimes
              take a wrong turn.
            </p>
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
              left: "42.3%",
              top: "67.8%",
              animationDelay: "1.2s",
              animationDuration: "3.5s",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default NotFoundPage;
