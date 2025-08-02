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
  ChevronLeft,
  ChevronRight,
  Star,
  TrendingUp,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useUpdateProductMutation,
} from "@/redux/api/productapi";
import Swal from "sweetalert2";

export default function AdminProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;

  // Fetch products from the API
  const {
    data: productsData,
    isLoading: isProductsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useGetProductsQuery();

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const allProducts = productsData?.data || [];

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/login");
    }
  }, [session, status, router]);

  const categories = [
    "all",
    ...new Set(allProducts.map((product) => product.category)),
  ];

  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteProduct = async (productId) => {
    Swal.fire({
      title: "Delete Product",
      text: "Are you sure you want to delete this product? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteProduct(productId).unwrap();
          Swal.fire({
            title: "Product Deleted",
            text: "The product has been successfully deleted.",
            icon: "success",
          });
          refetchProducts();
        } catch (error) {
          console.error("Failed to delete product:", error);
          Swal.fire({
            title: "Error",
            text: "Failed to delete product. Please try again.",
            icon: "error",
          });
        }
      } else if (result.isDismissed) {
        Swal.fire({
          title: "Deletion Canceled",
          text: "The product was not deleted.",
          icon: "info",
        });
      }
    });
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

  if (isProductsLoading || status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin animate-reverse"></div>
        </div>
      </div>
    );
  }

  if (!session || productsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">
            {productsError ? "Error Loading Products" : "Access Denied"}
          </h2>
          <p className="text-gray-400">
            {productsError
              ? `Failed to fetch products: ${
                  productsError.message || "Unknown error"
                }`
              : "You do not have permission to view this page."}
          </p>
          {!session && (
            <Link href="/login">
              <button className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
    );
  }

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
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
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
                      key={product._id} // Use _id from backend
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
                              src={
                                product.image ||
                                product.images?.[0]?.url ||
                                "/placeholder.svg?height=80&width=80&text=Product"
                              } // Use first image from array
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
                                  ৳ {product.price}
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
                                  {product.rating || "N/A"}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-gray-400">
                                Sales: {product.sales || 0}
                              </div>
                              <div className="flex items-center space-x-2">
                                <Link href={`/admin/products/${product._id}`}>
                                  <button className="p-2 cursor-pointer text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-all duration-300">
                                    <Eye className="h-4 w-4" />
                                  </button>
                                </Link>
                                {isAdmin && (
                                  <>
                                    <Link
                                      href={`/admin/products/edit/${product._id}`}
                                    >
                                      <button className="p-2 cursor-pointer text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all duration-300">
                                        <Edit className="h-4 w-4" />
                                      </button>
                                    </Link>
                                    <button
                                      onClick={() =>
                                        handleDeleteProduct(product._id)
                                      }
                                      disabled={isDeleting}
                                      className="p-2 cursor-pointer text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                    {/* Dropdown for status change or more actions */}
                                    {/* You can implement a dropdown here for status change if needed */}
                                    {/* <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-500/10 rounded-lg transition-all duration-300">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </button> */}
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
