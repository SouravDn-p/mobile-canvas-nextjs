"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Home,
  Plus,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Star,
  ShoppingCart,
} from "lucide-react";

const categories = [
  { id: "phones", name: "Smartphones", icon: "📱" },
  { id: "tablets", name: "Tablets", icon: "📟" },
  { id: "laptops", name: "Laptops", icon: "💻" },
  { id: "accessories", name: "Accessories", icon: "🎧" },
  { id: "wearables", name: "Wearables", icon: "⌚" },
];

const brands = ["Apple", "Samsung", "Google", "Sony", "Dell", "Anker"];

// Mock products data
const mockProducts = [
  {
    id: "1",
    name: "iPhone 15 Pro Max",
    category: "phones",
    brand: "Apple",
    price: 1199,
    rating: 4.8,
    reviews: 234,
    description:
      "The most advanced iPhone with titanium design and A17 Pro chip",
    features: ["A17 Pro chip", "Titanium design", "48MP camera", "USB-C"],
    image: "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg",
    stock: 45,
    status: "active",
  },
  {
    id: "2",
    name: "Samsung Galaxy S24 Ultra",
    category: "phones",
    brand: "Samsung",
    price: 1099,
    rating: 4.7,
    reviews: 189,
    description: "Premium Android flagship with S Pen and AI features",
    features: [
      "S Pen included",
      "200MP camera",
      "AI features",
      "5000mAh battery",
    ],
    image: "https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg",
    stock: 23,
    status: "active",
  },
  {
    id: "3",
    name: 'iPad Pro 12.9"',
    category: "tablets",
    brand: "Apple",
    price: 899,
    rating: 4.6,
    reviews: 156,
    description: "Professional tablet with M2 chip and Liquid Retina display",
    features: [
      "M2 chip",
      "12.9-inch display",
      "Apple Pencil support",
      "Thunderbolt",
    ],
    image: "https://images.pexels.com/photos/1334598/pexels-photo-1334598.jpeg",
    stock: 0,
    status: "out_of_stock",
  },
  {
    id: "4",
    name: 'MacBook Pro 16"',
    category: "laptops",
    brand: "Apple",
    price: 2399,
    rating: 4.9,
    reviews: 98,
    description: "Powerful laptop for professionals with M3 Pro chip",
    features: [
      "M3 Pro chip",
      "16-inch display",
      "22-hour battery",
      "Studio-quality mics",
    ],
    image: "https://images.pexels.com/photos/18105/pexels-photo.jpg",
    stock: 12,
    status: "active",
  },
  {
    id: "5",
    name: "AirPods Pro",
    category: "accessories",
    brand: "Apple",
    price: 249,
    rating: 4.5,
    reviews: 445,
    description: "Premium wireless earbuds with active noise cancellation",
    features: [
      "Active Noise Cancellation",
      "Spatial Audio",
      "MagSafe charging",
      "Sweat resistant",
    ],
    image: "https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg",
    stock: 67,
    status: "active",
  },
  {
    id: "6",
    name: "Apple Watch Series 9",
    category: "wearables",
    brand: "Apple",
    price: 399,
    rating: 4.4,
    reviews: 267,
    description:
      "Advanced smartwatch with health monitoring and fitness tracking",
    features: [
      "Health monitoring",
      "Fitness tracking",
      "Always-on display",
      "Water resistant",
    ],
    image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg",
    stock: 34,
    status: "active",
  },
  {
    id: "7",
    name: "Google Pixel 8 Pro",
    category: "phones",
    brand: "Google",
    price: 999,
    rating: 4.6,
    reviews: 134,
    description: "AI-powered Android phone with exceptional camera",
    features: [
      "Google Tensor G3",
      "AI camera features",
      "Magic Eraser",
      "7 years updates",
    ],
    image: "https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg",
    stock: 28,
    status: "active",
  },
  {
    id: "8",
    name: "Surface Pro 9",
    category: "tablets",
    brand: "Microsoft",
    price: 1299,
    rating: 4.3,
    reviews: 87,
    description: "Versatile 2-in-1 laptop and tablet with Windows 11",
    features: [
      "Windows 11",
      "Detachable keyboard",
      "Surface Pen support",
      "All-day battery",
    ],
    image: "https://images.pexels.com/photos/1334598/pexels-photo-1334598.jpeg",
    stock: 15,
    status: "active",
  },
  {
    id: "9",
    name: "Dell XPS 13",
    category: "laptops",
    brand: "Dell",
    price: 1599,
    rating: 4.5,
    reviews: 123,
    description: "Ultra-portable laptop with stunning InfinityEdge display",
    features: [
      "InfinityEdge display",
      "Intel Core i7",
      "16GB RAM",
      "Ultra-portable",
    ],
    image: "https://images.pexels.com/photos/18105/pexels-photo.jpg",
    stock: 19,
    status: "active",
  },
  {
    id: "10",
    name: "Sony WH-1000XM5",
    category: "accessories",
    brand: "Sony",
    price: 399,
    rating: 4.7,
    reviews: 298,
    description: "Industry-leading noise canceling wireless headphones",
    features: [
      "Industry-leading ANC",
      "30-hour battery",
      "Quick charge",
      "Multipoint connection",
    ],
    image: "https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg",
    stock: 42,
    status: "active",
  },
  {
    id: "11",
    name: "Samsung Galaxy Tab S9",
    category: "tablets",
    brand: "Samsung",
    price: 799,
    rating: 4.4,
    reviews: 156,
    description: "Premium Android tablet with S Pen included",
    features: [
      "S Pen included",
      "AMOLED display",
      "DeX mode",
      "Water resistant",
    ],
    image: "https://images.pexels.com/photos/1334598/pexels-photo-1334598.jpeg",
    stock: 31,
    status: "active",
  },
  {
    id: "12",
    name: "Anker PowerCore 10000",
    category: "accessories",
    brand: "Anker",
    price: 49,
    rating: 4.3,
    reviews: 567,
    description: "Compact portable charger with fast charging technology",
    features: [
      "10000mAh capacity",
      "Fast charging",
      "Compact design",
      "Universal compatibility",
    ],
    image: "https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg",
    stock: 89,
    status: "active",
  },
];

// Filter Sidebar Component
function FilterSidebar({
  searchTerm,
  setSearchTerm,
  selectedBrand,
  setSelectedBrand,
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
  selectedCategory,
  setSelectedCategory,
  brands,
  categories,
  onClearFilters,
}) {
  return (
    <div className="w-full lg:w-80 space-y-6">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-cyan-600/10 rounded-2xl blur-xl opacity-50"></div>
        <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Filters</h3>

          {/* Search */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
            />
          </div>

          {/* Category */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                  className="bg-gray-800"
                >
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Brand */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Brand
            </label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
            >
              <option value="">All Brands</option>
              {brands.map((brand) => (
                <option key={brand} value={brand} className="bg-gray-800">
                  {brand}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
            >
              <option value="name" className="bg-gray-800">
                Name
              </option>
              <option value="price-low" className="bg-gray-800">
                Price: Low to High
              </option>
              <option value="price-high" className="bg-gray-800">
                Price: High to Low
              </option>
              <option value="rating" className="bg-gray-800">
                Rating
              </option>
              <option value="reviews" className="bg-gray-800">
                Most Reviews
              </option>
              <option value="newest" className="bg-gray-800">
                Newest
              </option>
            </select>
          </div>

          {/* Clear Filters */}
          <button
            onClick={onClearFilters}
            className="w-full py-2 px-4 bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border border-red-500/30 rounded-xl hover:from-red-500/30 hover:to-pink-500/30 transition-all duration-300"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    </div>
  );
}

// Product Card Component
function ProductCard({ product, isAdmin }) {
  const getStockStatus = (stock) => {
    if (stock === 0) return { text: "Out of Stock", color: "text-red-400" };
    if (stock < 10) return { text: "Low Stock", color: "text-yellow-400" };
    return { text: "In Stock", color: "text-green-400" };
  };

  const stockStatus = getStockStatus(product.stock);

  return (
    <div className="relative group overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.02]">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden group-hover:border-purple-500/30 transition-all duration-300">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={400}
            height={400}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Stock Status Badge */}
          <div className="absolute top-4 left-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${stockStatus.color} bg-black/50 backdrop-blur-sm`}
            >
              {stockStatus.text}
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-6">
          <div className="mb-3">
            <h3 className="font-semibold text-lg text-white group-hover:text-purple-300 transition-colors duration-300 mb-1">
              {product.name}
            </h3>
            <p className="text-sm text-gray-400">{product.brand}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-600"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-400">({product.reviews})</span>
          </div>

          {/* Price */}
          <div className="mb-4">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              ${product.price}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-400 mb-4 line-clamp-2">
            {product.description}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <Link href={`/products/${product.id}`}>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-purple-300 border border-purple-500/30 rounded-xl hover:from-purple-500/30 hover:to-cyan-500/30 transition-all duration-300">
                <Eye className="h-4 w-4" />
                <span>View</span>
              </button>
            </Link>

            {isAdmin && (
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all duration-300">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-300">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}

            {!isAdmin && product.stock > 0 && (
              <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/30 rounded-xl hover:from-green-500/30 hover:to-emerald-500/30 transition-all duration-300">
                <ShoppingCart className="h-4 w-4" />
                <span>Add to Cart</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Products Component
export default function Products() {
  const { category } = useParams();
  const { data: session } = useSession();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(category || "");
  const [sortBy, setSortBy] = useState("name");
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  const isAdmin = session?.user?.role === "admin";

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      let filtered = mockProducts;

      if (selectedCategory) {
        filtered = filtered.filter(
          (product) => product.category === selectedCategory
        );
      }

      if (searchTerm) {
        filtered = filtered.filter(
          (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            product.features.some((feature) =>
              feature.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
      }

      if (selectedBrand) {
        filtered = filtered.filter(
          (product) => product.brand === selectedBrand
        );
      }

      filtered = filtered.filter(
        (product) =>
          product.price >= priceRange[0] && product.price <= priceRange[1]
      );

      filtered.sort((a, b) => {
        switch (sortBy) {
          case "price-low":
            return a.price - b.price;
          case "price-high":
            return b.price - a.price;
          case "rating":
            return b.rating - a.rating;
          case "reviews":
            return b.reviews - a.reviews;
          case "newest":
            return b.id - a.id;
          case "name":
          default:
            return a.name.localeCompare(b.name);
        }
      });

      setFilteredProducts(filtered);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedCategory, searchTerm, selectedBrand, sortBy, priceRange]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm, selectedBrand, sortBy, priceRange]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedBrand("");
    setSelectedCategory("");
    setPriceRange([0, 2000]);
    setSortBy("name");
    setCurrentPage(1);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentCategory = categories.find((cat) => cat.id === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-400 mb-4">
            <Home className="h-4 w-4" />
            <span>Home</span>
            <ArrowRight className="h-4 w-4" />
            <span>Products</span>
            {currentCategory && (
              <>
                <ArrowRight className="h-4 w-4" />
                <span>{currentCategory.name}</span>
              </>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 blur-3xl rounded-full"></div>
              <div className="relative">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
                  {currentCategory ? (
                    <span className="flex items-center">
                      <span className="mr-3 text-5xl">
                        {currentCategory?.icon}
                      </span>
                      {currentCategory.name}
                    </span>
                  ) : (
                    "All Products"
                  )}
                </h1>
                <p className="text-xl text-gray-300 max-w-2xl">
                  {currentCategory
                    ? `Discover our premium collection of ${currentCategory.name.toLowerCase()} with cutting-edge technology and innovative features.`
                    : "Explore our complete range of mobile devices, laptops, and premium tech accessories."}
                </p>
              </div>
            </div>

            {/* Add Product Button - Admin Only */}
            {isAdmin && (
              <Link href="/admin/products/add">
                <button className="relative group overflow-hidden px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-300 group-hover:from-green-400 group-hover:to-emerald-300"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/80 to-emerald-400/80 blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                  <div className="relative flex items-center space-x-2 text-black font-semibold">
                    <Plus className="h-4 w-4" />
                    <span>Add Product</span>
                  </div>
                </button>
              </Link>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <FilterSidebar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            sortBy={sortBy}
            setSortBy={setSortBy}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            brands={brands}
            categories={categories}
            onClearFilters={handleClearFilters}
          />

          {/* Products Grid */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="relative group mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-cyan-600/10 rounded-2xl blur-xl opacity-50"></div>
              <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div className="mb-4 sm:mb-0">
                    <p className="text-gray-300">
                      {loading ? (
                        "Loading products..."
                      ) : (
                        <>
                          Showing{" "}
                          <span className="font-semibold text-purple-400">
                            {startIndex + 1}-
                            {Math.min(endIndex, filteredProducts.length)}
                          </span>{" "}
                          of{" "}
                          <span className="font-semibold text-cyan-400">
                            {filteredProducts.length}
                          </span>{" "}
                          product
                          {filteredProducts.length !== 1 ? "s" : ""}
                          {searchTerm && (
                            <span>
                              {" "}
                              for '
                              <span className="font-semibold text-purple-400">
                                {searchTerm}
                              </span>
                              '
                            </span>
                          )}
                        </>
                      )}
                    </p>
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === "grid"
                          ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                          : "text-gray-400 hover:text-gray-300 hover:bg-gray-700/30"
                      }`}
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
                          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === "list"
                          ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                          : "text-gray-400 hover:text-gray-300 hover:bg-gray-700/30"
                      }`}
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
                          d="M4 6h16M4 10h16M4 14h16M4 18h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden"
                  >
                    <div className="aspect-square bg-gradient-to-br from-gray-700 to-gray-800 animate-pulse" />
                    <div className="p-6 space-y-3">
                      <div className="h-4 bg-gray-700 rounded animate-pulse" />
                      <div className="h-6 bg-gray-700 rounded animate-pulse" />
                      <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse" />
                      <div className="h-10 bg-gray-700 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Products Display */}
            {!loading && (
              <>
                {currentProducts.length > 0 ? (
                  <div
                    className={`grid gap-6 ${
                      viewMode === "grid"
                        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                        : "grid-cols-1"
                    }`}
                  >
                    {currentProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        isAdmin={isAdmin}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-cyan-600/10 rounded-2xl blur-xl opacity-50"></div>
                    <div className="relative text-center py-16 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl">
                      <div className="text-8xl mb-6">🔍</div>
                      <h3 className="text-3xl font-bold text-white mb-4">
                        No products found
                      </h3>
                      <p className="text-gray-300 text-lg mb-8 max-w-md mx-auto">
                        We couldn't find any products matching your criteria.
                        Try adjusting your filters or search terms.
                      </p>
                      <button
                        onClick={handleClearFilters}
                        className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                        currentPage === page
                          ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white"
                          : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
