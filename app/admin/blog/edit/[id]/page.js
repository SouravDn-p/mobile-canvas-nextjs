"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useGetBlogByIdQuery,
  useUpdateBlogMutation,
} from "@/redux/api/productapi";
import Button from "@/app/components/ui/button";
import Input from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import Card from "@/app/components/ui/card";
import CardContent from "@/app/components/ui/cardContent";
import CardHeader from "@/app/components/ui/cardHeader";
import CardTitle from "@/app/components/ui/card/cardTitle";
import CardDescription from "@/app/components/ui/card/CardDescription";
import Badge from "@/app/components/ui/badge";
import { Tabs } from "@/app/components/ui/tabs";
import { TabsList } from "@/app/components/ui/tabs";
import { TabsTrigger } from "@/app/components/ui/tabs";
import { TabsContent } from "@/app/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/radix/select";
import Label from "@/app/components/ui/Label";
import { Switch } from "@/app/components/ui/Switch";
import Separator from "@/app/components/ui/Separator";
import {
  ArrowLeft,
  Save,
  Eye,
  Upload,
  X,
  Plus,
  Calendar,
  User,
  Tag,
  BarChart3,
  CheckCircle,
  Clock,
  Activity,
  Heart,
  MessageCircle,
  Bookmark,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export default function EditBlogPage({ params }) {
  const router = useRouter();
  const { id } = React.use(params);
  const { data: blogData, isLoading, error, refetch } = useGetBlogByIdQuery(id);
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();

  // Extract blog from the response structure like in blog details page
  const blog = blogData?.blog;

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    image: "",
    tags: [],
    category: "",
    status: "draft",
    featured: false,
    allowComments: true,
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    author: "",
    readTime: "",
  });

  const [newTag, setNewTag] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title || "",
        content: blog.content || "",
        excerpt: blog.excerpt || "",
        image: blog.image || "",
        tags: blog.tags || [],
        category: blog.category || "",
        status: blog.status || "draft",
        featured: blog.featured || false,
        allowComments: blog.allowComments !== false,
        seoTitle: blog.seoTitle || "",
        seoDescription: blog.seoDescription || "",
        seoKeywords: blog.seoKeywords || "",
        author: blog.author || "",
        readTime: blog.readTime || "",
      });
      setImagePreview(blog.image || "");
    }
  }, [blog]);

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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setImagePreview(imageUrl);
        setFormData((prev) => ({
          ...prev,
          image: imageUrl,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (status = formData.status) => {
    try {
      const updateData = {
        ...formData,
        status,
        updatedAt: new Date().toISOString(),
      };

      await updateBlog({
        id: id,
        data: updateData,
      }).unwrap();

      toast.success(
        `Blog ${status === "published" ? "published" : "saved"} successfully!`
      );

      if (status === "published") {
        router.push("/admin/blog");
      }

      refetch();
    } catch (error) {
      toast.error("Failed to save blog");
      console.error("Error saving blog:", error);
    }
  };

  const handlePreview = () => {
    window.open(`/blog/${id}?preview=true`, "_blank");
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
          <span className="text-white text-lg">Loading Blog Editor...</span>
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
              The blog you&apos;re trying to edit doesn&apos;t exist or has been
              removed.
            </p>
            <Button
              onClick={() => router.push("/admin/blog")}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blogs
            </Button>
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

      <div className="container mx-auto p-6 max-w-6xl relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.push("/admin/blog")}
              className="border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-500 bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blogs
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">Edit Blog Post</h1>
              <p className="text-gray-400">
                Last updated: {formatDate(blog?.updatedAt || blog?.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handlePreview}
              className="border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-500 bg-transparent"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSave("draft")}
              disabled={isUpdating}
              className="border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-500 bg-transparent"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button
              onClick={() => handleSave("published")}
              disabled={isUpdating}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {isUpdating ? "Publishing..." : "Publish"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-800/50 border border-gray-700/50">
                <TabsTrigger
                  value="content"
                  className="text-gray-300 data-[state=active]:bg-purple-500/20 data-[state=active]:text-white"
                >
                  Content
                </TabsTrigger>
                <TabsTrigger
                  value="seo"
                  className="text-gray-300 data-[state=active]:bg-purple-500/20 data-[state=active]:text-white"
                >
                  SEO
                </TabsTrigger>
                <TabsTrigger
                  value="analytics"
                  className="text-gray-300 data-[state=active]:bg-purple-500/20 data-[state=active]:text-white"
                >
                  Analytics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-6">
                {/* Blog Content Card */}
                <Card className="bg-gray-800/50 border-gray-700/50 hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-white">Blog Content</CardTitle>
                    <CardDescription className="text-gray-400">
                      Edit your blog post content and details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title" className="text-gray-300">
                        Title
                      </Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
                        }
                        placeholder="Enter blog title..."
                        className="text-lg bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-500/50"
                      />
                    </div>

                    <div>
                      <Label htmlFor="excerpt" className="text-gray-300">
                        Excerpt
                      </Label>
                      <Textarea
                        id="excerpt"
                        value={formData.excerpt}
                        onChange={(e) =>
                          handleInputChange("excerpt", e.target.value)
                        }
                        placeholder="Brief description of the blog post..."
                        rows={3}
                        className="bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-500/50 resize-none"
                      />
                    </div>

                    <div>
                      <Label htmlFor="content" className="text-gray-300">
                        Content
                      </Label>
                      <Textarea
                        id="content"
                        value={formData.content}
                        onChange={(e) =>
                          handleInputChange("content", e.target.value)
                        }
                        placeholder="Write your blog content here..."
                        rows={15}
                        className="font-mono bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-500/50 resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="author" className="text-gray-300">
                          Author
                        </Label>
                        <Input
                          id="author"
                          value={formData.author}
                          onChange={(e) =>
                            handleInputChange("author", e.target.value)
                          }
                          placeholder="Author name..."
                          className="bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-500/50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="readTime" className="text-gray-300">
                          Read Time (minutes)
                        </Label>
                        <Input
                          id="readTime"
                          value={formData.readTime}
                          onChange={(e) =>
                            handleInputChange("readTime", e.target.value)
                          }
                          placeholder="5"
                          type="number"
                          className="bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-500/50"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Featured Image Card */}
                <Card className="bg-gray-800/50 border-gray-700/50 hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-white">Featured Image</CardTitle>
                    <CardDescription className="text-gray-400">
                      Upload or provide a URL for the blog featured image
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <Label
                        htmlFor="image-upload"
                        className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-600/50 rounded-lg cursor-pointer hover:bg-gray-700/30 text-gray-300 hover:text-white transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        Upload Image
                      </Label>
                      <Input
                        value={formData.image}
                        onChange={(e) => {
                          handleInputChange("image", e.target.value);
                          setImagePreview(e.target.value);
                        }}
                        placeholder="Or paste image URL..."
                        className="flex-1 bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-500/50"
                      />
                    </div>

                    {imagePreview && (
                      <div className="relative">
                        <Image
                          src={
                            imagePreview ||
                            "/placeholder.svg?height=300&width=600"
                          }
                          alt="Featured image preview"
                          width={600}
                          height={300}
                          className="w-full h-48 object-cover rounded-lg border border-gray-700/50"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600"
                          onClick={() => {
                            setImagePreview("");
                            handleInputChange("image", "");
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="seo" className="space-y-6">
                <Card className="bg-gray-800/50 border-gray-700/50 hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-white">SEO Settings</CardTitle>
                    <CardDescription className="text-gray-400">
                      Optimize your blog post for search engines
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="seoTitle" className="text-gray-300">
                        SEO Title
                      </Label>
                      <Input
                        id="seoTitle"
                        value={formData.seoTitle}
                        onChange={(e) =>
                          handleInputChange("seoTitle", e.target.value)
                        }
                        placeholder="SEO optimized title..."
                        className="bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-500/50"
                      />
                    </div>

                    <div>
                      <Label htmlFor="seoDescription" className="text-gray-300">
                        Meta Description
                      </Label>
                      <Textarea
                        id="seoDescription"
                        value={formData.seoDescription}
                        onChange={(e) =>
                          handleInputChange("seoDescription", e.target.value)
                        }
                        placeholder="Meta description for search engines..."
                        rows={3}
                        className="bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-500/50 resize-none"
                      />
                    </div>

                    <div>
                      <Label htmlFor="seoKeywords" className="text-gray-300">
                        Keywords
                      </Label>
                      <Input
                        id="seoKeywords"
                        value={formData.seoKeywords}
                        onChange={(e) =>
                          handleInputChange("seoKeywords", e.target.value)
                        }
                        placeholder="Comma-separated keywords..."
                        className="bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-500/50"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <Card className="bg-gray-800/50 border-gray-700/50 hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <BarChart3 className="w-5 h-5 text-purple-400" />
                      Blog Analytics
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Performance metrics for this blog post
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <div className="flex items-center justify-center mb-2">
                          <Eye className="w-5 h-5 text-blue-400" />
                        </div>
                        <div className="text-2xl font-bold text-blue-400">
                          {blog?.views || 0}
                        </div>
                        <div className="text-sm text-gray-400">Views</div>
                      </div>
                      <div className="text-center p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <div className="flex items-center justify-center mb-2">
                          <Heart className="w-5 h-5 text-red-400" />
                        </div>
                        <div className="text-2xl font-bold text-red-400">
                          {blog?.likes || 0}
                        </div>
                        <div className="text-sm text-gray-400">Likes</div>
                      </div>
                      <div className="text-center p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                        <div className="flex items-center justify-center mb-2">
                          <MessageCircle className="w-5 h-5 text-purple-400" />
                        </div>
                        <div className="text-2xl font-bold text-purple-400">
                          {blog?.comments?.length || 0}
                        </div>
                        <div className="text-sm text-gray-400">Comments</div>
                      </div>
                      <div className="text-center p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <div className="flex items-center justify-center mb-2">
                          <Bookmark className="w-5 h-5 text-yellow-400" />
                        </div>
                        <div className="text-2xl font-bold text-yellow-400">
                          {blog?.bookmarkedBy?.length || 0}
                        </div>
                        <div className="text-sm text-gray-400">Bookmarks</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <Card className="bg-gray-800/50 border-gray-700/50 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white">Publish Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleInputChange("status", value)
                    }
                  >
                    <SelectTrigger className="bg-gray-700/50 border-gray-600/50 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem
                        value="draft"
                        className="text-gray-300 hover:bg-gray-700"
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-yellow-400" />
                          Draft
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="published"
                        className="text-gray-300 hover:bg-gray-700"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          Published
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="archived"
                        className="text-gray-300 hover:bg-gray-700"
                      >
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-gray-400" />
                          Archived
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-gray-300">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleInputChange("category", value)
                    }
                  >
                    <SelectTrigger className="bg-gray-700/50 border-gray-600/50 text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem
                        value="technology"
                        className="text-gray-300 hover:bg-gray-700"
                      >
                        Technology
                      </SelectItem>
                      <SelectItem
                        value="business"
                        className="text-gray-300 hover:bg-gray-700"
                      >
                        Business
                      </SelectItem>
                      <SelectItem
                        value="lifestyle"
                        className="text-gray-300 hover:bg-gray-700"
                      >
                        Lifestyle
                      </SelectItem>
                      <SelectItem
                        value="health"
                        className="text-gray-300 hover:bg-gray-700"
                      >
                        Health
                      </SelectItem>
                      <SelectItem
                        value="education"
                        className="text-gray-300 hover:bg-gray-700"
                      >
                        Education
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="bg-gray-700/50" />

                <div className="flex items-center justify-between">
                  <Label htmlFor="featured" className="text-gray-300">
                    Featured Post
                  </Label>
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) =>
                      handleInputChange("featured", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="allowComments" className="text-gray-300">
                    Allow Comments
                  </Label>
                  <Switch
                    id="allowComments"
                    checked={formData.allowComments}
                    onCheckedChange={(checked) =>
                      handleInputChange("allowComments", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card className="bg-gray-800/50 border-gray-700/50 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Tag className="w-4 h-4 text-purple-400" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag..."
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), handleAddTag())
                    }
                    className="bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-500/50"
                  />
                  <Button
                    size="sm"
                    onClick={handleAddTag}
                    disabled={!newTag.trim()}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1 bg-purple-500/20 text-purple-300 border-purple-500/30"
                    >
                      {tag}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-red-400 transition-colors"
                        onClick={() => handleRemoveTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Blog Info */}
            <Card className="bg-gray-800/50 border-gray-700/50 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white">Blog Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span>Created: {formatDate(blog?.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <User className="w-4 h-4 text-green-400" />
                  <span>Author: {blog?.author || "Unknown"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span>Read Time: {blog?.readTime || "5"} min</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Activity className="w-4 h-4 text-orange-400" />
                  <span>Status: {blog?.status || "draft"}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
