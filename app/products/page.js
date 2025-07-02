"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import getAllProducts from "@/lib/getAllProducts";
import ProductCard from "../components/products/product-card";
import FilterSidebar from "../components/products/filter-sidebar";
import { ArrowRight, Home } from "lucide-react";

const categories = [
  { id: "phones", name: "Smartphones", icon: "📱" },
  { id: "tablets", name: "Tablets", icon: "📟" },
  { id: "laptops", name: "Laptops", icon: "💻" },
  { id: "accessories", name: "Accessories", icon: "🎧" },
  { id: "wearables", name: "Wearables", icon: "⌚" },
];

const brands = ["Apple", "Samsung", "Google", "Sony", "Dell", "Anker"];

// Main Products Component
export default function Products() {
  const { category } = useParams();
  const products = getAllProducts();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(category || "");
  const [sortBy, setSortBy] = useState("name");
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      let filtered = products;

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

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedBrand("");
    setSelectedCategory("");
    setPriceRange([0, 2000]);
    setSortBy("name");
  };

  const currentCategory = categories.find((cat) => cat.id === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-400 mb-4">
            <span>Home</span>
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
            <span>Products</span>
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
                <span>{currentCategory.name}</span>
              </>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 bg-gray-900/90 backdrop-blur-xl rounded-xl p-4 shadow-lg border border-gray-700">
              <div className="mb-4 sm:mb-0">
                <p className="text-gray-300">
                  {loading ? (
                    "Loading products..."
                  ) : (
                    <>
                      Showing{" "}
                      <span className="font-semibold">
                        {filteredProducts.length}
                      </span>{" "}
                      product
                      {filteredProducts.length !== 1 ? "s" : ""}
                      {searchTerm && (
                        <span>
                          for &apos;
                          <span className="font-semibold">{searchTerm}</span>
                          &apos;
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
                      ? "bg-indigo-900/50 text-indigo-400 border border-indigo-700"
                      : "text-gray-400 hover:text-gray-300"
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
                      ? "bg-indigo-900/50 text-indigo-400 border border-indigo-700"
                      : "text-gray-400 hover:text-gray-300"
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

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-700 overflow-hidden"
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
                {filteredProducts.length > 0 ? (
                  <div
                    className={`grid gap-6 ${
                      viewMode === "grid"
                        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                        : "grid-cols-1"
                    }`}
                  >
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-700">
                    <div className="text-8xl mb-6">🔍</div>
                    <h3 className="text-3xl font-bold text-white mb-4">
                      No products found
                    </h3>
                    <p className="text-gray-300 text-lg mb-8 max-w-md mx-auto">
                      We couldn&apos;t find any products matching your criteria.
                      Try adjusting your filters or search terms.
                    </p>
                    <button
                      onClick={handleClearFilters}
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
