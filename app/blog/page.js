"use client";
import { useState, useEffect } from "react";
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
  X,
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
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, selectedCategory, sortBy, sortOrder]);

  const {
    data: blogsData,
    isLoading,
    error,
    refetch,
  } = useGetBlogsQuery({
    page: currentPage,
    limit: 12,
    search: debouncedSearchTerm,
    category: selectedCategory,
    sortBy,
    sortOrder,
  });

  const blogs = blogsData?.blogs || [];
  const filteredBlogs = blogs.filter((blog) => {
    if (selectedCategory && blog.category !== selectedCategory) return false; 
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      return (
        blog.title.toLowerCase().includes(searchLower) ||
        blog.content.toLowerCase().includes(searchLower) ||
        blog.author.toLowerCase().includes(searchLower)
      );
    }
    return true; 
  });
  const pagination = blogsData?.pagination || {};


  const categories = [
    "Gaming",
    "Accessories",
    "Gadget Reviews",
    "Tech Tips",
    "Product Launches",
    "News",
    "Tutorials",
    "Industry Updates",
  ];

  const sortOptions = [
    { key: "createdAt", label: "Date", icon: Calendar },
    { key: "views", label: "Views", icon: Eye },
    { key: "likes", label: "Likes", icon: Heart },
    { key: "title", label: "Title", icon: null },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is now handled by debounced effect
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category === selectedCategory ? "" : category);
  };

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("desc");
    }
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSortBy("createdAt");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (selectedCategory) count++;
    if (sortBy !== "createdAt" || sortOrder !== "desc") count++;
    return count;
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
            <X className="h-8 w-8 text-red-400" />
          </div>
          <h3 className="text-lg font-medium text-white">
            Error Loading Blogs
          </h3>
          <p className="text-gray-400">Please try again later</p>
          <Button
            onClick={() => refetch()}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Retry
          </Button>
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
            <CardContent className="pt-6">
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
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    Search
                  </Button>
                </form>

                {/* Filter Controls */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700/50 bg-transparent relative"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                      {getActiveFiltersCount() > 0 && (
                        <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {getActiveFiltersCount()}
                        </span>
                      )}
                      <ChevronDown
                        className={`h-4 w-4 ml-2 transition-transform ${
                          showFilters ? "rotate-180" : ""
                        }`}
                      />
                    </Button>

                    {/* Clear Filters */}
                    {getActiveFiltersCount() > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearAllFilters}
                        className="border-red-600/50 text-red-400 hover:bg-red-500/10 bg-transparent"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Clear All
                      </Button>
                    )}

                    {/* Sort Options */}
                    <div className="flex flex-wrap items-center gap-2">
                      {sortOptions.map((option) => {
                        const IconComponent = option.icon;
                        return (
                          <Button
                            key={option.key}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSortChange(option.key)}
                            className={`border-gray-600 hover:bg-gray-700/50 bg-transparent ${
                              sortBy === option.key
                                ? "text-purple-400 border-purple-500/50"
                                : "text-gray-300"
                            }`}
                          >
                            {IconComponent && (
                              <IconComponent className="h-4 w-4 mr-1" />
                            )}
                            {option.label}
                            {sortBy === option.key && (
                              <ArrowUpDown
                                className={`h-3 w-3 ml-1 transition-transform ${
                                  sortOrder === "desc" ? "rotate-180" : ""
                                }`}
                              />
                            )}
                          </Button>
                        );
                      })}
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
                  <div className="pt-4 border-t border-gray-700/50 animate-in slide-in-from-top-2 duration-200">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-300">
                          Categories
                        </h3>
                        {selectedCategory && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedCategory("")}
                            className="border-gray-600 text-gray-400 hover:bg-gray-700/50 bg-transparent text-xs"
                          >
                            Clear Category
                          </Button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                          <Button
                            key={category}
                            variant="outline"
                            size="sm"
                            onClick={() => handleCategoryChange(category)}
                            className={`border-gray-600 hover:bg-gray-700/50 bg-transparent transition-all duration-200 ${
                              selectedCategory === category
                                ? "text-purple-400 border-purple-500/50 bg-purple-500/10"
                                : "text-gray-300"
                            }`}
                          >
                            {category}
                            {selectedCategory === category && (
                              <X className="h-3 w-3 ml-1" />
                            )}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Active Filters Display */}
                {(searchTerm || selectedCategory) && (
                  <div className="pt-4 border-t border-gray-700/50">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm text-gray-400">
                        Active filters:
                      </span>
                      {searchTerm && (
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full flex items-center">
                          Search: "{searchTerm}"
                          <button
                            onClick={() => setSearchTerm("")}
                            className="ml-1 hover:text-blue-200"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      )}
                      {selectedCategory && (
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full flex items-center">
                          Category: {selectedCategory}
                          <button
                            onClick={() => setSelectedCategory("")}
                            className="ml-1 hover:text-purple-200"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results Summary */}
          {filteredBlogs.length > 0 && (
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>
                Showing {filteredBlogs.length} of {pagination.total || 0} filteredBlogs
                {searchTerm && ` for "${searchTerm}"`}
                {selectedCategory && ` in ${selectedCategory}`}
              </span>
              <span>
                Page {currentPage} of {pagination.pages || 1}
              </span>
            </div>
          )}

          {/* Blog Grid/List */}
          {filteredBlogs.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-6"
              }
            >
              {filteredBlogs.map((blog) => (
                <Card
                  key={blog._id}
                  className={`hover:shadow-lg transition-all duration-300 cursor-pointer group ${
                    viewMode === "list" ? "flex flex-row" : ""
                  }`}
                  onClick={() => router.push(`/blog/${blog._id}`)}
                >
                  <div className={viewMode === "list" ? "w-1/3" : ""}>
                    <div className="relative overflow-hidden">
                      <Image
                        src={
                          blog.image || "/placeholder.svg?height=200&width=400"
                        }
                        alt={blog.title}
                        width={400}
                        height={200}
                        className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
                          viewMode === "list"
                            ? "w-full h-full rounded-l-lg"
                            : "w-full h-48 rounded-t-lg"
                        }`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
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
                        <h3 className="text-lg font-semibold text-white line-clamp-2 group-hover:text-purple-300 transition-colors">
                          {blog.title}
                        </h3>
                        <p className="text-gray-400 text-sm line-clamp-3">
                          {blog.content?.substring(0, 150)}...
                        </p>
                        <div className="flex flex-wrap gap-2 items-center justify-between pt-3 border-t border-gray-700/50">
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
                  No Blogs found
                </h3>
                <p className="text-gray-400">
                  {searchTerm || selectedCategory
                    ? "Try adjusting your search or filter criteria"
                    : "No blogs available at the moment"}
                </p>
                {(searchTerm || selectedCategory) && (
                  <Button
                    onClick={clearAllFilters}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex flex-wrap justify-center items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="border-gray-600 text-gray-300 hover:bg-gray-700/50 bg-transparent disabled:opacity-50"
              >
                Previous
              </Button>

              {/* Page Numbers */}
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                let page;
                if (pagination.pages <= 5) {
                  page = i + 1;
                } else if (currentPage <= 3) {
                  page = i + 1;
                } else if (currentPage >= pagination.pages - 2) {
                  page = pagination.pages - 4 + i;
                } else {
                  page = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={page}
                    variant="outline"
                    onClick={() => setCurrentPage(page)}
                    className={`border-gray-600 hover:bg-gray-700/50 bg-transparent ${
                      currentPage === page
                        ? "text-purple-400 border-purple-500/50 bg-purple-500/10"
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
