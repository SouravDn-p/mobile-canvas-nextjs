"use client";

import Link from "next/link";
import Image from "next/image";
import { User, Eye, Heart, MessageCircle, Clock } from "lucide-react";
import { useGetBlogsQuery } from "@/redux/api/productapi";
import Card from "../ui/card";
import CardContent from "../ui/cardContent";
import Button from "../ui/button";

// Utility function to format dates (reused from app/blog/page.tsx)
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function BlogSection() {
  const {
    data: blogsData,
    isLoading,
    error,
  } = useGetBlogsQuery({
    page: 1,
    limit: 3, // Fetch only the latest 3 blogs for the homepage section
    status: "published",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const blogs = blogsData?.blogs || [];

  if (isLoading) {
    return (
      <section className="py-12 sm:py-16 bg-gray-900/50 rounded-xl shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Latest Blogs
          </h2>
          <p className="text-lg text-gray-400 mb-8">
            Discover our recent insights and updates.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="w-full h-48 bg-gray-700 rounded-t-lg"></div>
                <CardContent className="p-6 space-y-3">
                  <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                  <div className="h-6 bg-gray-700 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 sm:py-16 bg-gray-900/50 rounded-xl shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Latest Blogs
          </h2>
          <p className="text-lg text-red-400 mb-8">
            Failed to load blogs. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  if (blogs.length === 0) {
    return (
      <section className="py-12 sm:py-16 bg-gray-900/50 rounded-xl shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Latest Blogs
          </h2>
          <p className="text-lg text-gray-400 mb-8">
            No blog posts available yet.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 bg-gray-900/50 rounded-xl shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Latest Blogs
        </h2>
        <p className="text-lg text-gray-400 mb-8">
          Discover our recent insights and updates.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {blogs.map((blog) => (
            <Card
              key={blog._id}
              className="hover:shadow-lg transition-all duration-300 cursor-pointer bg-gray-800/50 border-gray-700/50"
            >
              <Link href={`/blog/${blog._id}`}>
                <Image
                  src={
                    blog.image ||
                    "/placeholder.svg?height=200&width=400&text=Blog+Image"
                  }
                  alt={blog.title}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
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
              </Link>
            </Card>
          ))}
        </div>

        <Link href="/blog">
          <Button
            variant="outline"
            className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200 bg-transparent"
          >
            View All Blogs
          </Button>
        </Link>
      </div>
    </section>
  );
}
