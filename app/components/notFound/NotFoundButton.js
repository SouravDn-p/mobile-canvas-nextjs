"use client"

import Home from "@/app/page";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function NotFoundButton() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <Link href="/">
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
  );
}
