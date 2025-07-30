"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Filter,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Star,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AdminProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const productsPerPage = 8;

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/login");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin animate-reverse"></div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Mock products data - expanded for pagination
  const allProducts = [
    {
      id: "1",
      name: "iPhone 15 Pro Max",
      category: "Smartphones",
      price: 1199,
      stock: 45,
      status: "active",
      rating: 4.8,
      sales: 234,
      image: "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg",
    },
    {
      id: "2",
      name: "Samsung Galaxy S24 Ultra",
      category: "Smartphones",
      price: 1099,
      stock: 23,
      status: "active",
      rating: 4.7,
      sales: 189,
      image:
        "https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg",
    },
    {
      id: "3",
      name: 'iPad Pro 12.9"',
      category: "Tablets",
      price: 899,
      stock: 0,
      status: "out_of_stock",
      rating: 4.6,
      sales: 156,
      image:
        "https://images.pexels.com/photos/1334598/pexels-photo-1334598.jpeg",
    },
    {
      id: "4",
      name: 'MacBook Pro 16"',
      category: "Laptops",
      price: 2399,
      stock: 12,
      status: "active",
      rating: 4.9,
      sales: 98,
      image: "https://images.pexels.com/photos/18105/pexels-photo.jpg",
    },
    {
      id: "5",
      name: "AirPods Pro",
      category: "Audio",
      price: 249,
      stock: 67,
      status: "active",
      rating: 4.5,
      sales: 445,
      image:
        "https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg",
    },
    {
      id: "6",
      name: "Apple Watch Series 9",
      category: "Wearables",
      price: 399,
      stock: 34,
      status: "active",
      rating: 4.4,
      sales: 267,
      image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg",
    },
    {
      id: "7",
      name: "Google Pixel 8 Pro",
      category: "Smartphones",
      price: 999,
      stock: 28,
      status: "active",
      rating: 4.6,
      sales: 134,
      image:
        "https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg",
    },
    {
      id: "8",
      name: "Surface Pro 9",
      category: "Tablets",
      price: 1299,
      stock: 15,
      status: "active",
      rating: 4.3,
      sales: 87,
      image:
        "https://images.pexels.com/photos/1334598/pexels-photo-1334598.jpeg",
    },
    {
      id: "9",
      name: "Dell XPS 13",
      category: "Laptops",
      price: 1599,
      stock: 19,
      status: "active",
      rating: 4.5,
      sales: 123,
      image: "https://images.pexels.com/photos/18105/pexels-photo.jpg",
    },
    {
      id: "10",
      name: "Sony WH-1000XM5",
      category: "Audio",
      price: 399,
      stock: 42,
      status: "active",
      rating: 4.7,
      sales: 298,
      image:
        "https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg",
    },
  ];

  const categories = [
    "all",
    "Smartphones",
    "Tablets",
    "Laptops",
    "Audio",
    "Wearables",
  ];

  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30";
      case "out_of_stock":
        return "bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border border-red-500/30";
      case "draft":
        return "bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-400 border border-gray-500/30";
      default:
        return "bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-400 border border-gray-500/30";
    }
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: "Out of Stock", color: "text-red-400" };
    if (stock < 10) return { text: "Low Stock", color: "text-yellow-400" };
    return { text: "In Stock", color: "text-green-400" };
  };

  const isAdmin = session?.user?.role === "admin";

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 blur-3xl rounded-full"></div>
            <div className="relative">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                {isAdmin ? "Product Management" : "Product Catalog"}
              </h1>
              <p className="text-gray-400">
                {isAdmin
                  ? "Manage your product catalog and inventory"
                  : "Browse our amazing products"}
              </p>
            </div>
          </div>

          {isAdmin && (
            <Link href="/admin/add">
              <button className="relative group overflow-hidden px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-300 group-hover:from-green-400 group-hover:to-emerald-300"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/80 to-emerald-400/80 blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                <div className="relative flex items-center space-x-2 text-black font-semibold cursor-pointer">
                  <Plus className="h-4 w-4" />
                  <span>Add Product</span>
                </div>
              </button>
            </Link>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
            <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Products</p>
                  <p className="text-2xl font-bold text-white">
                    {allProducts.length}
                  </p>
                </div>
                <Package className="h-8 w-8 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
            <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-green-500/30 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">In Stock</p>
                  <p className="text-2xl font-bold text-white">
                    {allProducts.filter((p) => p.stock > 0).length}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
            <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-yellow-500/30 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Low Stock</p>
                  <p className="text-2xl font-bold text-white">
                    {
                      allProducts.filter((p) => p.stock > 0 && p.stock < 10)
                        .length
                    }
                  </p>
                </div>
                <Package className="h-8 w-8 text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-pink-600/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
            <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-red-500/30 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Out of Stock</p>
                  <p className="text-2xl font-bold text-white">
                    {allProducts.filter((p) => p.stock === 0).length}
                  </p>
                </div>
                <Package className="h-8 w-8 text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="relative group mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-cyan-600/10 rounded-2xl blur-xl opacity-50"></div>
          <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
              >
                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                    className="bg-gray-800"
                  >
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>

              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-600/50 text-white hover:bg-gray-700/50 rounded-xl transition-all duration-300">
                <Filter className="h-4 w-4" />
                <span>More Filters</span>
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="relative group mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-cyan-600/5 rounded-2xl blur-xl opacity-50"></div>
          <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                Products ({filteredProducts.length})
              </h2>
              <p className="text-gray-400">
                Page {currentPage} of {totalPages}
              </p>
            </div>

            {currentProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 blur-3xl rounded-full opacity-50"></div>
                  <Package className="relative h-16 w-16 text-gray-400 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  No products found
                </h3>
                <p className="text-gray-400 mb-6">
                  {searchTerm || selectedCategory !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Get started by adding your first product"}
                </p>
                {isAdmin && (
                  <Link href="/admin/add">
                    <button className="relative group overflow-hidden px-6 py-3 rounded-xl transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-400"></div>
                      <div className="relative flex items-center space-x-2 text-black font-semibold">
                        <Plus className="h-4 w-4" />
                        <span>Add Product</span>
                      </div>
                    </button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentProducts.map((product) => {
                  const stockStatus = getStockStatus(product.stock);
                  return (
                    <div
                      key={product.id}
                      className="relative group overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.02]"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative bg-gray-700/30 backdrop-blur-sm border border-gray-600/30 rounded-2xl p-6 group-hover:border-purple-500/30 transition-all duration-300">
                        <div className="flex items-start space-x-4">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <Image
                              width={80}
                              height={80}
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              className="relative w-20 h-20 object-cover rounded-xl border border-gray-600/50"
                            />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-white text-lg group-hover:text-purple-300 transition-colors duration-300">
                                  {product.name}
                                </h3>
                                <p className="text-sm text-gray-400">
                                  {product.category}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                                  ${product.price}
                                </p>
                                <p className="text-sm text-gray-400">
                                  Stock: {product.stock}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-3 mb-4">
                              <div
                                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  product.status
                                )}`}
                              >
                                {product.status.replace("_", " ").toUpperCase()}
                              </div>
                              <span
                                className={`text-xs font-medium ${stockStatus.color}`}
                              >
                                {stockStatus.text}
                              </span>
                              <div className="flex items-center space-x-1">
                                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                <span className="text-xs text-gray-400">
                                  {product.rating}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="text-sm text-gray-400">
                                Sales: {product.sales}
                              </div>
                              <div className="flex items-center space-x-2">
                                <Link href={`/products/${product.id}`}>
                                  <button className="p-2 text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-all duration-300">
                                    <Eye className="h-4 w-4" />
                                  </button>
                                </Link>

                                {isAdmin && (
                                  <>
                                    <button className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all duration-300">
                                      <Edit className="h-4 w-4" />
                                    </button>
                                    <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-300">
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                    <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-500/10 rounded-lg transition-all duration-300">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
            ))}

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
  );
}
