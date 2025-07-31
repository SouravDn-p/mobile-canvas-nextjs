"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Eye, Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import {
  useGetUserByEmailQuery,
  useUpdateUserMutation,
} from "@/redux/api/productapi";
import Button from "../ui/button";
import Swal from "sweetalert2";

export default function ProductCard({ product }) {
  const { data: session } = useSession();
  const email = session?.user?.email;

  // API calls
  const { data: userData, refetch } = useGetUserByEmailQuery(email, {
    skip: !email,
  });
  const [updateUser] = useUpdateUserMutation();

  const [isUpdating, setIsUpdating] = useState(false);

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

  const user = userData?.user;
  const wishlist = user?.wishlist || [];
  const cart = user?.cart || [];

  // Check if product is in wishlist
  const isInWishlist = wishlist.some((item) => item.productId === _id);

  const discountPercentage = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const handleWishlistToggle = async () => {
    if (!email || isUpdating) return;

    setIsUpdating(true);
    try {
      let updatedWishlist;

      if (isInWishlist) {
        // Remove from wishlist
        updatedWishlist = wishlist.filter((item) => item.productId !== _id);
      } else {
        // Add to wishlist
        const wishlistItem = {
          productId: _id,
          name,
          price,
          originalPrice,
          image,
          category,
          rating,
          reviews,
          discount: discountPercentage,
        };
        updatedWishlist = [...wishlist, wishlistItem];
      }

      await updateUser({
        email,
        data: { wishlist: updatedWishlist },
      }).unwrap();

      await refetch();
      Swal.fire({
        icon: "success",
        title: isInWishlist ? "Removed from Wishlist" : "Added to Wishlist",
        text: `${product.name} has been ${
          isInWishlist ? "removed from" : "added to"
        } your wishlist.`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Failed to update wishlist:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update wishlist. Please try again.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddToCart = async () => {
    if (!email || isUpdating) return;

    setIsUpdating(true);
    try {
      const existingItem = cart.find((item) => item.productId === _id);
      let updatedCart;

      if (existingItem) {
        // Update quantity if item already exists
        updatedCart = cart.map((item) =>
          item.productId === _id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item to cart
        const cartItem = {
          productId: _id,
          name,
          price,
          quantity: 1,
          image,
        };
        updatedCart = [...cart, cartItem];
      }

      await updateUser({
        email,
        data: { cart: updatedCart },
      }).unwrap();

      await refetch();
      Swal.fire({
        icon: "success",
        title: "Added to Cart",
        text: `${product.name} has been added to your cart.`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Failed to add to cart:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add product to cart. Please try again.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

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

          {/* Dynamic Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            disabled={isUpdating || !email}
            className={`absolute top-4 right-4 p-2 cursor-pointer backdrop-blur-sm rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 ${
              isInWishlist
                ? "bg-red-500/80 text-white hover:bg-red-600/80"
                : "bg-black/50 text-white hover:bg-purple-500/50"
            } ${isUpdating ? "animate-pulse" : ""}`}
          >
            <Heart
              className={`h-4 w-4 ${isInWishlist ? "fill-current" : ""}`}
            />
          </button>

          {/* Quick Actions - Visible on Hover */}
          <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
            <Link href={`/products/${_id}`} className="flex-1">
              <Button
                size="sm"
                className="w-full bg-gradient-to-r cursor-pointer from-purple-500/20 to-cyan-500/20 text-purple-300 border border-purple-500/30 hover:from-purple-500/30 hover:to-cyan-500/30 backdrop-blur-sm"
              >
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
            </Link>
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={isUpdating || !email}
              className={`bg-gradient-to-r cursor-pointer from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/30 hover:from-green-500/30 hover:to-emerald-500/30 backdrop-blur-sm ${
                isUpdating ? "animate-pulse" : ""
              }`}
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
                    i < Math.floor(rating || 0)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-600"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-400">
              {rating || 0} ({reviews?.toLocaleString() || 0})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              ৳ {price?.toLocaleString()}
            </span>
            {originalPrice && (
              <span className="text-lg text-gray-500 line-through">
                ৳ {originalPrice?.toLocaleString()}
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
              onClick={handleAddToCart}
              disabled={isUpdating || !email}
              className={`bg-gradient-to-r cursor-pointer from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white ${
                isUpdating ? "animate-pulse" : ""
              }`}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {isUpdating ? "Adding..." : "Add to Cart"}
            </Button>
          </div>
        </div>

        {/* Shimmer Effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-1000 ease-out pointer-events-none"></div>
      </div>
    </div>
  );
}
