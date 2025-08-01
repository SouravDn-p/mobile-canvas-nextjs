"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/app/components/ui/button";
import Card from "@/app/components/ui/card";
import CardContent from "@/app/components/ui/cardContent";
import CardHeader from "@/app/components/ui/cardHeader";
import CardTitle from "@/app/components/ui/card/cardTitle";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Heart,
  MessageCircle,
  Calendar,
  User,
  Filter,
  CheckSquare,
  Square,
  ChevronDown,
  X,
  MoreVertical,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  useGetBlogsQuery,
  useDeleteBlogMutation,
  useUpdateBlogMutation,
} from "@/redux/api/productapi";

const AdminBlogsPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedBlogs, setSelectedBlogs] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileActions, setShowMobileActions] = useState({});

  const {
    data: blogsData,
    isLoading,
    error,
    refetch,
  } = useGetBlogsQuery({
    search: searchTerm,
    category: selectedCategory,
    status: selectedStatus || undefined,
  });

  const [deleteBlog] = useDeleteBlogMutation();
  const [updateBlog] = useUpdateBlogMutation();

  const blogs = blogsData?.blogs || [];

  const categories = [
    "Gaming",
    "Accessories",
    "Gadget Reviews",
    "Tech Tips",
    "Product Launches",
    "News",
  ];

  const statuses = ["draft", "published", "archived"];

  const handleSearch = (e) => {
    e.preventDefault();
    refetch();
  };

  const handleDeleteBlog = async (blogId) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await deleteBlog(blogId);
        refetch();
      } catch (error) {
        console.error("Failed to delete blog:", error);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedBlogs.length === 0) return;
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedBlogs.length} blog(s)?`
      )
    ) {
      try {
        await Promise.all(selectedBlogs.map((blogId) => deleteBlog(blogId)));
        setSelectedBlogs([]);
        refetch();
      } catch (error) {
        console.error("Failed to delete blogs:", error);
      }
    }
  };

  const handleStatusChange = async (blogId, newStatus) => {
    try {
      await updateBlog({
        id: blogId,
        data: { status: newStatus },
      });
      refetch();
    } catch (error) {
      console.error("Failed to update blog status:", error);
    }
  };

  const toggleBlogSelection = (blogId) => {
    setSelectedBlogs((prev) =>
      prev.includes(blogId)
        ? prev.filter((id) => id !== blogId)
        : [...prev, blogId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedBlogs(
      selectedBlogs.length === blogs.length ? [] : blogs.map((blog) => blog._id)
    );
  };

  const toggleMobileActions = (blogId) => {
    setShowMobileActions((prev) => ({
      ...prev,
      [blogId]: !prev[blogId],
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "text-green-400 bg-green-500/20 border-green-500/30";
      case "draft":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
      case "archived":
        return "text-gray-400 bg-gray-500/20 border-gray-500/30";
      default:
        return "text-gray-400 bg-gray-500/20 border-gray-500/30";
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedStatus("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <span className="text-white text-base sm:text-lg">
            Loading Blogs...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto py-4 sm:py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Header */}
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                Blog Management
              </h1>
              <p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">
                Manage your blog posts and content
              </p>
            </div>
            <Link href="/admin/blog/add" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 py-3 sm:py-2">
                <Plus className="h-4 w-4 mr-2" />
                Add New Blog
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-2 sm:mb-0">
                    <p className="text-xs sm:text-sm text-gray-400">
                      Total Blogs
                    </p>
                    <p className="text-lg sm:text-2xl font-bold text-white">
                      {blogs.length}
                    </p>
                  </div>
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-500/20 rounded-lg flex items-center justify-center self-end sm:self-auto">
                    <Eye className="h-4 w-4 sm:h-6 sm:w-6 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-2 sm:mb-0">
                    <p className="text-xs sm:text-sm text-gray-400">
                      Published
                    </p>
                    <p className="text-lg sm:text-2xl font-bold text-white">
                      {
                        blogs.filter((blog) => blog.status === "published")
                          .length
                      }
                    </p>
                  </div>
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-500/20 rounded-lg flex items-center justify-center self-end sm:self-auto">
                    <CheckSquare className="h-4 w-4 sm:h-6 sm:w-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-2 sm:mb-0">
                    <p className="text-xs sm:text-sm text-gray-400">Drafts</p>
                    <p className="text-lg sm:text-2xl font-bold text-white">
                      {blogs.filter((blog) => blog.status === "draft").length}
                    </p>
                  </div>
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center self-end sm:self-auto">
                    <Edit className="h-4 w-4 sm:h-6 sm:w-6 text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-2 sm:mb-0">
                    <p className="text-xs sm:text-sm text-gray-400">
                      Total Views
                    </p>
                    <p className="text-lg sm:text-2xl font-bold text-white">
                      {blogs.reduce(
                        (total, blog) => total + (blog.views || 0),
                        0
                      )}
                    </p>
                  </div>
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-purple-500/20 rounded-lg flex items-center justify-center self-end sm:self-auto">
                    <Eye className="h-4 w-4 sm:h-6 sm:w-6 text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="pt-4 sm:pt-6">
              <div className="space-y-4">
                {/* Search and Actions */}
                <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:gap-4">
                  <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search blogs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 sm:py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm sm:text-base"
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
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-4 sm:px-6"
                    >
                      <Search className="h-4 w-4 sm:hidden" />
                      <span className="hidden sm:inline">Search</span>
                    </Button>
                  </form>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700/50 bg-transparent py-2.5 sm:py-2 relative"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                      {(selectedCategory || selectedStatus) && (
                        <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                          {(selectedCategory ? 1 : 0) +
                            (selectedStatus ? 1 : 0)}
                        </span>
                      )}
                      <ChevronDown
                        className={`h-4 w-4 ml-2 transition-transform ${
                          showFilters ? "rotate-180" : ""
                        }`}
                      />
                    </Button>

                    {selectedBlogs.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleBulkDelete}
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent py-2.5 sm:py-2"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete ({selectedBlogs.length})
                      </Button>
                    )}
                  </div>
                </div>

                {/* Filters */}
                {showFilters && (
                  <div className="pt-4 border-t border-gray-700/50 animate-in slide-in-from-top-2 duration-200">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-300">
                          Filter Options
                        </h3>
                        {(selectedCategory || selectedStatus) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={clearFilters}
                            className="border-gray-600 text-gray-400 hover:bg-gray-700/50 bg-transparent text-xs"
                          >
                            Clear All
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Category
                          </label>
                          <select
                            value={selectedCategory}
                            onChange={(e) =>
                              setSelectedCategory(e.target.value)
                            }
                            className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
                          >
                            <option value="">All Categories</option>
                            {categories.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Status
                          </label>
                          <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
                          >
                            <option value="">All Statuses</option>
                            {statuses.map((status) => (
                              <option key={status} value={status}>
                                {status.charAt(0).toUpperCase() +
                                  status.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Blogs List */}
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-white space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <span className="text-lg sm:text-xl lg:text-2xl">
                    Blogs ({blogs.length})
                  </span>
                  {blogs.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleSelectAll}
                      className="text-gray-400 hover:text-white p-2"
                    >
                      {selectedBlogs.length === blogs.length ? (
                        <CheckSquare className="h-4 w-4" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                      <span className="ml-2 text-xs sm:text-sm">
                        {selectedBlogs.length === blogs.length
                          ? "Deselect All"
                          : "Select All"}
                      </span>
                    </Button>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {blogs.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {blogs.map((blog) => (
                    <div
                      key={blog._id}
                      className="bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-all duration-300 border border-gray-700/30"
                    >
                      {/* Mobile Layout */}
                      <div className="block sm:hidden p-4">
                        <div className="flex items-start space-x-3 mb-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleBlogSelection(blog._id)}
                            className="text-gray-400 hover:text-white p-1 mt-1"
                          >
                            {selectedBlogs.includes(blog._id) ? (
                              <CheckSquare className="h-4 w-4" />
                            ) : (
                              <Square className="h-4 w-4" />
                            )}
                          </Button>
                          <div className="w-16 h-16 flex-shrink-0">
                            <Image
                              src={
                                blog.image ||
                                "/placeholder.svg?height=64&width=64"
                              }
                              alt={blog.title}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-medium text-sm line-clamp-2 mb-1">
                              {blog.title}
                            </h3>
                            <div className="flex items-center justify-between">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                  blog.status
                                )}`}
                              >
                                {blog.status.charAt(0).toUpperCase() +
                                  blog.status.slice(1)}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleMobileActions(blog._id)}
                                className="text-gray-400 hover:text-white p-1"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-400 text-xs line-clamp-2 mb-3 pl-7">
                          {blog.content?.substring(0, 100)}...
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mb-3 pl-7">
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>{blog.author}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(blog.createdAt)}</span>
                          </div>
                          <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full">
                            {blog.category}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pl-7">
                          <div className="flex items-center space-x-4 text-xs text-gray-400">
                            <div className="flex items-center space-x-1">
                              <Eye className="h-3 w-3" />
                              <span>{blog.views || 0}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Heart className="h-3 w-3" />
                              <span>{blog.likes || 0}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MessageCircle className="h-3 w-3" />
                              <span>{blog.comments?.length || 0}</span>
                            </div>
                          </div>
                          <select
                            value={blog.status}
                            onChange={(e) =>
                              handleStatusChange(blog._id, e.target.value)
                            }
                            className={`px-2 py-1 rounded-full text-xs font-medium border-0 bg-transparent ${getStatusColor(
                              blog.status
                            )}`}
                          >
                            {statuses.map((status) => (
                              <option
                                key={status}
                                value={status}
                                className="bg-gray-800 text-white"
                              >
                                {status.charAt(0).toUpperCase() +
                                  status.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Mobile Actions */}
                        {showMobileActions[blog._id] && (
                          <div className="mt-3 pt-3 border-t border-gray-700/50 flex items-center justify-center space-x-2">
                            <Link href={`/blog/${blog._id}`} className="flex-1">
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full border-gray-600 text-gray-300 hover:bg-gray-700/50 bg-transparent"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                            </Link>
                            <Link
                              href={`/admin/blog/edit/${blog._id}`}
                              className="flex-1"
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full border-gray-600 text-gray-300 hover:bg-gray-700/50 bg-transparent"
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteBlog(blog._id)}
                              className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden sm:flex items-center space-x-4 p-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleBlogSelection(blog._id)}
                          className="text-gray-400 hover:text-white p-1"
                        >
                          {selectedBlogs.includes(blog._id) ? (
                            <CheckSquare className="h-4 w-4" />
                          ) : (
                            <Square className="h-4 w-4" />
                          )}
                        </Button>

                        <div className="w-16 h-16 flex-shrink-0">
                          <Image
                            src={
                              blog.image ||
                              "/placeholder.svg?height=64&width=64"
                            }
                            alt={blog.title}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-white font-medium truncate mb-1">
                                {blog.title}
                              </h3>
                              <p className="text-gray-400 text-sm truncate mb-2">
                                {blog.content?.substring(0, 100)}...
                              </p>
                              <div className="flex items-center space-x-4 text-xs text-gray-400">
                                <div className="flex items-center space-x-1">
                                  <User className="h-3 w-3" />
                                  <span>{blog.author}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{formatDate(blog.createdAt)}</span>
                                </div>
                                <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full">
                                  {blog.category}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-4 text-xs text-gray-400 ml-4">
                              <div className="flex items-center space-x-1">
                                <Eye className="h-3 w-3" />
                                <span>{blog.views || 0}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Heart className="h-3 w-3" />
                                <span>{blog.likes || 0}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MessageCircle className="h-3 w-3" />
                                <span>{blog.comments?.length || 0}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex-shrink-0">
                          <select
                            value={blog.status}
                            onChange={(e) =>
                              handleStatusChange(blog._id, e.target.value)
                            }
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              blog.status
                            )} bg-transparent`}
                          >
                            {statuses.map((status) => (
                              <option
                                key={status}
                                value={status}
                                className="bg-gray-800 text-white"
                              >
                                {status.charAt(0).toUpperCase() +
                                  status.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <Link href={`/blog/${blog._id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-400 hover:text-white"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin/blog/edit/${blog._id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-400 hover:text-white"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteBlog(blog._id)}
                            className="text-gray-400 hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <div className="space-y-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto">
                      <Search className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                    </div>
                    <h3 className="text-base sm:text-lg font-medium text-white">
                      No blogs found
                    </h3>
                    <p className="text-gray-400 text-sm sm:text-base">
                      Create your first blog post to get started
                    </p>
                    <Link href="/admin/blog/add">
                      <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 mt-4">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Blog
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogsPage;
