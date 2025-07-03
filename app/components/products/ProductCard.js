"use client";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Eye, Heart } from "lucide-react";
import Button from "../ui/button";

export default function ProductCard({ product }) {
  const {
    id,
    _id,
    name,
    price,
    originalPrice,
    image,
    rating,
    reviews,
    category,
    isNew,
    isOnSale,
  } = product;

  const discountPercentage = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <div className="relative group overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.02]">
      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl"></div>

      <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden group-hover:border-purple-500/30 transition-all duration-300">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            width={400}
            height={400}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {isNew && (
              <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-400 text-black text-xs font-bold rounded-full">
                NEW
              </span>
            )}
            {isOnSale && (
              <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full">
                SALE {discountPercentage}% OFF
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button className="absolute top-4 cursor-pointer right-4 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-purple-500/50 transition-all duration-300 opacity-0 group-hover:opacity-100">
            <Heart className="h-4 w-4" />
          </button>

          {/* Quick Actions - Visible on Hover */}
          <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
            <Link href={`/products/${_id}`} className="flex-1">
              <Button
                size="sm"
                className="w-full cursor-pointer bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-purple-300 border border-purple-500/30 hover:from-purple-500/30 hover:to-cyan-500/30 backdrop-blur-sm"
              >
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
            </Link>
            <Button
              size="sm"
              className="bg-gradient-to-r cursor-pointer from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/30 hover:from-green-500/30 hover:to-emerald-500/30 backdrop-blur-sm"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-6">
          {/* Category */}
          <div className="mb-2">
            <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">
              {category}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-lg text-white group-hover:text-purple-300 transition-colors duration-300 mb-2 line-clamp-2 h-12">
            {name}
          </h3>

          {/* Rating */}
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-600"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-400">
              {rating} ({reviews?.toLocaleString()})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              ${price?.toLocaleString()}
            </span>
            {originalPrice && (
              <span className="text-lg text-gray-500 line-through">
                ${originalPrice?.toLocaleString()}
              </span>
            )}
          </div>

          {/* Action Buttons - Always Visible */}
          <div className="flex flex-col gap-2">
            <Link href={`/products/${_id}`} className="flex-1">
              <Button
                variant="outline"
                size="sm"
                className="w-full cursor-pointer border-gray-600/50 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-purple-500/50 bg-transparent"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </Link>
            <Button
              size="sm"
              className="bg-gradient-to-r cursor-pointer from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>

        {/* Shimmer Effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-1000 ease-out pointer-events-none"></div>
      </div>
    </div>
  );
}
