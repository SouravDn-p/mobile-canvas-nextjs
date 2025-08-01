"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "@/app/components/ui/button";
import Card from "@/app/components/ui/card";
import CardContent from "@/app/components/ui/cardContent";
import CardHeader from "@/app/components/ui/cardHeader";
import CardTitle from "@/app/components/ui/card/cardTitle";
import CardDescription from "@/app/components/ui/card/CardDescription";
import {
  ArrowLeft,
  Save,
  Eye,
  Upload,
  X,
  Plus,
  Tag,
  FileText,
  ImageIcon,
  Clock,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCreateBlogMutation } from "@/redux/api/productapi";

const AddBlogPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [addBlog, { isLoading: isAdding }] = useCreateBlogMutation();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    image: "",
    tags: [],
    readTime: 5,
    status: "draft",
  });

  const [newTag, setNewTag] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const categories = [
    "Gaming",
    "Accessories",
    "Gadget Reviews",
    "Tech Tips",
    "Product Launches",
    "News",
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({
          ...prev,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  const handleSubmit = async (status = "draft") => {
    if (
      !formData.title.trim() ||
      !formData.content.trim() ||
      !formData.category
    ) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const blogData = {
        ...formData,
        status,
        author: session?.user?.name || "Admin",
        authorId: session?.user?.id || "admin",
        readTime: calculateReadTime(formData.content),
      };

      await addBlog(blogData).unwrap();
      router.push("/admin/blog");
    } catch (error) {
      console.error("Failed to create blog:", error);
      alert("Failed to create blog. Please try again.");
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <span className="text-white text-lg">Loading...</span>
        </div>
      </div>
    );
  }

  if (!session || session?.user?.role !== "admin") {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto py-4 sm:py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <Link href="/admin/blog">
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

            <div className="flex flex-wrap gap-2 items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsPreview(!isPreview)}
                className="border-gray-600  text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-500 bg-transparent"
              >
                <Eye className="mr-2 h-4 w-4" />
                {isPreview ? "Edit" : "Preview"}
              </Button>

              {!isPreview && (
                <>
                  <Button
                    onClick={() => handleSubmit("draft")}
                    disabled={isAdding}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-500 bg-transparent"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Draft
                  </Button>
                  <Button
                    onClick={() => handleSubmit("published")}
                    disabled={isAdding}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    {isAdding ? "Publishing..." : "Publish"}
                  </Button>
                </>
              )}
            </div>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {isPreview ? "Preview Blog" : "Add New Blog"}
            </h1>
            <p className="mt-2 text-gray-400 text-sm sm:text-base">
              Create and publish a new blog post
            </p>
          </div>

          {isPreview ? (
            /* Preview Mode */
            <Card className="hover:shadow-lg transition-all duration-300">
              {formData.image && (
                <div className="relative">
                  <Image
                    src={formData.image || "/placeholder.svg"}
                    alt={formData.title}
                    width={800}
                    height={400}
                    className="w-full h-64 sm:h-80 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-purple-500/80 text-white text-sm font-medium rounded-full">
                      {formData.category}
                    </span>
                  </div>
                </div>
              )}

              <CardContent className="p-6 sm:p-8">
                <div className="space-y-4">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                    {formData.title || "Blog Title"}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                    <span>By {session?.user?.name || "Admin"}</span>
                    <span>{new Date().toLocaleDateString()}</span>
                    <span>{calculateReadTime(formData.content)} min read</span>
                  </div>

                  <div className="prose prose-invert max-w-none mt-8">
                    <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {formData.content || "Blog content will appear here..."}
                    </div>
                  </div>

                  {formData.tags.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-gray-700/50">
                      <div className="flex items-center space-x-2">
                        <Tag className="h-4 w-4 text-gray-400" />
                        <div className="flex flex-wrap gap-2">
                          {formData.tags.map((tag, index) => (
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
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Edit Mode */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <FileText className="mr-2 h-5 w-5 text-purple-400" />
                      Blog Content
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Enter the main content of your blog post
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
                        }
                        placeholder="Enter blog title..."
                        className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Content *
                      </label>
                      <textarea
                        value={formData.content}
                        onChange={(e) =>
                          handleInputChange("content", e.target.value)
                        }
                        placeholder="Write your blog content here..."
                        rows={15}
                        className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Estimated read time:{" "}
                        {calculateReadTime(formData.content)} minutes
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Featured Image */}
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <ImageIcon className="mr-2 h-5 w-5 text-blue-400" />
                      Featured Image
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Upload a featured image for your blog post
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-700/50 border-dashed rounded-lg cursor-pointer bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-2 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-400">
                              <span className="font-semibold">
                                Click to upload
                              </span>{" "}
                              or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG or GIF (MAX. 800x400px)
                            </p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                      </div>

                      {imagePreview && (
                        <div className="relative">
                          <Image
                            src={imagePreview || "/placeholder.svg"}
                            alt="Preview"
                            width={400}
                            height={200}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setImagePreview("");
                              setFormData((prev) => ({ ...prev, image: "" }));
                            }}
                            className="absolute top-2 right-2 border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500 bg-gray-900/80"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Publish Settings */}
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <Save className="mr-2 h-5 w-5 text-green-400" />
                      Publish Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          handleInputChange("category", e.target.value)
                        }
                        className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      >
                        <option value="">Select Category</option>
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
                        value={formData.status}
                        onChange={(e) =>
                          handleInputChange("status", e.target.value)
                        }
                        className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>

                {/* Tags */}
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <Tag className="mr-2 h-5 w-5 text-yellow-400" />
                      Tags
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Add tags to help categorize your blog post
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                        placeholder="Add a tag..."
                        className="flex-1 bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      />
                      <Button
                        onClick={handleAddTag}
                        size="sm"
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full"
                          >
                            #{tag}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-1 p-0 h-4 w-4 text-purple-300 hover:text-white"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Blog Stats */}
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <Clock className="mr-2 h-5 w-5 text-blue-400" />
                      Blog Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Word Count:</span>
                      <span className="text-white">
                        {
                          formData.content
                            .trim()
                            .split(/\s+/)
                            .filter((word) => word.length > 0).length
                        }
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Character Count:</span>
                      <span className="text-white">
                        {formData.content.length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Read Time:</span>
                      <span className="text-white">
                        {calculateReadTime(formData.content)} min
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Tags:</span>
                      <span className="text-white">{formData.tags.length}</span>
                    </div>
                  </CardContent>
                </Card>
                {/* <Button
                  onClick={() => handleSubmit("published")}
                  disabled={isAdding}
                  className="bg-gradient-to-r w-full from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  {isAdding ? "Publishing..." : "Publish"}
                </Button> */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddBlogPage;
