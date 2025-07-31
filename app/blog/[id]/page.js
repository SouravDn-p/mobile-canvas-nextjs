"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Button from "@/app/components/ui/button";
import Card from "@/app/components/ui/card";
import CardContent from "@/app/components/ui/cardContent";
import CardHeader from "@/app/components/ui/cardHeader";
import CardTitle from "@/app/components/ui/card/cardTitle";
import {
  ArrowLeft,
  Calendar,
  User,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Clock,
  Tag,
  Reply,
  Send,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  useGetBlogByIdQuery,
  useUpdateBlogMutation,
} from "@/redux/api/productapi";

const BlogDetailPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const blogId = params.id;

  const {
    data: blogData,
    isLoading,
    error,
    refetch,
  } = useGetBlogByIdQuery(blogId);
  const [updateBlog] = useUpdateBlogMutation();

  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [showComments, setShowComments] = useState(true);

  const blog = blogData?.blog;

  useEffect(() => {
    if (blog && session?.user) {
      setIsLiked(blog.likedBy?.includes(session.user.id) || false);
      setIsBookmarked(blog.bookmarkedBy?.includes(session.user.id) || false);
    }
  }, [blog, session]);

  // Increment view count when blog loads
  useEffect(() => {
    if (blog && blogId) {
      updateBlog({
        id: blogId,
        data: { incrementViews: true },
      });
    }
  }, [blog, blogId, updateBlog]);

  const handleLike = async () => {
    if (!session?.user) {
      router.push("/login");
      return;
    }

    try {
      const newLikedState = !isLiked;

      await updateBlog({
        id: blogId,
        data: {
          toggleLike: {
            userId: session.user.id,
            isLiking: newLikedState,
          },
        },
      });

      setIsLiked(newLikedState);
      refetch();
    } catch (error) {
      console.error("Failed to like blog:", error);
    }
  };

  const handleBookmark = async () => {
    if (!session?.user) {
      router.push("/login");
      return;
    }

    try {
      const newBookmarkedState = !isBookmarked;

      await updateBlog({
        id: blogId,
        data: {
          toggleBookmark: {
            userId: session.user.id,
            isBookmarking: newBookmarkedState,
          },
        },
      });

      setIsBookmarked(newBookmarkedState);
      refetch();
    } catch (error) {
      console.error("Failed to bookmark blog:", error);
    }
  };

  const handleAddComment = async () => {
    if (!session?.user || !newComment.trim()) return;

    try {
      await updateBlog({
        id: blogId,
        data: {
          addComment: {
            content: newComment,
            author: session.user.name,
            authorId: session.user.id,
            replyTo: replyTo,
          },
        },
      });

      setNewComment("");
      setReplyTo(null);
      refetch();
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.content.substring(0, 100) + "...",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <span className="text-white text-lg">Loading Blog...</span>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <Card className="border-red-500/50 bg-red-500/10 max-w-md">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-white mb-2">
              Blog Not Found
            </h3>
            <p className="text-gray-400 mb-4">
              The blog you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
            <Link href="/blog">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                Back to Blogs
              </Button>
            </Link>
          </CardContent>
        </Card>
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

      <div className="max-w-4xl mx-auto py-4 sm:py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="flex items-center space-x-4">
            <Link href="/blog">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-500 bg-transparent"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blogs
              </Button>
            </Link>
          </div>

          {/* Blog Content */}
          <Card className="hover:shadow-lg transition-all duration-300">
            {/* Blog Header */}
            <div className="relative">
              <Image
                src={blog.image || "/placeholder.svg?height=400&width=800"}
                alt={blog.title}
                width={800}
                height={400}
                className="w-full h-64 sm:h-80 object-cover rounded-t-lg"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-purple-500/80 text-white text-sm font-medium rounded-full">
                  {blog.category}
                </span>
              </div>
            </div>

            <CardContent className="p-6 sm:p-8">
              {/* Title and Meta */}
              <div className="space-y-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                  {blog.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>By {blog.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(blog.createdAt)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{blog.readTime || "5"} min read</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{blog.views || 0} views</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLike}
                      className={`border-gray-600 hover:bg-gray-700/50 bg-transparent ${
                        isLiked
                          ? "text-red-400 border-red-500/50"
                          : "text-gray-300"
                      }`}
                    >
                      <Heart
                        className={`h-4 w-4 mr-2 ${
                          isLiked ? "fill-current" : ""
                        }`}
                      />
                      {blog.likes || 0}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBookmark}
                      className={`border-gray-600 hover:bg-gray-700/50 bg-transparent ${
                        isBookmarked
                          ? "text-yellow-400 border-yellow-500/50"
                          : "text-gray-300"
                      }`}
                    >
                      <Bookmark
                        className={`h-4 w-4 mr-2 ${
                          isBookmarked ? "fill-current" : ""
                        }`}
                      />
                      {isBookmarked ? "Saved" : "Save"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShare}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700/50 bg-transparent"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-400">
                    <MessageCircle className="h-4 w-4" />
                    <span>{blog.comments?.length || 0} comments</span>
                  </div>
                </div>
              </div>

              {/* Blog Content */}
              <div className="mt-8 prose prose-invert max-w-none">
                <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {blog.content}
                </div>
              </div>

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-700/50">
                  <div className="flex items-center space-x-2">
                    <Tag className="h-4 w-4 text-gray-400" />
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                <div className="flex items-center">
                  <MessageCircle className="mr-2 h-5 w-5 text-blue-400" />
                  Comments ({blog.comments?.length || 0})
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowComments(!showComments)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700/50 bg-transparent"
                >
                  {showComments ? "Hide" : "Show"}
                </Button>
              </CardTitle>
            </CardHeader>

            {showComments && (
              <CardContent className="space-y-6">
                {/* Add Comment */}
                {session?.user ? (
                  <div className="space-y-3">
                    {replyTo && (
                      <div className="flex items-center justify-between bg-gray-800/30 p-3 rounded-lg">
                        <span className="text-sm text-gray-400">
                          Replying to {replyTo.author}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setReplyTo(null)}
                          className="text-gray-400 hover:text-white"
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                    <div className="flex space-x-3">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={
                          replyTo ? "Write a reply..." : "Write a comment..."
                        }
                        rows={3}
                        className="flex-1 bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                      />
                      <Button
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 self-end"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 bg-gray-800/30 rounded-lg">
                    <p className="text-gray-400 mb-3">
                      Please log in to comment
                    </p>
                    <Link href="/login">
                      <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                        Log In
                      </Button>
                    </Link>
                  </div>
                )}

                {/* Comments List */}
                <div className="space-y-4">
                  {blog.comments?.map((comment, index) => (
                    <div key={index} className="bg-gray-800/30 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {comment.author?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-white font-medium">
                              {comment.author}
                            </p>
                            <p className="text-xs text-gray-400">
                              {formatDate(comment.createdAt)}
                            </p>
                          </div>
                        </div>
                        {session?.user && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setReplyTo(comment)}
                            className="text-gray-400 hover:text-white"
                          >
                            <Reply className="h-3 w-3 mr-1" />
                            Reply
                          </Button>
                        )}
                      </div>
                      <p className="text-gray-300 ml-10">{comment.content}</p>
                    </div>
                  ))}

                  {(!blog.comments || blog.comments.length === 0) && (
                    <div className="text-center py-8">
                      <MessageCircle className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400">
                        No comments yet. Be the first to comment!
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
