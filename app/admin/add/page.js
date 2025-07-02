"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  Save,
  Package,
  Tag,
  DollarSign,
  Hash,
  User,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import Image from "next/image";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { useCreateProductMutation } from "@/redux/api/productapi";

// Validation Schema
const productSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .min(3, "Product name must be at least 3 characters"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  price: z
    .string()
    .min(1, "Price is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Price must be a positive number",
    }),
  stock: z
    .string()
    .min(1, "Stock quantity is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Stock must be a non-negative number",
    }),
  sku: z
    .string()
    .min(1, "SKU is required")
    .min(3, "SKU must be at least 3 characters"),
  supplier: z.string().optional(),
  status: z.enum(["In Stock", "Low Stock", "Out of Stock"]),
  specifications: z
    .array(
      z.object({
        key: z.string().min(1, "Specification name is required"),
        value: z.string().min(1, "Specification value is required"),
      })
    )
    .optional(),
});

// Enhanced Inline Components with Dark Theme
const Button = ({
  children,
  className = "",
  variant = "default",
  size = "default",
  type = "button",
  disabled = false,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 transform hover:scale-105";

  const variants = {
    default:
      "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl",
    outline:
      "border border-gray-600 bg-gray-800/50 text-gray-200 hover:bg-gray-700/50 backdrop-blur-sm hover:border-gray-500",
    success:
      "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl",
    destructive:
      "bg-gradient-to-r from-red-600 to-pink-600 text-white hover:from-red-700 hover:to-pink-700 shadow-lg hover:shadow-xl",
    ghost: "hover:bg-gray-800/50 text-gray-300 hover:text-white",
  };

  const sizes = {
    default: "h-11 px-6 py-2",
    sm: "h-9 rounded-lg px-4",
    lg: "h-12 rounded-xl px-8",
  };

  const classes = `${baseClasses} ${variants[variant]} ${
    sizes[size]
  } ${className} ${
    disabled ? "opacity-50 cursor-not-allowed transform-none" : ""
  }`;

  return (
    <button type={type} className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  );
};

const Card = ({ children, className = "", variant = "default", ...props }) => {
  const variants = {
    default:
      "rounded-2xl border border-gray-700/50 bg-gray-900/50 text-gray-100 shadow-xl backdrop-blur-sm",
    gradient:
      "rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/30 text-gray-100 shadow-xl backdrop-blur-sm",
    glass:
      "rounded-2xl bg-gray-900/30 border border-gray-700/30 text-gray-100 shadow-xl backdrop-blur-xl",
  };

  return (
    <div className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = "", ...props }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className = "", ...props }) => (
  <h3
    className={`text-2xl font-semibold leading-none tracking-tight ${className}`}
    {...props}
  >
    {children}
  </h3>
);

const CardDescription = ({ children, className = "", ...props }) => (
  <p className={`text-sm text-gray-400 ${className}`} {...props}>
    {children}
  </p>
);

const CardContent = ({ children, className = "", ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

const Input = ({ className = "", type = "text", error = false, ...props }) => (
  <input
    type={type}
    className={`flex h-12 w-full rounded-xl border ${
      error
        ? "border-red-500 focus-visible:ring-red-500"
        : "border-gray-600 focus-visible:ring-blue-500"
    } bg-gray-800/50 px-4 py-3 text-sm text-gray-200 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 backdrop-blur-sm transition-all duration-300 ${className}`}
    {...props}
  />
);

const Textarea = ({ className = "", error = false, ...props }) => (
  <textarea
    className={`flex min-h-[120px] w-full rounded-xl border ${
      error
        ? "border-red-500 focus-visible:ring-red-500"
        : "border-gray-600 focus-visible:ring-blue-500"
    } bg-gray-800/50 px-4 py-3 text-sm text-gray-200 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 backdrop-blur-sm transition-all duration-300 resize-none ${className}`}
    {...props}
  />
);

const Label = ({ children, className = "", required = false, ...props }) => (
  <label
    className={`text-sm font-medium leading-none text-gray-300 ${className}`}
    {...props}
  >
    {children}
    {required && <span className="text-red-400 ml-1">*</span>}
  </label>
);

const Select = ({ children, className = "", error = false, ...props }) => (
  <select
    className={`flex h-12 w-full rounded-xl border ${
      error
        ? "border-red-500 focus-visible:ring-red-500"
        : "border-gray-600 focus-visible:ring-blue-500"
    } bg-gray-800/50 px-4 py-3 text-sm text-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 backdrop-blur-sm transition-all duration-300 ${className}`}
    {...props}
  >
    {children}
  </select>
);

const ErrorMessage = ({ children }) => (
  <div className="flex items-center mt-1 text-sm text-red-400">
    <AlertCircle className="h-4 w-4 mr-1" />
    {children}
  </div>
);

const FormField = ({ label, required, error, children }) => (
  <div className="space-y-2">
    <Label required={required}>{label}</Label>
    {children}
    {error && <ErrorMessage>{error.message}</ErrorMessage>}
  </div>
);

export default function AddProductPage() {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid, isDirty },
    watch,
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      price: "",
      stock: "",
      sku: "",
      supplier: "",
      status: "In Stock",
      specifications: [{ key: "", value: "" }],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "specifications",
  });

  const categories = [
    "Electronics",
    "Accessories",
    "Furniture",
    "Clothing",
    "Books",
    "Sports",
    "Home & Garden",
    "Automotive",
    "Health & Beauty",
    "Toys & Games",
  ];

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      // Filter out empty specifications
      const filteredSpecs =
        data.specifications?.filter((spec) => spec.key && spec.value) || [];

      const productData = {
        ...data,
        price: Number(data.price),
        stock: Number(data.stock),
        specifications: filteredSpecs,
        images: images,
      };

      // ✅ Real API call
      await createProduct(productData).unwrap();

      // ✅ Success Alert
      Swal.fire({
        icon: "success",
        title: "Product Added!",
        text: "✅ Your product has been created successfully.",
        confirmButtonColor: "#10B981",
      });

      reset();
      setImages([]);
      router.push("/products");
    } catch (error) {
      console.error("❌ Error creating product:", err?.data?.message);

      // ❌ Error Alert
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message || "Something went wrong. Please try again.",
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }

    files.forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setImages((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            url: event.target.result,
            file: file,
            name: file.name,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const addSpecification = () => {
    append({ key: "", value: "" });
  };

  // Auto-generate SKU based on name and category
  const watchedName = watch("name");
  const watchedCategory = watch("category");

  const generateSKU = () => {
    if (watchedName && watchedCategory) {
      const namePrefix = watchedName.substring(0, 3).toUpperCase();
      const categoryPrefix = watchedCategory.substring(0, 2).toUpperCase();
      const randomSuffix = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0");
      const generatedSKU = `${namePrefix}-${categoryPrefix}-${randomSuffix}`;
      setValue("sku", generatedSKU);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto py-8 sm:px-6 lg:px-8 relative z-10">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link
                href="/products"
                className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Products
              </Link>
            </div>
            <div className="text-sm text-gray-400">
              {isDirty ? "Unsaved changes" : "No changes"}
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center">
              <Plus className="mr-3 h-10 w-10 text-blue-400" />
              Add New Product
            </h1>
            <p className="mt-2 text-gray-400">
              Create a new product in your inventory
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <Card variant="gradient">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="mr-2 h-6 w-6 text-blue-400" />
                  Basic Information
                </CardTitle>
                <CardDescription>Essential product details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Product Name" required error={errors.name}>
                    <div className="relative">
                      <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        {...register("name")}
                        placeholder="Enter product name"
                        className="pl-11"
                        error={!!errors.name}
                      />
                    </div>
                  </FormField>

                  <FormField label="Category" required error={errors.category}>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Controller
                        name="category"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            className="pl-11"
                            error={!!errors.category}
                          >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </Select>
                        )}
                      />
                    </div>
                  </FormField>

                  <FormField label="Price" required error={errors.price}>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        {...register("price")}
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-11"
                        error={!!errors.price}
                      />
                    </div>
                  </FormField>

                  <FormField
                    label="Stock Quantity"
                    required
                    error={errors.stock}
                  >
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        {...register("stock")}
                        type="number"
                        placeholder="0"
                        className="pl-11"
                        error={!!errors.stock}
                      />
                    </div>
                  </FormField>

                  <FormField label="SKU" required error={errors.sku}>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        {...register("sku")}
                        placeholder="Enter SKU"
                        className="pl-11 pr-20"
                        error={!!errors.sku}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={generateSKU}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs"
                        disabled={!watchedName || !watchedCategory}
                      >
                        Generate
                      </Button>
                    </div>
                  </FormField>

                  <FormField label="Supplier" error={errors.supplier}>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        {...register("supplier")}
                        placeholder="Enter supplier name"
                        className="pl-11"
                        error={!!errors.supplier}
                      />
                    </div>
                  </FormField>

                  <FormField label="Status" error={errors.status}>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <Select {...field} error={!!errors.status}>
                          <option value="In Stock">In Stock</option>
                          <option value="Low Stock">Low Stock</option>
                          <option value="Out of Stock">Out of Stock</option>
                        </Select>
                      )}
                    />
                  </FormField>
                </div>

                <FormField label="Description" error={errors.description}>
                  <Textarea
                    {...register("description")}
                    placeholder="Enter product description..."
                    error={!!errors.description}
                  />
                </FormField>
              </CardContent>
            </Card>

            {/* Product Images */}
            <Card variant="gradient">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="mr-2 h-6 w-6 text-green-400" />
                  Product Images
                </CardTitle>
                <CardDescription>
                  Upload product photos (max 5 images, 10MB each)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-gray-500 transition-colors relative">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <div className="space-y-2">
                      <p className="text-gray-300">
                        Drop images here or click to upload
                      </p>
                      <p className="text-sm text-gray-500">
                        PNG, JPG, GIF up to 10MB each
                      </p>
                      <p className="text-xs text-gray-600">
                        {images.length}/5 images uploaded
                      </p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={images.length >= 5}
                    />
                  </div>

                  {/* Image Preview */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {images.map((image) => (
                        <div key={image.id} className="relative group">
                          <Image
                            src={image.url || "/placeholder.svg"}
                            alt="Product preview"
                            width={128} // Specify a width (in pixels)
                            height={128} // Specify a height (in pixels)
                            className="w-full h-32 object-cover rounded-lg border border-gray-600"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => removeImage(image.id)}
                              className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="absolute bottom-2 left-2 right-2">
                            <p className="text-xs text-white bg-black/50 rounded px-2 py-1 truncate">
                              {image.name}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card variant="gradient">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-6 w-6 text-purple-400" />
                  Specifications
                </CardTitle>
                <CardDescription>
                  Add technical specifications and features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-4 items-start">
                      <FormField
                        label="Specification Name"
                        error={errors.specifications?.[index]?.key}
                        className="flex-1"
                      >
                        <Input
                          {...register(`specifications.${index}.key`)}
                          placeholder="e.g., Brand, Color, Weight"
                          error={!!errors.specifications?.[index]?.key}
                        />
                      </FormField>
                      <FormField
                        label="Value"
                        error={errors.specifications?.[index]?.value}
                        className="flex-1"
                      >
                        <Input
                          {...register(`specifications.${index}.value`)}
                          placeholder="e.g., Apple, Red, 250g"
                          error={!!errors.specifications?.[index]?.value}
                        />
                      </FormField>
                      <div className="pt-8">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => remove(index)}
                          disabled={fields.length === 1}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addSpecification}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Specification
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Link href="/products">
                <Button variant="outline" className="w-full sm:w-auto">
                  Cancel
                </Button>
              </Link>
              <Button
                type="button"
                variant="ghost"
                onClick={() => reset()}
                disabled={!isDirty}
                className="w-full sm:w-auto"
              >
                Reset Form
              </Button>
              <Button
                type="submit"
                variant="success"
                disabled={isLoading || !isValid}
                className="w-full sm:w-auto"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Product...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create Product
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="z-[9999]"
        theme="light"
      />
    </div>
  );
}
