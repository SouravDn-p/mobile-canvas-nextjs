"use client";
import { useState } from "react";
import { useGetProductByIdQuery } from "@/redux/api/productapi";
import Swal from "sweetalert2";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  Star,
  Check,
  Shield,
  Truck,
  RotateCcw,
  ChevronRight,
  Plus,
  Minus,
  Eye,
  X,
  Share,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  Zap,
} from "lucide-react";
import { useSession } from "next-auth/react";
import {
  useGetUserByEmailQuery,
  useUpdateUserMutation,
} from "@/redux/api/productapi";
import Loading from "@/app/admin/products/loading";
import Link from "next/link";

const categories = [
  { id: "phones", name: "Smartphones", icon: "📱" },
  { id: "tablets", name: "Tablets", icon: "📟" },
  { id: "laptops", name: "Laptops", icon: "💻" },
  { id: "accessories", name: "Accessories", icon: "🎧" },
  { id: "wearables", name: "Wearables", icon: "⌚" },
  { id: "Electronics", name: "Electronics", icon: "🔌" },
];

const formatPrice = (price) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 2,
  }).format(price);
};

const ShareButton = ({ productName }) => {
  const [showMenu, setShowMenu] = useState(false);
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      Swal.fire({
        icon: "success",
        title: "Link Copied!",
        text: "Product link copied to clipboard",
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
      setShowMenu(false);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to copy link.",
        toast: true,
        position: "top-end",
      });
    }
  };

  const shareOptions = [
    {
      name: "Facebook",
      icon: Facebook,
      color: "text-blue-500 hover:text-blue-600",
      bgColor: "hover:bg-blue-50",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        currentUrl
      )}`,
    },
    {
      name: "Twitter",
      icon: Twitter,
      color: "text-sky-500 hover:text-sky-600",
      bgColor: "hover:bg-sky-50",
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        currentUrl
      )}&text=Check out this amazing product: ${encodeURIComponent(
        productName
      )}`,
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      color: "text-blue-700 hover:text-blue-800",
      bgColor: "hover:bg-blue-50",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        currentUrl
      )}`,
    },
  ];

  return (
    <div className="relative inline-block text-left cursor-pointer">
      <button
        className="p-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 group"
        onClick={() => setShowMenu(!showMenu)}
      >
        <Share className="h-5 w-5 text-white group-hover:scale-110 transition-transform duration-300" />
      </button>

      {showMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10 cursor-pointer"
            onClick={() => setShowMenu(false)}
          />

          {/* Share Menu */}
          <div className="absolute z-20  right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in slide-in-from-top-2 duration-200">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Share this product
              </h3>

              {/* Social Share Options */}
              <div className="space-y-2">
                {shareOptions.map((option) => (
                  <a
                    key={option.name}
                    href={option.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${option.bgColor} group`}
                    onClick={() => setShowMenu(false)}
                  >
                    <div
                      className={`p-2 rounded-lg bg-gray-100 group-hover:bg-white transition-colors duration-200`}
                    >
                      <option.icon className={`h-5 w-5 ${option.color}`} />
                    </div>
                    <span className="font-medium text-gray-700 group-hover:text-gray-900">
                      Share on {option.name}
                    </span>
                  </a>
                ))}

                {/* Copy Link Option */}
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center cursor-pointer gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
                >
                  <div className="p-2 rounded-lg bg-gray-100  group-hover:bg-white transition-colors duration-200">
                    <Copy className="h-5 w-5 text-gray-600 group-hover:text-gray-800 " />
                  </div>
                  <span className="font-medium text-gray-700 group-hover:text-gray-900">
                    Copy Link
                  </span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const email = session?.user?.email;

  // API calls
  const { data, isLoading, error } = useGetProductByIdQuery(id);
  const { data: userData, refetch } = useGetUserByEmailQuery(email, {
    skip: !email,
  });
  const [updateUser] = useUpdateUserMutation();

  // State
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  const product = data?.data;
  const user = userData?.user;
  const wishlist = user?.wishlist || [];
  const cart = user?.cart || [];

  // Check if product is in wishlist
  const isInWishlist = wishlist.some((item) => item.productId === product?._id);

  if (isLoading) return <Loading />;

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
        <div className="text-center max-w-md relative z-10">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Product Not Found
          </h3>
          <p className="text-gray-400 mb-6">
            The product you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <button
            onClick={() => router.push("/products")}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const currentCategory = categories.find((cat) => cat.id === product.category);
  const description =
    product.description ||
    `Discover the ${product.name}, a high-quality product with excellent performance and reliability.`;

  const productImages = [
    product?.image ||
      product?.images?.[0]?.url ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        product?.name || "Product"
      )}&background=random`,
    product?.images?.[1]?.url ||
      product?.image ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        product?.name || "Product"
      )}&background=random`,
    product?.images?.[2]?.url ||
      product?.image ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        product?.name || "Product"
      )}&background=random`,
    product?.images?.[3]?.url ||
      product?.image ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        product?.name || "Product"
      )}&background=random`,
  ];

  const handleWishlistToggle = async () => {
    if (!email || isUpdating) return;

    setIsUpdating(true);
    try {
      let updatedWishlist;

      if (isInWishlist) {
        updatedWishlist = wishlist.filter(
          (item) => item.productId !== product._id
        );
      } else {
        const wishlistItem = {
          productId: product._id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          category: product.category,
          rating: product.rating,
          reviews: product.reviews,
          discount: product.discount || 0,
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
        toast: true,
        position: "top-end",
      });
    } catch (error) {
      console.error("Failed to update wishlist:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update wishlist. Please try again.",
        toast: true,
        position: "top-end",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddToCart = async () => {
    if (!email || isUpdating) return;

    setIsUpdating(true);
    try {
      const existingItem = cart.find((item) => item.productId === product._id);
      let updatedCart;

      if (existingItem) {
        updatedCart = cart.map((item) =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const cartItem = {
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          image: product.image,
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
        title: "Added to Cart!",
        text: `${product.name} has been added to your cart.`,
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
    } catch (error) {
      console.error("Failed to add to cart:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add product to cart. Please try again.",
        toast: true,
        position: "top-end",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBuyNow = async () => {
    if (!email || isBuyingNow) return;

    setIsBuyingNow(true);
    try {
      // First add to cart
      const existingItem = cart.find((item) => item.productId === product._id);
      let updatedCart;

      if (existingItem) {
        updatedCart = cart.map((item) =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const cartItem = {
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          image: product.image,
        };
        updatedCart = [...cart, cartItem];
      }

      await updateUser({
        email,
        data: { cart: updatedCart },
      }).unwrap();

      await refetch();

      // Show success message and redirect to checkout
      Swal.fire({
        icon: "success",
        title: "Redirecting to Checkout!",
        text: "Product added to cart. Taking you to checkout...",
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });

      // Redirect to checkout page after a short delay
      setTimeout(() => {
        router.push("/user/checkout");
      }, 1500);
    } catch (error) {
      console.error("Failed to buy now:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to process order. Please try again.",
        toast: true,
        position: "top-end",
      });
    } finally {
      setIsBuyingNow(false);
    }
  };

  const productFeatures = [
    "Unprecedented imagery from the world's first compact with global shutter full-frame image sensor",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Mobile Layout */}
        <div className="lg:hidden">
          <div className="max-w-2xl  bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-t-3xl mt-4 mx-4 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-700/50 rounded-full transition-colors"
              >
                <ArrowLeft className="h-6 w-6 text-white" />
              </button>

              <div className="flex-1 text-center">
                <h1 className="text-lg font-bold text-white truncate px-4">
                  {product.name}
                </h1>
                <p className="text-xs text-gray-400">
                  {product.supplier || "Premium Quality"}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <ShareButton
                  className="cursor-pointer"
                  productName={product.name}
                />
                <button
                  onClick={handleWishlistToggle}
                  disabled={isUpdating || !email}
                  className={`p-2 rounded-full transition-colors ${
                    isInWishlist
                      ? "text-red-400 hover:bg-red-500/10"
                      : "text-gray-400 hover:bg-gray-700/50"
                  } ${isUpdating ? "animate-pulse" : ""}`}
                >
                  <Heart
                    className={`h-5 w-5 ${isInWishlist ? "fill-current" : ""}`}
                  />
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gray-900/50 relative overflow-hidden">
                <Image
                  src={productImages[selectedImageIndex] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                {product.trending && (
                  <span className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                    Trending
                  </span>
                )}
                {product.discount && (
                  <span className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    -{product.discount}% OFF
                  </span>
                )}
              </div>

              <div className="flex space-x-3 p-4 overflow-x-auto">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      selectedImageIndex === index
                        ? "border-purple-500 shadow-lg shadow-purple-500/25"
                        : "border-gray-600 hover:border-gray-500"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    {product.stock > 0 ? (
                      <span className="text-green-400">
                        ✓ {product.stock} units in stock
                      </span>
                    ) : (
                      <span className="text-red-400">✗ Out of stock</span>
                    )}
                  </p>
                </div>
                <button className="flex items-center text-purple-400 font-medium text-sm hover:text-purple-300 transition-colors">
                  More Options
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating || 0)
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-600 text-gray-600"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-white">
                  {product.rating || 0}
                </span>
                <span className="text-sm text-gray-400">
                  ({product.reviews || 0} reviews)
                </span>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">
                  About This Item
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {description}
                </p>
                <ul className="space-y-3">
                  {(product?.features
                    ? product?.features
                    : productFeatures
                  ).map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-start space-x-3 text-sm text-gray-300"
                    >
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-700/50">
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <Truck className="h-4 w-4 text-green-400" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <Shield className="h-4 w-4 text-blue-400" />
                  <span>1 Year Warranty</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <RotateCcw className="h-4 w-4 text-purple-400" />
                  <span>30-Day Returns</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <Check className="h-4 w-4 text-green-400" />
                  <span>Authentic Product</span>
                </div>
              </div>

              <div className="flex items-center justify-between py-4 border-t border-gray-700/50">
                <span className="text-sm font-medium text-white">Quantity</span>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:bg-gray-700/50 transition-colors cursor-pointer"
                  >
                    <Minus className="h-4 w-4 text-gray-300" />
                  </button>
                  <span className="w-8 text-center font-medium text-white text-lg">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock || 99, quantity + 1))
                    }
                    className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:bg-gray-700/50 transition-colors cursor-pointer"
                  >
                    <Plus className="h-4 w-4 text-gray-300 cursor-pointer" />
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Action Buttons */}
            <div className="sticky bottom-0 bg-gray-800/80 backdrop-blur-sm border-t border-gray-700/50 p-4">
              <div className="flex space-x-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || isUpdating || !email}
                  className={`flex-1 py-3 rounded-2xl font-semibold text-white transition-all duration-300 ${
                    product.stock > 0 && email && !isUpdating
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 active:scale-95 shadow-lg shadow-blue-500/25"
                      : "bg-gray-600 cursor-not-allowed"
                  }`}
                >
                  {isUpdating ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Adding...
                    </div>
                  ) : product.stock === 0 ? (
                    "Out of Stock"
                  ) : !email ? (
                    "Login to Add"
                  ) : (
                    "Add to Cart"
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0 || isBuyingNow || !email}
                  className={`flex-1 py-3 rounded-2xl font-semibold text-white transition-all duration-300 ${
                    product.stock > 0 && email && !isBuyingNow
                      ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 active:scale-95 shadow-lg shadow-orange-500/25"
                      : "bg-gray-600 cursor-not-allowed"
                  }`}
                >
                  {isBuyingNow ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : product.stock === 0 ? (
                    "Out of Stock"
                  ) : !email ? (
                    "Login to Buy"
                  ) : (
                    <>
                      <Zap className="inline h-4 w-4 mr-1" />
                      Buy Now
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm text-gray-400 mb-8">
              <Link href="/" className="hover:text-white">
                Home
              </Link>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <Link href="/products" className="hover:text-white">
                Products
              </Link>
              {currentCategory && (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  <Link
                    href={`/products?category=${currentCategory.id}`}
                    className="hover:text-white"
                  >
                    {currentCategory.name}
                  </Link>
                </>
              )}
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <span>{product.name}</span>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
              {/* Left Column - Images */}
              <div className="space-y-6">
                <div className="relative aspect-square bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl overflow-hidden group">
                  <Image
                    src={
                      productImages[selectedImageIndex] || "/placeholder.svg"
                    }
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                  {product.trending && (
                    <span className="absolute top-6 left-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-sm font-bold px-4 py-2 rounded-full">
                      Trending
                    </span>
                  )}
                  {product.discount && (
                    <span className="absolute top-6 right-6 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold px-4 py-2 rounded-full">
                      -{product.discount}% OFF
                    </span>
                  )}

                  {/* Action Buttons Overlay */}
                  <div className="absolute top-6 right-6 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ShareButton productName={product.name} />
                    <button
                      onClick={handleWishlistToggle}
                      disabled={isUpdating || !email}
                      className={`p-3 backdrop-blur-sm rounded-full transition-colors ${
                        isInWishlist
                          ? "bg-red-500/80 text-white hover:bg-red-600/80"
                          : "bg-gray-900/80 text-gray-300 hover:text-white"
                      } ${isUpdating ? "animate-pulse" : ""}`}
                    >
                      <Heart
                        className={`h-5 w-5 ${
                          isInWishlist ? "fill-current" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Image Thumbnails */}
                <div className="flex space-x-4 justify-center">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                        selectedImageIndex === index
                          ? "border-purple-500 shadow-lg shadow-purple-500/25 scale-105"
                          : "border-gray-600 hover:border-gray-500 hover:scale-105"
                      }`}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${product.name} ${index + 1}`}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column - Product Info */}
              <div className="space-y-8">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-purple-400 font-medium bg-purple-900/30 px-4 py-2 rounded-lg border border-purple-700/50">
                      {product.supplier || "Premium Brand"}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-gray-700/50 rounded-full transition-colors">
                        <Eye className="h-5 w-5 text-gray-400" />
                      </button>
                      <span className="text-sm text-gray-400">
                        {Math.floor(Math.random() * 1000) + 100} views
                      </span>
                    </div>
                  </div>

                  <h1 className="text-4xl xl:text-5xl font-bold text-white mb-4 leading-tight">
                    {product.name}
                  </h1>

                  <p className="text-gray-300 text-lg leading-relaxed">
                    {description}
                  </p>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-6 w-6 ${
                          i < Math.floor(product.rating || 0)
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-600 text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-medium text-white">
                    {product.rating || 0}
                  </span>
                  <span className="text-gray-400">
                    ({product.reviews || 0} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-6">
                  <span className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-2xl text-gray-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                <div className="text-lg">
                  {product.stock > 0 ? (
                    <span className="text-green-400 flex items-center">
                      <Check className="h-5 w-5 mr-2" />
                      {product.stock} units in stock
                    </span>
                  ) : (
                    <span className="text-red-400 flex items-center">
                      <X className="h-5 w-5 mr-2" />
                      Out of stock
                    </span>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold text-white">
                    Key Features
                  </h3>
                  <ul className="space-y-3">
                    {(product?.features
                      ? product?.features
                      : productFeatures
                    ).map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start space-x-3 text-gray-300"
                      >
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-3 flex-shrink-0"></div>
                        <span className="text-lg">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Product Details */}
                <div className="grid grid-cols-2 gap-6 py-6 border-t border-gray-700/50">
                  <div className="flex items-center space-x-3 text-gray-300">
                    <Truck className="h-6 w-6 text-green-400" />
                    <span className="text-lg">Free Shipping</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-300">
                    <Shield className="h-6 w-6 text-blue-400" />
                    <span className="text-lg">1 Year Warranty</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-300">
                    <RotateCcw className="h-6 w-6 text-purple-400" />
                    <span className="text-lg">30-Day Returns</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-300">
                    <Check className="h-6 w-6 text-green-400" />
                    <span className="text-lg">Authentic Product</span>
                  </div>
                </div>

                {/* Quantity and Add to Cart */}
                <div className="space-y-6 border-t border-gray-700/50 pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-medium text-white">
                      Quantity
                    </span>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-12 h-12 rounded-full border border-gray-600 flex items-center justify-center hover:bg-gray-700/50 transition-colors cursor-pointer"
                      >
                        <Minus className="h-5 w-5 text-gray-300" />
                      </button>
                      <span className="w-12 text-center font-medium text-white text-xl">
                        {quantity}
                      </span>
                      <button
                        onClick={() =>
                          setQuantity(
                            Math.min(product.stock || 99, quantity + 1)
                          )
                        }
                        className="w-12 h-12 rounded-full border border-gray-600 flex items-center justify-center hover:bg-gray-700/50 transition-colors cursor-pointer"
                      >
                        <Plus className="h-5 w-5 text-gray-300" />
                      </button>
                    </div>
                  </div>

                  {/* Desktop Action Buttons */}
                  <div className="flex space-x-4">
                    <button
                      onClick={handleAddToCart}
                      disabled={product.stock === 0 || isUpdating || !email}
                      className={`flex-1 cursor-pointer py-4 rounded-2xl font-semibold text-white text-lg transition-all duration-300 ${
                        product.stock > 0 && email && !isUpdating
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 hover:scale-105 shadow-lg shadow-blue-500/25"
                          : "bg-gray-600 cursor-not-allowed"
                      }`}
                    >
                      {isUpdating ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                          Adding to Cart...
                        </div>
                      ) : product.stock === 0 ? (
                        "Out of Stock"
                      ) : !email ? (
                        "Login to Add to Cart"
                      ) : (
                        <>
                          <ShoppingCart className="inline h-5 w-5 mr-2" />
                          Add to Cart - {formatPrice(product.price * quantity)}
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleBuyNow}
                      disabled={product.stock === 0 || isBuyingNow || !email}
                      className={`flex-1 cursor-pointer py-4 rounded-2xl font-semibold text-white text-lg transition-all duration-300 ${
                        product.stock > 0 && email && !isBuyingNow
                          ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 hover:scale-105 shadow-lg shadow-orange-500/25"
                          : "bg-gray-600 cursor-not-allowed"
                      }`}
                    >
                      {isBuyingNow ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                          Processing...
                        </div>
                      ) : product.stock === 0 ? (
                        "Out of Stock"
                      ) : !email ? (
                        "Login to Buy Now"
                      ) : (
                        <>
                          <Zap className="inline h-5 w-5 mr-2" />
                          Buy Now - {formatPrice(product.price * quantity)}
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => router.push("/user/cart")}
                      className="px-6 py-4 rounded-2xl border border-gray-600 text-gray-300 hover:bg-gray-700/50 transition-colors relative cursor-pointer"
                    >
                      <ShoppingCart className="h-6 w-6" />
                      {cart.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                          {cart.length}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
