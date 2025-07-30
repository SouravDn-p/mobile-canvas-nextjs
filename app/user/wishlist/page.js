"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Heart,
  ShoppingCart,
  Trash2,
  Star,
  Filter,
  Search,
  Grid,
  List,
  Plus,
  Minus,
} from "lucide-react";
import { useSession } from "next-auth/react";
import {
  useGetUserByEmailQuery,
  useUpdateUserMutation,
} from "@/redux/api/productapi";
import Swal from "sweetalert2";
import LoadingSpinner from "@/app/components/shared/LoadingSpinner";
import AccessDenied from "@/app/components/shared/AccessDenied";
import Button from "@/app/components/ui/button";
import Card from "@/app/components/ui/card";
import Badge from "@/app/components/ui/badge";
import CardContent from "@/app/components/ui/cardContent";
import Link from "next/link";

const Input = ({ className = "", ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-gray-600 bg-gray-800/50 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    {...props}
  />
);

const Select = ({ children, className = "", ...props }) => (
  <select
    className={`flex h-10 w-full rounded-md border border-gray-600 bg-gray-800/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    {...props}
  >
    {children}
  </select>
);

const WishlistItem = ({ item, onRemove, onAddToCart, viewMode = "grid" }) => {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    onAddToCart({ ...item, quantity });
  };

  if (viewMode === "list") {
    return (
      <Card
        className="hover:shadow-lg transition-all duration-300"
        variant="gradient"
      >
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="w-full sm:w-24 h-48 sm:h-24 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={item.image || "/placeholder.svg?height=200&width=200"}
                alt={item.name || "Unnamed Product"}
                width={200}
                height={200}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-semibold text-white text-lg">
                    {item.name || "Unnamed Product"}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {item.category || "Uncategorized"}
                  </p>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < (item.rating || 4)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-600"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-400 ml-2">
                      ({item.reviews || 0} reviews)
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    {item.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        ৳{item.originalPrice.toFixed(2)}
                      </span>
                    )}
                    <span className="text-xl font-bold text-white">
                      ৳{(item.price || 0).toFixed(2)}
                    </span>
                  </div>
                  {item.discount && (
                    <Badge variant="success" className="mt-1">
                      {item.discount}% OFF
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="cursor-pointer"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center text-white">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                      className="cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex space-x-2 w-full sm:w-auto">
                  <Button
                    variant="default"
                    onClick={handleAddToCart}
                    className="flex-1 sm:flex-none cursor-pointer"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => onRemove(item.productId)}
                    className="text-red-400 hover:text-red-300 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="hover:shadow-lg transition-all duration-300 group"
      variant="gradient"
    >
      <CardContent className="p-4">
        <div className="relative">
          <div className="w-full h-48 bg-gray-700 rounded-lg overflow-hidden mb-4">
            <Image
              src={item.image || "/placeholder.svg?height=200&width=200"}
              alt={item.name || "Unnamed Product"}
              width={200}
              height={200}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          <button
            onClick={() => onRemove(item.productId)}
            className="absolute top-2 right-2 p-2 bg-gray-900/80 text-red-400 rounded-full hover:bg-red-500 hover:text-white transition-colors"
          >
            <Heart className="h-4 w-4 fill-current" />
          </button>

          {item.discount && (
            <Badge variant="success" className="absolute top-2 left-2">
              {item.discount}% OFF
            </Badge>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-white truncate">
              {item.name || "Unnamed Product"}
            </h3>
            <p className="text-sm text-gray-400">
              {item.category || "Uncategorized"}
            </p>
          </div>

          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < (item.rating || 4)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-600"
                }`}
              />
            ))}
            <span className="text-sm text-gray-400 ml-2">
              ({item.reviews || 0})
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              {item.originalPrice && (
                <span className="text-sm text-gray-400 line-through block">
                  ৳{item.originalPrice.toFixed(2)}
                </span>
              )}
              <span className="text-lg font-bold text-white">
                ৳{(item.price || 0).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="cursor-pointer"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center text-white text-sm">
              {quantity}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuantity(quantity + 1)}
              className="cursor-pointer"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="default"
            onClick={handleAddToCart}
            className="w-full cursor-pointer"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const email = session?.user?.email;
  const router = useRouter();

  // API calls
  const {
    data: userData,
    isLoading,
    error,
    refetch,
  } = useGetUserByEmailQuery(email, { skip: !email });
  const [updateUser] = useUpdateUserMutation();

  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");

  // SweetAlert2 notification
  const showAlert = (message, type = "success") => {
    Swal.fire({
      text: message,
      icon: type,
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: type === "success" ? "#16a34a" : "#dc2626",
      color: "#fff",
    });
  };

  // Loading, unauthenticated, or error states
  if (status === "loading" || isLoading) {
    return <LoadingSpinner />;
  }
  if (status === "unauthenticated") {
    return <AccessDenied />;
  }
  if (error) {
    return (
      <Card variant="glass" className="p-6 text-center max-w-md mx-auto">
        <h2 className="text-xl font-bold text-white mb-2">
          Error Loading Wishlist
        </h2>
        <p className="text-gray-400 text-sm mb-4">
          {error.message || "Failed to load wishlist data"}
        </p>
        <Button variant="default" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </Card>
    );
  }

  const user = userData?.user;
  const wishlistItems = user?.wishlist || [];
  const cartItems = user?.cart || [];

  // Filter items with null checks
  const filteredItems = wishlistItems.filter((item) => {
    const matchesSearch = (item.name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || (item.category || "") === categoryFilter;
    const matchesPrice = (() => {
      if (priceFilter === "all") return true;
      const price = item.price || 0;
      switch (priceFilter) {
        case "under25":
          return price < 25;
        case "25to50":
          return price >= 25 && price <= 50;
        case "50to100":
          return price >= 50 && price <= 100;
        case "over100":
          return price > 100;
        default:
          return true;
      }
    })();
    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Get unique categories
  const categories = [
    ...new Set(wishlistItems.map((item) => item.category || "Uncategorized")),
  ];

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const updatedWishlist = wishlistItems.filter(
        (item) => item.productId !== productId
      );
      await updateUser({ email, data: { wishlist: updatedWishlist } }).unwrap();
      showAlert("Item removed from wishlist!");
      await refetch();
    } catch (error) {
      showAlert("Failed to remove from wishlist", "error");
    }
  };

  const handleAddToCart = async (item) => {
    try {
      const existingItem = cartItems.find(
        (cartItem) => cartItem.productId === item.productId
      );
      let updatedCart;
      if (existingItem) {
        updatedCart = cartItems.map((cartItem) =>
          cartItem.productId === item.productId
            ? {
                ...cartItem,
                quantity: cartItem.quantity + (item.quantity || 1),
              }
            : cartItem
        );
      } else {
        updatedCart = [
          ...cartItems,
          {
            productId: item.productId,
            name: item.name || "Unnamed Product",
            price: item.price || 0,
            quantity: item.quantity || 1,
            image: item.image || "/placeholder.svg?height=200&width=200",
          },
        ];
      }
      await updateUser({ email, data: { cart: updatedCart } }).unwrap();
      showAlert("Item added to cart!");
      await refetch();
    } catch (error) {
      showAlert("Failed to add to cart", "error");
    }
  };

  // Calculate totals with null checks
  const totalValue = filteredItems.length
    ? filteredItems.reduce((sum, item) => sum + (item.price || 0), 0)
    : 0;
  const onSaleItems = filteredItems.filter(
    (item) => (item.discount || 0) > 0
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto py-4 sm:py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                My Wishlist
              </h1>
              <p className="mt-2 text-gray-400 text-sm sm:text-base">
                Save items you love and shop them later
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="cursor-pointer"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="cursor-pointer"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <Card variant="gradient">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-400 mb-1">
                      Total Items
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-white">
                      {filteredItems.length}
                    </p>
                  </div>
                  <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400" />
                </div>
              </CardContent>
            </Card>

            <Card variant="gradient">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-400 mb-1">
                      Total Value
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-white">
                      ৳{totalValue.toFixed(2)}
                    </p>
                  </div>
                  <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card variant="gradient">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-400 mb-1">
                      On Sale
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-white">
                      {onSaleItems}
                    </p>
                  </div>
                  <Badge variant="success" className="p-2">
                    <Star className="h-3 w-3" />
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card variant="gradient">
              <CardContent className="p-4 sm:p-6">
                <Link href="/user/cart">
                  <Button
                    variant="default"
                    disabled={cartItems.length === 0}
                    className="w-full h-full cursor-pointer"
                  >
                    View Cart ({cartItems.length})
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card variant="gradient">
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Search Items
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search wishlist..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Category
                  </label>
                  <Select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Price Range
                  </label>
                  <Select
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                  >
                    <option value="all">All Prices</option>
                    <option value="under25">Under ৳25</option>
                    <option value="25to50">৳25 - ৳50</option>
                    <option value="50to100">৳50 - ৳100</option>
                    <option value="over100">Over ৳100</option>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setCategoryFilter("all");
                      setPriceFilter("all");
                    }}
                    className="w-full cursor-pointer"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wishlist Items */}
          {filteredItems.length === 0 ? (
            <Card variant="glass">
              <CardContent className="p-8 text-center">
                <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Your Wishlist is Empty
                </h3>
                <p className="text-gray-400 mb-4">
                  {searchTerm ||
                  categoryFilter !== "all" ||
                  priceFilter !== "all"
                    ? "No items match your current filters."
                    : "Start adding items you love to your wishlist!"}
                </p>
                <Button
                  variant="default"
                  onClick={() => router.push("/products")}
                  className="cursor-pointer"
                >
                  Browse Products
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div
              className={`grid gap-4 sm:gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              {filteredItems.map((item, index) => (
                <WishlistItem
                  key={item.productId || `item-${index}`}
                  item={item}
                  onRemove={handleRemoveFromWishlist}
                  onAddToCart={handleAddToCart}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
