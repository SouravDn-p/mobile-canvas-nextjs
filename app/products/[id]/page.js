"use client";

import { useGetProductByIdQuery } from "@/redux/api/productapi";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import Loading from "@/app/admin/products/loading";

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
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(price);
};

export default function ProductDetails() {
  const { id } = useParams();
  const { data, isLoading, error } = useGetProductByIdQuery(id);

  const product = data?.data;

  if (isLoading) return <Loading />;
  if (error || !product)
    return (
      <div className="relative min-h-screen text-center py-16 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl">
        <div className="text-8xl mb-6">🔍</div>
        <h3 className="text-3xl font-bold text-red-500 mb-4">
          ❌ Failed to load product
        </h3>
        <p className="text-gray-300 text-lg mb-8 max-w-md mx-auto">
          Try adjusting your search, category, or price range criteria
        </p>
        <Link
          href="/products"
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
        >
          Back to Products
        </Link>
      </div>
    );

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-300 mb-8">
            The product you&apos;re looking for doesn&apos;t exist.
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

  const currentCategory = categories.find((cat) => cat.id === product.category);
  const description =
    product.description ||
    `Discover the ${product.name}, a high-quality product from ${
      product.supplier || "our trusted supplier"
    }. Perfect for your needs with excellent performance and reliability.`;

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Product Image */}
          <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
            <Image
              src={
                product?.image ||
                product?.images[0]?.url ||
                "/placeholder.svg?height=600&width=600"
              }
              alt={product?.name}
              fill
              className="object-cover "
            />
            {product.trending && (
              <span className="absolute top-4 left-4 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                Trending
              </span>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-indigo-400 font-medium bg-indigo-900/50 px-3 py-1 rounded-lg border border-indigo-700">
                  {product.supplier || "Unknown Brand"}
                </span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">
                {product.name}
              </h1>
              <p className="text-gray-300 text-lg">{description}</p>
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
              <span className="text-gray-400">
                ({product.reviews || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-4xl font-bold text-white">
                {formatPrice(product.price)}
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

            {/* Stock Status */}
            <div className="text-sm text-gray-300">
              <span
                className={
                  product.stock > 0 ? "text-green-400" : "text-red-400"
                }
              >
                {product.status ||
                  (product.stock > 0 ? "In Stock" : "Out of Stock")}{" "}
                ({product.stock} units available)
              </span>
            </div>

            {/* Action Button */}
            <button
              disabled={product.stock === 0}
              className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                product.stock > 0
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
            >
              Add to Cart - {formatPrice(product.price)}
            </button>

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
                    d="M9 12l2 2 4-4 m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {product.warranty || "1 year warranty included"}
              </div>
              <div className="flex items-center text-gray-300">
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
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                SKU: {product.sku}
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="mb-12 bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-700 p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Description</h2>
          <p className="text-gray-300 text-lg">
            {product.longDescription || description}
          </p>
        </div>
      </div>
    </div>
  );
}
