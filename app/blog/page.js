"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/app/components/ui/button";
import Card from "@/app/components/ui/card";
import CardContent from "@/app/components/ui/cardContent";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Calendar,
  User,
  Eye,
  Heart,
  MessageCircle,
  Clock,
  ChevronDown,
  ArrowUpDown,
} from "lucide-react";
import Image from "next/image";
import { useGetBlogsQuery } from "@/redux/api/productapi";

const BlogPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const {
    data: blogsData,
    isLoading,
    error,
    refetch,
  } = useGetBlogsQuery({
    page: currentPage,
    limit: 12,
    search: searchTerm,
    category: selectedCategory,
    sortBy,
    sortOrder,
  });

  const blogs = blogsData?.blogs || [];
  const pagination = blogsData?.pagination || {};

  const categories = [
    "Technology",
    "Web Development",
    "Design",
    "Programming",
    "Tutorial",
    "News",
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    refetch();
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category === selectedCategory ? "" : category);
    setCurrentPage(1);
  };

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("desc");
    }
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
          <div className="text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              Our Blog
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Discover the latest insights, tutorials, and updates from our team
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Search Bar */}
                <form onSubmit={handleSearch} className="flex gap-4">
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

                {/* Filter Controls */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700/50 bg-transparent"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                      <ChevronDown
                        className={`h-4 w-4 ml-2 transition-transform ${
                          showFilters ? "rotate-180" : ""
                        }`}
                      />
                    </Button>

                    {/* Sort Options */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSortChange("createdAt")}
                        className={`border-gray-600 hover:bg-gray-700/50 bg-transparent ${
                          sortBy === "createdAt"
                            ? "text-purple-400 border-purple-500/50"
                            : "text-gray-300"
                        }`}
                      >
                        <Calendar className="h-4 w-4 mr-1" />
                        Date
                        {sortBy === "createdAt" && (
                          <ArrowUpDown
                            className={`h-3 w-3 ml-1 ${
                              sortOrder === "desc" ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSortChange("views")}
                        className={`border-gray-600 hover:bg-gray-700/50 bg-transparent ${
                          sortBy === "views"
                            ? "text-purple-400 border-purple-500/50"
                            : "text-gray-300"
                        }`}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Views
                        {sortBy === "views" && (
                          <ArrowUpDown
                            className={`h-3 w-3 ml-1 ${
                              sortOrder === "desc" ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSortChange("likes")}
                        className={`border-gray-600 hover:bg-gray-700/50 bg-transparent ${
                          sortBy === "likes"
                            ? "text-purple-400 border-purple-500/50"
                            : "text-gray-300"
                        }`}
                      >
                        <Heart className="h-4 w-4 mr-1" />
                        Likes
                        {sortBy === "likes" && (
                          <ArrowUpDown
                            className={`h-3 w-3 ml-1 ${
                              sortOrder === "desc" ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className={`border-gray-600 hover:bg-gray-700/50 bg-transparent ${
                        viewMode === "grid"
                          ? "text-purple-400 border-purple-500/50"
                          : "text-gray-300"
                      }`}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className={`border-gray-600 hover:bg-gray-700/50 bg-transparent ${
                        viewMode === "list"
                          ? "text-purple-400 border-purple-500/50"
                          : "text-gray-300"
                      }`}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Category Filters */}
                {showFilters && (
                  <div className="pt-4 border-t border-gray-700/50">
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-gray-300">
                        Categories
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                          <Button
                            key={category}
                            variant="outline"
                            size="sm"
                            onClick={() => handleCategoryChange(category)}
                            className={`border-gray-600 hover:bg-gray-700/50 bg-transparent ${
                              selectedCategory === category
                                ? "text-purple-400 border-purple-500/50 bg-purple-500/10"
                                : "text-gray-300"
                            }`}
                          >
                            {category}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Blog Grid/List */}
          {blogs.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-6"
              }
            >
              {blogs.map((blog) => (
                <Card
                  key={blog._id}
                  className={`hover:shadow-lg transition-all duration-300 cursor-pointer ${
                    viewMode === "list" ? "flex flex-row" : ""
                  }`}
                  onClick={() => router.push(`/blog/${blog._id}`)}
                >
                  <div className={viewMode === "list" ? "w-1/3" : ""}>
                    <Image
                      src={
                        blog.image || "/placeholder.svg?height=200&width=400"
                      }
                      alt={blog.title}
                      width={400}
                      height={200}
                      className={`object-cover ${
                        viewMode === "list"
                          ? "w-full h-full rounded-l-lg"
                          : "w-full h-48 rounded-t-lg"
                      }`}
                    />
                  </div>
                  <div className={viewMode === "list" ? "flex-1" : ""}>
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs font-medium rounded-full">
                            {blog.category}
                          </span>
                          <span className="text-xs text-gray-400">
                            {formatDate(blog.createdAt)}
                          </span>
                        </div>

                        <h3 className="text-lg font-semibold text-white line-clamp-2">
                          {blog.title}
                        </h3>

                        <p className="text-gray-400 text-sm line-clamp-3">
                          {blog.content.substring(0, 150)}...
                        </p>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-700/50">
                          <div className="flex items-center space-x-1 text-xs text-gray-400">
                            <User className="h-3 w-3" />
                            <span>{blog.author}</span>
                          </div>

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
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{blog.readTime || 5} min</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
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
                  Try adjusting your search or filter criteria
                </p>
              </div>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="border-gray-600 text-gray-300 hover:bg-gray-700/50 bg-transparent disabled:opacity-50"
              >
                Previous
              </Button>

              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant="outline"
                    onClick={() => setCurrentPage(page)}
                    className={`border-gray-600 hover:bg-gray-700/50 bg-transparent ${
                      currentPage === page
                        ? "text-purple-400 border-purple-500/50"
                        : "text-gray-300"
                    }`}
                  >
                    {page}
                  </Button>
                );
              })}

              <Button
                variant="outline"
                onClick={() =>
                  setCurrentPage(Math.min(pagination.pages, currentPage + 1))
                }
                disabled={currentPage === pagination.pages}
                className="border-gray-600 text-gray-300 hover:bg-gray-700/50 bg-transparent disabled:opacity-50"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
