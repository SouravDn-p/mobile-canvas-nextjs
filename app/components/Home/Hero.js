"use client";

import Image from "next/image";
import Link from "next/link";
import hero from "@/public/logos/hero1.png";
import { useEffect, useRef, useState } from "react";
import Button from "../ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  const heroRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const isSectionVisible =
          rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
        setIsVisible(isSectionVisible);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const Particles = () => {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-blue-500 opacity-20"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          ></div>
        ))}
      </div>
    );
  };

  return (
    <div
      className="relative  h-screen bg-gray-900 overflow-hidden "
      ref={heroRef}
    >
      {/* Background Banner Image with Overlays */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={hero}
          alt="Mobile devices banner"
          className="w-full h-full object-cover"
          fill
          sizes="100vw"
          priority
          quality={85}
        />
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black/80"></div>
      </div>

      {/* Animated Particles (শুধুমাত্র ক্লায়েন্ট-সাইডে রেন্ডার) */}
      {isClient && <Particles />}

      {/* Animated Background Elements */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Hero Content */}
      <div
        className={`relative z-10 flex items-center justify-center min-h-screen w-full py-16 transition-opacity duration-1000 ${
          isVisible ? "animate-fade-in-up" : "opacity-0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Tagline */}
            <div className="mb-8 inline-flex items-center px-4 py-2 rounded-full bg-blue-900/40 text-blue-200 text-sm font-medium backdrop-blur-sm border border-blue-500/20 animate-pulse">
              <span>Discover Your Next Device</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl mb-6">
              <span className="block">Explore the Future with</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 animate-gradient">
                Mobile Canvas
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 max-w-2xl mx-auto text-xl text-blue-100 leading-relaxed">
              Discover the latest smartphones, tablets, and gadgets from top
              brands with premium quality, competitive prices, and exceptional
              service.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex justify-center gap-4 flex-wrap ">
              <Button
                size="lg"
                className={`bg-gradient-to-r cursor-pointer  hover:scale-105 transition-all duration-300 text-white font-semibold `}
              >
                <Link href="/products" className="flex">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4 mt-0.5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 cursor-pointer"
              >
                <Link href="/products/phones" className="flex ">
                  Browse Phones
                  <ArrowRight className="ml-2 h-4 w-4 mt-0.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        @keyframes pulse {
          0% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.7;
          }
          100% {
            opacity: 0.4;
          }
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 8s ease infinite;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Hero;
