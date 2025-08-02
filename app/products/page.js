"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "../components/products/ProductCard";
import Button from "../components/ui/button";
import Input from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/radix/select";
import { Search, ChevronLeft, ChevronRight, DollarSign } from "lucide-react";
import { useGetProductsQuery } from "@/redux/api/productapi";
import Link from "next/link";
import Loading from "./loading";

const categories = [
  "All",
  "Smartphones",
  "Tablets",
  "Laptops",
  "Audio",
  "Accessories",
  "Mobile Cover",
];

const PRODUCTS_PER_PAGE = 12;

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState([0, 3000]);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortBy, priceRange]);
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const { data, isLoading, error } = useGetProductsQuery();
  const allProducts = data?.data;

  if (isLoading) return <Loading />;
  if (error)
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

  const filteredProducts = allProducts
    ?.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts?.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts?.slice(startIndex, endIndex);

  // Reset to first page when filters change

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setPriceRange([0, 3000]);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 blur-3xl rounded-full"></div>
            <div className="relative">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
                All Products
              </h1>
              <p className="text-xl text-gray-300">
                Discover our complete collection of premium gadgets and
                technology
              </p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="relative group mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-cyan-600/10 rounded-2xl blur-xl opacity-50"></div>
          <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700/50 border-gray-600/50 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                />
              </div>

              {/* Category Filter */}
              <div className="md:flex md:flex-wrap md:gap-2  grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                {categories?.map((category) => (
                  <Button
                    key={category}
                    variant={
                      selectedCategory === category ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={
                      selectedCategory === category
                        ? "bg-gradient-to-r cursor-pointer w-full sm:w-fit p-2 from-purple-500 to-cyan-500 text-white hover:from-purple-600 hover:to-cyan-600"
                        : "border-gray-600/50 cursor-pointer  w-full sm:w-fit text-gray-300 hover:bg-gray-700/50 hover:text-white"
                    }
                  >
                    {category}
                  </Button>
                ))}
                <div>
                  <Select
                    value={sortBy}
                    onValueChange={setSortBy}
                    className="w-full "
                  >
                    <SelectTrigger className="w-40 bg-gray-700/50 border-gray-600/50 text-white cursor-pointer">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 cursor-pointer">
                      <SelectItem className={"cursor-pointer"} value="name">
                        Name
                      </SelectItem>
                      <SelectItem
                        className={"cursor-pointer"}
                        value="price-low"
                      >
                        Price: Low to High
                      </SelectItem>
                      <SelectItem
                        className={"cursor-pointer"}
                        value="price-high"
                      >
                        Price: High to Low
                      </SelectItem>
                      <SelectItem className={"cursor-pointer"} value="rating">
                        Rating
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPriceFilter(!showPriceFilter)}
                  className="border-gray-600/50 w-full col-span-2 md:col-span-1 text-gray-300 cursor-pointer hover:bg-gray-700/50 hover:text-white"
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Price Range
                </Button>
              </div>
            </div>

            {/* Price Range Filter */}
            {showPriceFilter && (
              <div className="mt-6 pt-6 border-t border-gray-700/50">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <label className="text-sm font-medium text-gray-300 whitespace-nowrap">
                    Price Range:
                  </label>
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">$</span>
                      <Input
                        type="number"
                        placeholder="Min"
                        value={priceRange[0]}
                        onChange={(e) =>
                          setPriceRange([
                            Number.parseInt(e.target.value) || 0,
                            priceRange[1],
                          ])
                        }
                        className="w-20 bg-gray-700/50 border-gray-600/50 text-white text-sm"
                      />
                    </div>
                    <span className="text-gray-400">-</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">$</span>
                      <Input
                        type="number"
                        placeholder="Max"
                        value={priceRange[1]}
                        onChange={(e) =>
                          setPriceRange([
                            priceRange[0],
                            Number.parseInt(e.target.value) || 3000,
                          ])
                        }
                        className="w-20 bg-gray-700/50 border-gray-600/50 text-white text-sm"
                      />
                    </div>
                    <div className="flex-1 px-4">
                      <input
                        type="range"
                        min="0"
                        max="3000"
                        step="50"
                        value={priceRange[1]}
                        onChange={(e) =>
                          setPriceRange([
                            priceRange[0],
                            Number.parseInt(e.target.value),
                          ])
                        }
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, #8b5cf6 0%, #06b6d4 ${
                            (priceRange[1] / 3000) * 100
                          }%, #374151 ${
                            (priceRange[1] / 3000) * 100
                          }%, #374151 100%)`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-purple-400 font-medium">
                      ${priceRange[0]} - ${priceRange[1]}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Count and Pagination Info */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-gray-400">
            Showing{" "}
            <span className="text-purple-400 font-semibold">
              {startIndex + 1}-{Math.min(endIndex, filteredProducts?.length)}
            </span>{" "}
            of{" "}
            <span className="text-cyan-400 font-semibold">
              {filteredProducts?.length}
            </span>{" "}
            products
          </p>
          {totalPages > 1 && (
            <p className="text-gray-400 text-sm">
              Page <span className="text-purple-400">{currentPage}</span> of{" "}
              <span className="text-cyan-400">{totalPages}</span>
            </p>
          )}
        </div>

        {/* Products Grid */}
        <div
          className={`grid gap-8 mb-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`}
        >
          {currentProducts?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 cursor-pointer text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)?.map(
              (page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer ${
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
              className="p-2 text-gray-400 cursor-pointer hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* No Results */}
        {filteredProducts?.length === 0 && (
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-cyan-600/10 rounded-2xl blur-xl opacity-50"></div>
            <div className="relative text-center py-16 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl">
              <div className="text-8xl mb-6">🔍</div>
              <h3 className="text-3xl font-bold text-white mb-4">
                No products found
              </h3>
              <p className="text-gray-300 text-lg mb-8 max-w-md mx-auto">
                Try adjusting your search, category, or price range criteria
              </p>
              <Button
                onClick={handleClearFilters}
                className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
