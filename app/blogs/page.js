"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    { id: "all", name: "All Posts", count: 24 },
    { id: "reviews", name: "Product Reviews", count: 8 },
    { id: "news", name: "Tech News", count: 6 },
    { id: "guides", name: "How-to Guides", count: 5 },
    { id: "comparisons", name: "Comparisons", count: 3 },
    { id: "trends", name: "Industry Trends", count: 2 },
  ];

  const blogPosts = [
    {
      id: 1,
      title:
        "iPhone 15 Pro Max vs Samsung Galaxy S24 Ultra: The Ultimate Flagship Showdown",
      excerpt:
        "We put the two most powerful smartphones head-to-head in our comprehensive comparison covering camera quality, performance, battery life, and more.",
      category: "comparisons",
      author: "Sarah Chen",
      date: "2024-01-20",
      readTime: "8 min read",
      image: "/placeholder.svg?height=300&width=500",
      featured: true,
      tags: ["iPhone", "Samsung", "Flagship", "Comparison"],
    },
    {
      id: 2,
      title: "The Complete Guide to Choosing Your First Smartphone in 2024",
      excerpt:
        "Everything you need to know about selecting the perfect smartphone, from understanding specs to finding the best value for your budget.",
      category: "guides",
      author: "Mike Rodriguez",
      date: "2024-01-18",
      readTime: "12 min read",
      image: "/placeholder.svg?height=300&width=500",
      tags: ["Beginner", "Buying Guide", "Smartphone"],
    },
    {
      id: 3,
      title: "Apple's M3 MacBook Pro Review: A Creative Powerhouse",
      excerpt:
        "Our in-depth review of Apple's latest MacBook Pro with M3 chip, testing everything from video editing to gaming performance.",
      category: "reviews",
      author: "Alex Thompson",
      date: "2024-01-15",
      readTime: "10 min read",
      image: "/placeholder.svg?height=300&width=500",
      featured: true,
      tags: ["MacBook", "Apple", "M3", "Review"],
    },
    {
      id: 4,
      title: "5G Technology: What It Means for Your Daily Life",
      excerpt:
        "Understanding the real-world impact of 5G networks and how they're changing the way we use our mobile devices.",
      category: "news",
      author: "Emily Davis",
      date: "2024-01-12",
      readTime: "6 min read",
      image: "/placeholder.svg?height=300&width=500",
      tags: ["5G", "Technology", "Mobile Networks"],
    },
    {
      id: 5,
      title: "How to Extend Your Smartphone Battery Life: 15 Proven Tips",
      excerpt:
        "Practical strategies to maximize your phone's battery life, from optimizing settings to changing usage habits.",
      category: "guides",
      author: "David Kim",
      date: "2024-01-10",
      readTime: "7 min read",
      image: "/placeholder.svg?height=300&width=500",
      tags: ["Battery", "Tips", "Smartphone"],
    },
    {
      id: 6,
      title: "Google Pixel 8 Pro Camera Deep Dive: AI Photography Revolution",
      excerpt:
        "Exploring the advanced AI features in Google's latest flagship camera and how they're changing mobile photography.",
      category: "reviews",
      author: "Lisa Wang",
      date: "2024-01-08",
      readTime: "9 min read",
      image: "/placeholder.svg?height=300&width=500",
      tags: ["Google", "Pixel", "Camera", "AI"],
    },
    {
      id: 7,
      title: "The Rise of Foldable Phones: Are They Ready for Mainstream?",
      excerpt:
        "Analyzing the current state of foldable smartphone technology and whether it's time to make the switch.",
      category: "trends",
      author: "James Park",
      date: "2024-01-05",
      readTime: "11 min read",
      image: "/placeholder.svg?height=300&width=500",
      tags: ["Foldable", "Innovation", "Future Tech"],
    },
    {
      id: 8,
      title: "Best Wireless Earbuds of 2024: Our Top Picks",
      excerpt:
        "Comprehensive roundup of the best wireless earbuds across different price ranges, from budget options to premium models.",
      category: "reviews",
      author: "Sarah Chen",
      date: "2024-01-03",
      readTime: "15 min read",
      image: "/placeholder.svg?height=300&width=500",
      featured: true,
      tags: ["Earbuds", "Audio", "Wireless", "Roundup"],
    },
  ];

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory =
      selectedCategory === "all" || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = blogPosts.filter((post) => post.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-400 mb-4">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
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
            <span>Blog</span>
          </div>
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-white">
              Tech{" "}
              <span className="text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text">
                Blog
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Stay updated with the latest tech news, product reviews, and
              expert insights from our team.
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-900/80 backdrop-blur-xl border border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 text-white placeholder-gray-400"
                />
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Category Filter */}
            <div className="lg:w-80">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/80 backdrop-blur-xl border border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 text-white"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Featured Posts */}
        {searchTerm === "" && selectedCategory === "all" && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-8">
              Featured Articles
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.slice(0, 2).map((post, index) => (
                <article
                  key={post.id}
                  className={`group bg-gray-900/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-gray-700 hover:border-indigo-500 transition-all duration-300 ${
                    index === 0 ? "lg:col-span-2" : ""
                  }`}
                >
                  <div
                    className={`${
                      index === 0 ? "lg:flex lg:items-center" : ""
                    }`}
                  >
                    <div
                      className={`relative overflow-hidden ${
                        index === 0 ? "lg:w-1/2" : ""
                      }`}
                    >
                      <div className="aspect-video bg-gray-100">
                        <Image
                          src={post.image || "/placeholder.svg"}
                          alt={post.title}
                          width={500}
                          height={300}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="absolute top-4 left-4">
                        <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm px-3 py-1 rounded-full font-semibold">
                          Featured
                        </span>
                      </div>
                    </div>
                    <div className={`p-6 ${index === 0 ? "lg:w-1/2" : ""}`}>
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-indigo-400 text-sm font-medium capitalize">
                          {categories.find((c) => c.id === post.category)?.name}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-400 text-sm">
                          {post.readTime}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-300 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">
                              {post.author
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <div>
                            <p className="text-white text-sm font-semibold">
                              {post.author}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {new Date(post.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Link
                          href={`/blog/${post.id}`}
                          className="text-indigo-400 hover:text-indigo-300 font-medium text-sm"
                        >
                          Read More →
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Blog Posts Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {selectedCategory === "all"
                ? "Latest Articles"
                : categories.find((c) => c.id === selectedCategory)?.name}
            </h2>
            <span className="text-gray-400">
              {filteredPosts.length} article
              {filteredPosts.length !== 1 ? "s" : ""}
            </span>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-8xl mb-6">📝</div>
              <h3 className="text-2xl font-bold text-white mb-4">
                No articles found
              </h3>
              <p className="text-gray-300 mb-8">
                Try adjusting your search terms or browse different categories.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="group bg-gray-900/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-gray-700 hover:border-indigo-500 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="relative overflow-hidden">
                    <div className="aspect-video bg-gray-100">
                      <Image
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        width={400}
                        height={250}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-gray-900/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-semibold">
                        {categories.find((c) => c.id === post.category)?.name}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-gray-400 text-sm">
                        {post.readTime}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-400 text-sm">
                        {new Date(post.date).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-300 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-semibold">
                            {post.author
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <span className="text-gray-400 text-sm">
                          {post.author}
                        </span>
                      </div>
                      <Link
                        href={`/blog/${post.id}`}
                        className="text-indigo-400 hover:text-indigo-300 font-medium text-sm"
                      >
                        Read More →
                      </Link>
                    </div>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-lg"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-16">
          <div className="bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl p-12 text-center border border-gray-700">
            <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter and never miss the latest tech news,
              reviews, and exclusive insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 text-white placeholder-gray-400"
              />
              <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                Subscribe
              </button>
            </div>
            <p className="text-gray-400 text-sm mt-4">
              Join 50,000+ tech enthusiasts who trust our insights
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
