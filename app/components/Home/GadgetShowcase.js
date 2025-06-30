"use client";

import React, { useState, useEffect } from "react";
import Button from "../ui/button";
import Badge from "../ui/button";
import Link from "next/link";
import {
  ArrowRight,
  Smartphone,
  Tablet,
  Laptop,
  Headphones,
  Watch,
  Camera,
} from "lucide-react";
import Image from "next/image";

const showcaseProducts = [
  {
    id: "1",
    name: "iPhone 15 Pro",
    category: "Smartphone",
    price: 999,
    image: "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg",
    icon: Smartphone,
    color: "from-blue-500 to-purple-600",
    description: "Revolutionary A17 Pro chip",
    features: ["Titanium Design", "48MP Camera", "Action Button"],
  },
  {
    id: "2",
    name: "iPad Pro",
    category: "Tablet",
    price: 799,
    image: "https://images.pexels.com/photos/1334598/pexels-photo-1334598.jpeg",
    icon: Tablet,
    color: "from-green-500 to-emerald-600",
    description: "M2 chip performance",
    features: ["Liquid Retina", "Apple Pencil", "Magic Keyboard"],
  },
  {
    id: "3",
    name: "MacBook Pro",
    category: "Laptop",
    price: 1999,
    image: "https://images.pexels.com/photos/18105/pexels-photo.jpg",
    icon: Laptop,
    color: "from-purple-500 to-pink-600",
    description: "M3 Pro unleashed",
    features: ["16-inch Display", "22-hour Battery", "Studio Quality"],
  },
  {
    id: "4",
    name: "AirPods Pro",
    category: "Audio",
    price: 249,
    image: "https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg",
    icon: Headphones,
    color: "from-orange-500 to-red-600",
    description: "Adaptive Audio magic",
    features: ["Noise Cancelling", "Spatial Audio", "USB-C"],
  },
  {
    id: "5",
    name: "Apple Watch",
    category: "Wearable",
    price: 399,
    image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg",
    icon: Watch,
    color: "from-teal-500 to-cyan-600",
    description: "Health at your wrist",
    features: ["ECG Monitor", "Fitness Tracking", "Always-On Display"],
  },
  {
    id: "6",
    name: "Sony Camera",
    category: "Camera",
    price: 1299,
    image: "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg",
    icon: Camera,
    color: "from-indigo-500 to-blue-600",
    description: "Professional imaging",
    features: ["4K Video", "Image Stabilization", "Pro Lens"],
  },
];

export default function GadgetShowcase() {
  const [activeProduct, setActiveProduct] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  useEffect(() => {
    if (!isAutoRotating) return;

    const interval = setInterval(() => {
      setActiveProduct((prev) => (prev + 1) % showcaseProducts.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoRotating]);

  const handleProductSelect = (index) => {
    setActiveProduct(index);
    setIsAutoRotating(false);
    setTimeout(() => setIsAutoRotating(true), 10000);
  };

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,255,136,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,0,128,0.1),transparent_50%)]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-green-400 to-emerald-500 bg-clip-text text-transparent mb-6">
            Experience Innovation
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Discover our premium collection of cutting-edge gadgets with
            immersive 3D showcase
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="relative h-96 flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full border-2 border-gradient-to-r from-green-500/30 to-emerald-400/30 animate-spin"
                style={{ animationDuration: "20s" }}
              ></div>
              <div
                className="absolute inset-4 rounded-full border border-white/10 animate-spin"
                style={{
                  animationDuration: "15s",
                  animationDirection: "reverse",
                }}
              ></div>

              <div className="absolute inset-0">
                {showcaseProducts.map((product, index) => {
                  const angle = (index * 360) / showcaseProducts.length;
                  const isActive = index === activeProduct;

                  return (
                    <div
                      key={product.id}
                      className="absolute w-16 h-16 cursor-pointer transition-all duration-500"
                      style={{
                        transform: `rotate(${angle}deg) translateX(140px) rotate(-${angle}deg)`,
                        left: "50%",
                        top: "50%",
                        marginLeft: "-32px",
                        marginTop: "-32px",
                      }}
                      onClick={() => handleProductSelect(index)}
                    >
                      <div
                        className={`w-full h-full rounded-full flex items-center justify-center transition-all duration-500 ${
                          isActive
                            ? `bg-gradient-to-r ${product.color} scale-125 shadow-2xl`
                            : "bg-white/10 hover:bg-white/20 scale-100"
                        }`}
                      >
                        <product.icon
                          className={`h-6 w-6 transition-colors duration-500 ${
                            isActive ? "text-white" : "text-gray-400"
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="relative w-48 h-48 rounded-full overflow-hidden glass border-2 border-white/20 group">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900"></div>
                <Image
                  width={500}
                  height={500}
                  src={showcaseProducts[activeProduct].image}
                  alt={showcaseProducts[activeProduct].name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full animate-pulse"></div>
                <div
                  className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full animate-pulse"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>

              <div
                className={`absolute inset-0 rounded-full bg-gradient-to-r ${showcaseProducts[activeProduct].color} opacity-20 blur-3xl animate-pulse`}
              ></div>
            </div>

            <div className="flex justify-center mt-8 space-x-2">
              {showcaseProducts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleProductSelect(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeProduct
                      ? "bg-gradient-to-r from-green-500 to-emerald-400 scale-125"
                      : "bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <Badge
                className={`bg-gradient-to-r ${showcaseProducts[activeProduct].color} text-white font-semibold`}
              >
                {showcaseProducts[activeProduct].category}
              </Badge>

              <h3 className="text-4xl font-bold text-white">
                {showcaseProducts[activeProduct].name}
              </h3>

              <p className="text-xl text-gray-400">
                {showcaseProducts[activeProduct].description}
              </p>

              <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                ${showcaseProducts[activeProduct].price}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-white">Key Features</h4>
              <div className="grid grid-cols-1 gap-2">
                {showcaseProducts[activeProduct].features.map(
                  (feature, index) => (
                    <div
                      key={feature}
                      className="flex items-center space-x-3 opacity-0 animate-fadeInUp"
                      style={{
                        animationDelay: `${index * 0.1}s`,
                        animationFillMode: "forwards",
                      }}
                    >
                      <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"></div>
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="flex  sm:flex-row gap-4">
              <Button
                className={`bg-gradient-to-r  cursor-pointer ${showcaseProducts[activeProduct].color} hover:scale-105 transition-all duration-300 text-white font-semibold`}
              >
                <Link href="/products" className="w-32 flex items-center">
                  Explore Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 sizes:md cursor-pointer"
              >
                View Details
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">4.9</div>
                <div className="text-sm text-gray-400">Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">50K+</div>
                <div className="text-sm text-gray-400">Sold</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">2Y</div>
                <div className="text-sm text-gray-400">Warranty</div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-20">
          <div className="glass rounded-2xl p-8 max-w-2xl mx-auto border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Experience the Future?
            </h3>
            <p className="text-gray-400 mb-6">
              Join thousands of satisfied customers who&aops;ve upgraded their
              tech lifestyle
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 text-black font-semibold cursor-pointer"
            >
              <Link href="/products" className="flex ">
                Shop All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <style jsx>{`
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

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
    </section>
  );
}
