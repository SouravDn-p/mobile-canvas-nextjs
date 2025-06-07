"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import getAllProducts from "@/lib/getAllProducts";

const categories = [
  { id: "phones", name: "Smartphones", icon: "📱" },
  { id: "tablets", name: "Tablets", icon: "📟" },
  { id: "laptops", name: "Laptops", icon: "💻" },
  { id: "accessories", name: "Accessories", icon: "🎧" },
  { id: "wearables", name: "Wearables", icon: "⌚" },
];

// Image Gallery Component
const ImageGallery = ({ images, productName }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
        <Image
          src={images[selectedImage] || "/placeholder.svg?height=600&width=600"}
          alt={productName}
          fill
          className={`object-cover transition-transform duration-300 ${
            isZoomed ? "scale-150" : "scale-100"
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
        />
        <button
          onClick={() => setIsZoomed(!isZoomed)}
          className="absolute top-4 right-4 cursor-pointer bg-gray-900/80 backdrop-blur-sm text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>

      {/* Thumbnail Images */}
      <div className="flex space-x-2 overflow-x-auto">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`flex-shrink-0 w-20 h-20 rounded-lg cursor-pointer overflow-hidden border-2 transition-colors ${
              selectedImage === index ? "border-indigo-500" : "border-gray-600"
            }`}
          >
            <Image
              src={image || "/placeholder.svg?height=80&width=80"}
              alt={`${productName} view ${index + 1}`}
              width={80}
              height={80}
              className="object-cover w-full h-full"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

// Reviews Component
const ReviewsSection = ({ rating, reviews, productId }) => {
  const [showAllReviews, setShowAllReviews] = useState(false);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} className="w-5 h-5 fill-yellow-400" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-5 h-5 fill-yellow-400" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="half-fill">
              <stop offset="50%" stopColor="#FBBF24" />
              <stop offset="50%" stopColor="#E5E7EB" />
            </linearGradient>
          </defs>
          <path
            fill="url(#half-fill)"
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </svg>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg
          key={`empty-${i}`}
          className="w-5 h-5 fill-gray-300"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    return stars;
  };

  const sampleReviews = [
    {
      id: 1,
      user: "John D.",
      rating: 5,
      date: "2024-01-15",
      title: "Absolutely amazing!",
      comment:
        "This product exceeded all my expectations. The build quality is outstanding and the performance is incredible.",
      verified: true,
    },
    {
      id: 2,
      user: "Sarah M.",
      rating: 4,
      date: "2024-01-10",
      title: "Great value for money",
      comment:
        "Really happy with this purchase. Works exactly as described and arrived quickly.",
      verified: true,
    },
    {
      id: 3,
      user: "Mike R.",
      rating: 5,
      date: "2024-01-08",
      title: "Highly recommended",
      comment:
        "Best purchase I've made this year. The features are incredible and it's so easy to use.",
      verified: false,
    },
  ];

  return (
    <div className="bg-gray-900/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white">Customer Reviews</h3>
        <button className="  bg-gradient-to-r cursor-pointer from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-300">
          Write Review
        </button>
      </div>

      {/* Rating Summary */}
      <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-800/50 rounded-xl">
        <div className="text-center">
          <div className="text-4xl font-bold text-white">{rating}</div>
          <div className="flex items-center justify-center space-x-1 mt-1">
            {renderStars(rating)}
          </div>
          <div className="text-sm text-gray-400 mt-1">{reviews} reviews</div>
        </div>
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center space-x-2">
              <span className="text-sm text-gray-300 w-8">{star}★</span>
              <div className="flex-1 bg-gray-700 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full"
                  style={{
                    width: `${
                      star === 5
                        ? 70
                        : star === 4
                        ? 20
                        : star === 3
                        ? 5
                        : star === 2
                        ? 3
                        : 2
                    }%`,
                  }}
                />
              </div>
              <span className="text-sm text-gray-400 w-8">
                {star === 5
                  ? 70
                  : star === 4
                  ? 20
                  : star === 3
                  ? 5
                  : star === 2
                  ? 3
                  : 2}
                %
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Individual Reviews */}
      <div className="space-y-4">
        {sampleReviews
          .slice(0, showAllReviews ? sampleReviews.length : 2)
          .map((review) => (
            <div
              key={review.id}
              className="p-4 bg-gray-800/30 rounded-xl border border-gray-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-white">
                    {review.user}
                  </span>
                  {review.verified && (
                    <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                      Verified
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-400">{review.date}</span>
              </div>
              <div className="flex items-center space-x-1 mb-2">
                {renderStars(review.rating)}
              </div>
              <h4 className="font-semibold text-white mb-1">{review.title}</h4>
              <p className="text-gray-300">{review.comment}</p>
            </div>
          ))}
      </div>

      {sampleReviews.length > 2 && (
        <button
          onClick={() => setShowAllReviews(!showAllReviews)}
          className="mt-4 text-indigo-400 hover:text-indigo-300 font-medium"
        >
          {showAllReviews
            ? "Show Less"
            : `Show All ${sampleReviews.length} Reviews`}
        </button>
      )}
    </div>
  );
};

// Related Products Component
const RelatedProducts = ({ currentProduct, allProducts }) => {
  const relatedProducts = allProducts
    .filter(
      (product) =>
        product.category === currentProduct.category &&
        product.id !== currentProduct.id
    )
    .slice(0, 4);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-gray-900/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-700">
      <h3 className="text-2xl font-bold text-white mb-6">Related Products</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {relatedProducts.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`}>
            <div className="group bg-gray-800/50 rounded-xl p-4 hover:bg-gray-800/70 transition-all duration-300 border border-gray-600 hover:border-indigo-500">
              <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                <Image
                  src={
                    product.images?.[0] ||
                    "/placeholder.svg?height=200&width=200"
                  }
                  alt={product.name}
                  width={200}
                  height={200}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h4 className="font-semibold text-white text-sm mb-1 line-clamp-2">
                {product.name}
              </h4>
              <p className="text-indigo-400 font-bold">
                {formatPrice(product.price)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// Main Product Details Component
export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  const products = getAllProducts();
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedStorage, setSelectedStorage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundProduct = products.find((p) => p.id === Number.parseInt(id));
    if (foundProduct) {
      setProduct(foundProduct);
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-300 mb-8">
            The product you're looking for doesn't exist.
          </p>
          <Link
            href="/products"
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const currentPrice = product.storageOptions
    ? product.storageOptions[selectedStorage].price
    : product.price;
  const currentCategory = categories.find((cat) => cat.id === product.category);

  const handleAddToCart = () => {
    console.log("Added to cart:", {
      product: product.name,
      color: product.colors?.[selectedColor]?.name,
      storage: product.storageOptions?.[selectedStorage]?.size,
      quantity,
      price: currentPrice,
    });
  };

  const handleBuyNow = () => {
    console.log("Buy now:", {
      product: product.name,
      color: product.colors?.[selectedColor]?.name,
      storage: product.storageOptions?.[selectedStorage]?.size,
      quantity,
      price: currentPrice,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950">
      <div className="container mx-auto px-4 py-8">
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
          {currentCategory && (
            <>
              <Link
                href={`/products?category=${currentCategory.id}`}
                className="hover:text-white"
              >
                {currentCategory.name}
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
            </>
          )}
          <span>{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Product Images */}
          <div>
            <ImageGallery
              images={product.images || [product.image]}
              productName={product.name}
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand and Title */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-indigo-400 font-medium bg-indigo-900/50 px-3 py-1 rounded-lg border border-indigo-700">
                  {product.brand}
                </span>
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="p-2 rounded-full bg-gray-900/80 backdrop-blur-sm hover:bg-gray-800 transition-all duration-300 border border-gray-600"
                >
                  <svg
                    className={`w-6 h-6 transition-colors ${
                      isWishlisted
                        ? "fill-red-500 text-red-500"
                        : "text-gray-300 hover:text-red-500"
                    }`}
                    fill={isWishlisted ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">
                {product.name}
              </h1>
              <p className="text-gray-300 text-lg">{product.description}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? "fill-yellow-400"
                        : "fill-gray-300"
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-white font-semibold">{product.rating}</span>
              <span className="text-gray-400">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-4xl font-bold text-white">
                {formatPrice(currentPrice)}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {product.discount && (
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  -{product.discount}% OFF
                </span>
              )}
            </div>

            {/* Color Selection */}
            {product.colors && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Color: {product.colors[selectedColor].name}
                </h3>
                <div className="flex space-x-3">
                  {product.colors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedColor(index)}
                      className={`w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                        selectedColor === index
                          ? "border-indigo-500 scale-110"
                          : "border-gray-600"
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Storage Selection */}
            {product.storageOptions && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Storage
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {product.storageOptions.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedStorage(index)}
                      className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                        selectedStorage === index
                          ? "border-indigo-500 bg-indigo-900/50 text-white"
                          : "border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500"
                      }`}
                    >
                      <div className="font-semibold">{option.size}</div>
                      <div className="text-sm">{formatPrice(option.price)}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Quantity
              </h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="cursor-pointer w-10 h-10 rounded-lg bg-gray-800 border border-gray-600 text-white hover:bg-gray-700 transition-colors"
                >
                  -
                </button>
                <span className=" w-16 text-center text-white font-semibold">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="cursor-pointer w-10 h-10 rounded-lg bg-gray-800 border border-gray-600 text-white hover:bg-gray-700 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r cursor-pointer from-indigo-500 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Add to Cart - {formatPrice(currentPrice * quantity)}
              </button>
              <button
                onClick={handleBuyNow}
                className=" cursor-pointer w-full bg-white text-gray-900 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Buy Now
              </button>
            </div>

            {/* Additional Info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center text-green-400">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {product.shipping || "Free shipping on orders over $50"}
              </div>
              <div className="flex items-center text-blue-400">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {product.warranty || "1 year warranty included"}
              </div>
              <div className="flex items-center text-yellow-400">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                In stock - Ships within 24 hours
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-12">
          <div className="bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-700">
              {["description", "specifications", "features"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-4 px-6 font-semibold transition-colors cursor-pointer ${
                    activeTab === tab
                      ? "bg-indigo-900/50 text-indigo-400 border-b-2 border-indigo-500"
                      : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "description" && (
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {product.longDescription || product.description}
                  </p>
                </div>
              )}

              {activeTab === "specifications" && product.specifications && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between py-3 border-b border-gray-700"
                      >
                        <span className="font-semibold text-gray-300">
                          {key}
                        </span>
                        <span className="text-white">{value}</span>
                      </div>
                    )
                  )}
                </div>
              )}

              {activeTab === "features" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <svg
                        className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-12">
          <ReviewsSection
            rating={product.rating}
            reviews={product.reviews}
            productId={product.id}
          />
        </div>

        {/* Related Products */}
        <RelatedProducts currentProduct={product} allProducts={products} />
      </div>
    </div>
  );
}
