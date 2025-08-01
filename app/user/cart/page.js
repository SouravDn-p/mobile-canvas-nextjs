"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  Heart,
  ShoppingBag,
  CreditCard,
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
import CardContent from "@/app/components/ui/cardContent";
import CardHeader from "@/app/components/ui/cardHeader";
import CardTitle from "@/app/components/ui/card/cardTitle";
import CardDescription from "@/app/components/ui/card/CardDescription";

const CartItem = ({ item, onUpdateQuantity, onRemove, onMoveToWishlist }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    setIsUpdating(true);
    await onUpdateQuantity(item.productId, newQuantity);
    setIsUpdating(false);
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    await onRemove(item.productId);
    setIsUpdating(false);
  };

  const handleMoveToWishlist = async () => {
    setIsUpdating(true);
    await onMoveToWishlist(item);
    setIsUpdating(false);
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Product Image */}
          <div className="w-full sm:w-24 h-48 sm:h-24 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={item.image || "/placeholder.svg?height=200&width=200"}
              alt={item.name || "Product"}
              width={200}
              height={200}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Product Info */}
          <div className="flex-1 space-y-2 w-full">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="font-semibold text-white text-lg">
                  {item.name || "Unnamed Product"}
                </h3>
                <p className="text-sm text-gray-400">SKU: {item.productId}</p>
              </div>
              <div className="text-right mt-2 sm:mt-0">
                <p className="text-xl font-bold text-white">
                  ৳ {(item.price || 0).toFixed(2)}
                </p>
                <p className="text-sm text-gray-400">per item</p>
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(item.quantity - 1)}
                    disabled={isUpdating || item.quantity <= 1}
                    className="cursor-pointer"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center text-white font-medium">
                    {item.quantity || 1}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(item.quantity + 1)}
                    disabled={isUpdating}
                    className="cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-sm text-gray-400">
                  Total:{" "}
                  <span className="text-white font-medium">
                    ৳ {((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMoveToWishlist}
                  disabled={isUpdating}
                  className="flex-1 sm:flex-none text-purple-400 cursor-pointer hover:text-purple-300 bg-transparent"
                >
                  <Heart className="h-4 w-4 mr-2 cursor-pointer" />
                  Save for Later
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemove}
                  disabled={isUpdating}
                  className="text-red-400 hover:text-red-300 bg-transparent cursor-pointer"
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
};

export default function CartPage() {
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
          Error Loading Cart
        </h2>
        <p className="text-gray-400 text-sm mb-4">
          {error.message || "Failed to load cart data"}
        </p>
        <Button variant="default" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </Card>
    );
  }

  const user = userData?.user;
  const cartItems = user?.cart || [];
  const wishlist = user?.wishlist || [];

  const handleUpdateQuantity = async (productId, newQuantity) => {
    try {
      const updatedCart = cartItems.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      );
      await updateUser({ email, data: { cart: updatedCart } }).unwrap();
      showAlert("Quantity updated!");
      await refetch();
    } catch (error) {
      showAlert("Failed to update quantity", "error");
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const updatedCart = cartItems.filter(
        (item) => item.productId !== productId
      );
      await updateUser({ email, data: { cart: updatedCart } }).unwrap();
      showAlert("Item removed from cart!");
      await refetch();
    } catch (error) {
      showAlert("Failed to remove item", "error");
    }
  };

  const handleMoveToWishlist = async (item) => {
    try {
      const wishlistItem = {
        productId: item.productId,
        name: item.name || "Unnamed Product",
        price: item.price || 0,
        image: item.image || "/placeholder.svg?height=200&width=200",
      };
      const updatedWishlist = [...wishlist, wishlistItem];
      const updatedCart = cartItems.filter(
        (cartItem) => cartItem.productId !== item.productId
      );
      await updateUser({
        email,
        data: { cart: updatedCart, wishlist: updatedWishlist },
      }).unwrap();
      showAlert("Item moved to wishlist!");
      await refetch();
    } catch (error) {
      showAlert("Failed to move to wishlist", "error");
    }
  };

  const handleClearCart = async () => {
    try {
      await updateUser({ email, data: { cart: [] } }).unwrap();
      showAlert("Cart cleared!");
      await refetch();
    } catch (error) {
      showAlert("Failed to clear cart", "error");
    }
  };

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      router.push("/user/checkout");
    } else {
      showAlert("Your cart is empty", "error");
    }
  };

  // Calculate totals with null checks
  const subtotal = cartItems.length
    ? cartItems.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
        0
      )
    : 0;
  const shipping = subtotal > 500 ? 0 : 120;
  const total = subtotal + shipping;
  const totalItems = cartItems.length
    ? cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto py-4 sm:py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  Shopping Cart
                </h1>
                <p className="mt-2 text-gray-400 text-sm sm:text-base">
                  {totalItems} {totalItems === 1 ? "item" : "items"} in your
                  cart
                </p>
              </div>
            </div>

            {cartItems.length > 0 && (
              <Button
                variant="outline"
                onClick={handleClearCart}
                className="text-red-400 hover:text-red-300 bg-transparent cursor-pointer"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cart
              </Button>
            )}
          </div>

          {cartItems.length === 0 ? (
            /* Empty Cart */
            <Card variant="glass">
              <CardContent className="p-8 text-center">
                <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Your Cart is Empty
                </h3>
                <p className="text-gray-400 mb-6">
                  Looks like you haven&apos;t added any items to your cart yet.
                </p>
                <div className="space-y-3">
                  <Button
                    variant="default"
                    onClick={() => router.push("/products")}
                    className="w-full sm:w-auto cursor-pointer"
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Browse Products
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/wishlist")}
                    className="w-full sm:w-auto ml-0 sm:ml-3 cursor-pointer"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    View Wishlist
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item, index) => (
                  <CartItem
                    key={item.productId || `item-${index}`}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveItem}
                    onMoveToWishlist={handleMoveToWishlist}
                  />
                ))}
              </div>

              {/* Order Summary */}
              <div className="space-y-6">
                <Card variant="gradient" className="sticky top-4">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="mr-2 h-5 w-5 text-green-400" />
                      Order Summary
                    </CardTitle>
                    <CardDescription>
                      {totalItems} {totalItems === 1 ? "item" : "items"} in your
                      cart
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Order Totals */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">
                          Subtotal ({totalItems} items):
                        </span>
                        <span className="text-white">
                          ৳ {subtotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Shipping:</span>
                        <span className="text-white">
                          {shipping === 0 ? "Free" : `৳ ${shipping.toFixed(2)}`}
                        </span>
                      </div>
                      <div className="border-t border-gray-600 pt-3">
                        <div className="flex justify-between font-semibold text-lg">
                          <span className="text-white">Total:</span>
                          <span className="text-white">
                            ৳ {total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Free Shipping Notice */}
                    {subtotal < 50 && (
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                        <p className="text-sm text-blue-300">
                          Add ৳{(50 - subtotal).toFixed(2)} more for free
                          shipping!
                        </p>
                      </div>
                    )}

                    {/* Checkout Button */}
                    <Button
                      onClick={handleCheckout}
                      variant="default"
                      className="w-full h-12 text-lg cursor-pointer"
                    >
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      Proceed to Checkout
                    </Button>

                    {/* Continue Shopping */}
                    <Button
                      variant="outline"
                      onClick={() => router.push("/products")}
                      className="w-full cursor-pointer"
                    >
                      Continue Shopping
                    </Button>

                    {/* Security Notice */}
                    <p className="text-xs text-gray-400 text-center">
                      Secure checkout with SSL encryption
                    </p>
                  </CardContent>
                </Card>

                {/* Recommended Actions */}
                <Card variant="gradient">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      You might also like
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      variant="outline"
                      onClick={() => router.push("/user/wishlist")}
                      className="w-full justify-start cursor-pointer"
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      View Wishlist ({wishlist.length} items)
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => router.push("/user/orders")}
                      className="w-full justify-start cursor-pointer"
                    >
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Order History
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
