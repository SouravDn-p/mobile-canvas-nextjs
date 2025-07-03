"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Grid3X3,
  List,
  Package,
  Star,
  TrendingUp,
  Zap,
  ShoppingBag,
} from "lucide-react";
import Button from "../components/ui/button";
import Badge from "../components/ui/badge";
import Input from "../components/ui/input";
import CardHeader from "../components/ui/cardHeader";
import CardContent from "../components/ui/cardContent";
import Card from "../components/ui/card";
import {
  useDeleteProductMutation,
  useGetProductsQuery,
} from "@/redux/api/productapi";
import Image from "next/image";
import Loading from "../admin/products/loading";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";

export default function Test() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  // RTK Query hooks
  const { data, error, isLoading } = useGetProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();

  const products = data?.data || [];

  const categories = ["all", ...new Set(products.map((p) => p.category))];

  // Filter, search, and sort products
  const allFilteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.supplier.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      if (sortBy === "price" || sortBy === "stock") {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }
      return sortOrder === "asc"
        ? aValue > bValue
          ? 1
          : -1
        : aValue < bValue
        ? 1
        : -1;
    });

  // Pagination calculations
  const totalItems = allFilteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const filteredProducts = allFilteredProducts.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortBy, sortOrder]);

  const getStatusVariant = (status) => {
    switch (status) {
      case "In Stock":
        return "success";
      case "Low Stock":
        return "secondary";
      case "Out of Stock":
        return "destructive";
      default:
        return "default";
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this product!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteProduct(id).unwrap();
        Swal.fire("Deleted!", "Product has been deleted.", "success");
      } catch (err) {
        Swal.fire("Error", "Failed to delete product", "error");
      }
    }
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map((p) => p.id));
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-600"
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center">
                <ShoppingBag className="mr-3 h-10 w-10 text-blue-400" />
                Products
              </h1>
              <p className="mt-2 text-gray-400">
                Manage your inventory items ({totalItems} products) - Page{" "}
                {currentPage} of {totalPages}
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              {/* <Button variant="outline" className="cursor-pointer">
                <Upload className="mr-2 h-4 w-4" />
                Import
              </Button>
              <Button variant="outline" className="cursor-pointer">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button> */}
              <Link href="/products/add">
                <Button variant="success" className="cursor-pointer">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </Link>
            </div>
          </div>

          {/* Filters and Search */}
          <Card variant="gradient" className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Search products, SKU, or supplier..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12"
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm min-w-[150px]"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </option>
                  ))}
                </select>

                {/* Sort */}
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split("-");
                    setSortBy(field);
                    setSortOrder(order);
                  }}
                  className="bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm min-w-[150px]"
                >
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                  <option value="price-asc">Price Low-High</option>
                  <option value="price-desc">Price High-Low</option>
                  <option value="stock-asc">Stock Low-High</option>
                  <option value="stock-desc">Stock High-Low</option>
                </select>

                {/* View Mode */}
                <div className="flex border border-gray-600 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-3 transition-all duration-300 cursor-pointer ${
                      viewMode === "grid"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        : "bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50"
                    }`}
                  >
                    <Grid3X3 className="h-4 w-4 cursor-pointer" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-3 transition-all duration-300 cursor-pointer ${
                      viewMode === "list"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        : "bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50"
                    }`}
                  >
                    <List className="h-4 w-4 cursor-pointer" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bulk Actions */}
          {selectedProducts.length > 0 && (
            <Card variant="glass" className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300 flex items-center">
                    <Zap className="mr-2 h-4 w-4 text-yellow-400" />
                    {selectedProducts.length} products selected
                  </span>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="cursor-pointer"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Bulk Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="cursor-pointer"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Selected
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Products Grid */}
          {/* Loading and Error States */}
          {isLoading ? (
            <div className="text-center py-16">
              <p className="text-gray-400">⏳ Loading...</p>
            </div>
          ) : error ? (
            <p className="text-center text-red-500">
              ❌ Failed to fetch products: {error.message}
            </p>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center">
                <Package className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">
                No products found
              </h3>
              <p className="text-gray-400 mb-6">
                Try adjusting your search terms or add a new product.
              </p>
              <Link href="/products/add">
                <Button variant="success">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Product
                </Button>
              </Link>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <Card
                  key={product._id}
                  variant="product"
                  className="overflow-hidden"
                >
                  <CardHeader className="pb-4 relative">
                    {/* Trending Badge */}
                    {product.trending && (
                      <div className="absolute top-4 right-4 z-10">
                        <Badge variant="purple" className="animate-pulse">
                          <TrendingUp className="mr-1 h-3 w-3" />
                          Trending
                        </Badge>
                      </div>
                    )}

                    {/* Checkbox */}
                    <div className="absolute top-4 left-4 z-10">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product._id)}
                        onChange={() => handleSelectProduct(product._id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-800"
                      />
                    </div>

                    {/* Product Image */}
                    <div className="aspect-square relative mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-700">
                      <Image
                        src={
                          product.image ||
                          product.images?.[0]?.url ||
                          "/placeholder.svg"
                        }
                        alt={product.name}
                        height={500}
                        width={500}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Product Info */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant={getStatusVariant(product.status)}>
                          {product.status}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          {renderStars(product.rating)}
                          <span className="text-xs text-gray-400 ml-1">
                            ({product.rating})
                          </span>
                        </div>
                      </div>
                      <h3 className="font-semibold text-lg text-white group-hover:text-blue-300 transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {product.category}
                      </p>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {/* Price and Sales */}
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                          ${product.price}
                        </span>
                        <span className="text-xs text-gray-400">
                          {product.sales} sold
                        </span>
                      </div>

                      {/* Stock and SKU */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">Stock:</span>
                          <span className="ml-1 font-medium text-gray-300">
                            {product.stock}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">SKU:</span>
                          <span className="ml-1 font-medium text-gray-300">
                            {product.sku}
                          </span>
                        </div>
                      </div>

                      {/* Supplier */}
                      <div className="text-sm">
                        <span className="text-gray-500">Supplier:</span>
                        <span className="ml-1 font-medium text-gray-300">
                          {product.supplier}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-4 mt-4 border-t border-gray-700/50">
                        <Link
                          href={`/products/${product._id}`}
                          className="flex-1"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full bg-transparent cursor-pointer"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Button>
                        </Link>
                        <Link
                          href={`/products/edit/${product._id}`}
                          className="flex-1"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="cursor-pointer"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        {userRole === "admin" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="cursor-pointer"
                            onClick={() => handleDelete(product._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            // List View
            <Card variant="gradient">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800/50 border-b border-gray-700">
                      <tr>
                        <th className="px-6 py-4 text-left">
                          <input
                            type="checkbox"
                            checked={
                              selectedProducts.length ===
                              filteredProducts.length
                            }
                            onChange={handleSelectAll}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-800"
                          />
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Stock
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Rating
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/50">
                      {filteredProducts.map((product) => (
                        <tr
                          key={product._id}
                          className="hover:bg-gray-800/30 transition-colors duration-200"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selectedProducts.includes(product._id)}
                              onChange={() => handleSelectProduct(product._id)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-800"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="relative">
                                <Image
                                  src={
                                    product.image ||
                                    product.images?.[0]?.url ||
                                    "/placeholder.svg"
                                  }
                                  alt={product.name}
                                  width={128}
                                  height={128}
                                  className="w-12 h-12 object-cover rounded-xl mr-4"
                                />
                                {product.trending && (
                                  <div className="absolute -top-1 -right-1">
                                    <TrendingUp className="h-4 w-4 text-purple-400" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-white">
                                  {product.name}
                                </div>
                                <div className="text-sm text-gray-400">
                                  {product.sku}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {product.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-400">
                            ${product.price}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {product.stock}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={getStatusVariant(product.status)}>
                              {product.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-1">
                              {renderStars(product.rating)}
                              <span className="text-xs text-gray-400 ml-1">
                                ({product.rating})
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <Link href={`/products/${product._id}`}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="cursor-pointer"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button
                                variant="outline"
                                size="sm"
                                className="cursor-pointer"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <Card variant="gradient" className="mt-8">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  {/* Items per page selector */}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">Show:</span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm cursor-pointer"
                    >
                      <option value={8}>8 per page</option>
                      <option value={12}>12 per page</option>
                      <option value={24}>24 per page</option>
                      <option value={48}>48 per page</option>
                    </select>
                  </div>

                  {/* Page info */}
                  <div className="text-sm text-gray-400">
                    Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of{" "}
                    {totalItems} products
                  </div>

                  {/* Pagination buttons */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="cursor-pointer"
                    >
                      First
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="cursor-pointer"
                    >
                      Previous
                    </Button>

                    {/* Page numbers */}
                    <div className="flex items-center space-x-1">
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${
                                currentPage === pageNum
                                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                                  : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="cursor-pointer"
                    >
                      Next
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="cursor-pointer"
                    >
                      Last
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center">
                <Package className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">
                No products found
              </h3>
              <p className="text-gray-400 mb-6">
                Try adjusting your search terms or add a new product.
              </p>
              <Button variant="success" className="cursor-pointer">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Product
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
