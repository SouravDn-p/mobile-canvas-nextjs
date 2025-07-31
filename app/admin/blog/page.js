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
    "Technology",
    "Web Development",
    "Design",
    "Programming",
    "Tutorial",
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
        return "text-green-400 bg-green-500/20";
      case "draft":
        return "text-yellow-400 bg-yellow-500/20";
      case "archived":
        return "text-gray-400 bg-gray-500/20";
      default:
        return "text-gray-400 bg-gray-500/20";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <span className="text-white text-lg">Loading Blogs...</span>
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
        <div className="space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">
                Blog Management
              </h1>
              <p className="text-gray-400 mt-2">
                Manage your blog posts and content
              </p>
            </div>
            <Link href="/admin/blog/add">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                <Plus className="h-4 w-4 mr-2" />
                Add New Blog
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Blogs</p>
                    <p className="text-2xl font-bold text-white">
                      {blogs.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Eye className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Published</p>
                    <p className="text-2xl font-bold text-white">
                      {
                        blogs.filter((blog) => blog.status === "published")
                          .length
                      }
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <CheckSquare className="h-6 w-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Drafts</p>
                    <p className="text-2xl font-bold text-white">
                      {blogs.filter((blog) => blog.status === "draft").length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <Edit className="h-6 w-6 text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Views</p>
                    <p className="text-2xl font-bold text-white">
                      {blogs.reduce(
                        (total, blog) => total + (blog.views || 0),
                        0
                      )}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Eye className="h-6 w-6 text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Search and Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search blogs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      Search
                    </Button>
                  </form>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700/50 bg-transparent"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>

                    {selectedBlogs.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleBulkDelete}
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete ({selectedBlogs.length})
                      </Button>
                    )}
                  </div>
                </div>

                {/* Filters */}
                {showFilters && (
                  <div className="pt-4 border-t border-gray-700/50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Category
                        </label>
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
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
                          className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        >
                          <option value="">All Statuses</option>
                          {statuses.map((status) => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Blogs Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-4">
                  <span>Blogs ({blogs.length})</span>
                  {blogs.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleSelectAll}
                      className="text-gray-400 hover:text-white"
                    >
                      {selectedBlogs.length === blogs.length ? (
                        <CheckSquare className="h-4 w-4" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                      <span className="ml-2">Select All</span>
                    </Button>
                  )}
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent>
              {blogs.length > 0 ? (
                <div className="space-y-4">
                  {blogs.map((blog) => (
                    <div
                      key={blog._id}
                      className="flex items-center space-x-4 p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors"
                    >
                      {/* Selection Checkbox */}
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

                      {/* Blog Image */}
                      <div className="w-16 h-16 flex-shrink-0">
                        <Image
                          src={
                            blog.image || "/placeholder.svg?height=64&width=64"
                          }
                          alt={blog.title}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>

                      {/* Blog Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-medium truncate">
                              {blog.title}
                            </h3>
                            <p className="text-gray-400 text-sm truncate mt-1">
                              {blog.content.substring(0, 100)}...
                            </p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
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

                          {/* Stats */}
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

                      {/* Status */}
                      <div className="flex-shrink-0">
                        <select
                          value={blog.status}
                          onChange={(e) =>
                            handleStatusChange(blog._id, e.target.value)
                          }
                          className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(
                            blog.status
                          )}`}
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Actions */}
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
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto">
                      <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-white">
                      No blogs found
                    </h3>
                    <p className="text-gray-400">
                      Create your first blog post to get started
                    </p>
                    <Link href="/admin/blog/add">
                      <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
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
