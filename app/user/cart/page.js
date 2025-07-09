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

// Import your existing components
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
              alt={item.name}
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
                  {item.name}
                </h3>
                <p className="text-sm text-gray-400">SKU: {item.productId}</p>
              </div>
              <div className="text-right mt-2 sm:mt-0">
                <p className="text-xl font-bold text-white">৳ {item.price}</p>
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
                    {item.quantity}
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
                    ৳ {(item.price * item.quantity).toFixed(2)}
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
    refetch,
  } = useGetUserByEmailQuery(email, {
    skip: !email,
  });
  const [updateUser] = useUpdateUserMutation();

  // Loading state
  if (status === "loading" || isLoading) {
    return <LoadingSpinner />;
  }

  // Unauthenticated state
  if (status === "unauthenticated") {
    return <AccessDenied />;
  }

  const user = userData?.user;
  const cartItems = user?.cart;
  const wishlist = user?.wishlist || [];

  const handleUpdateQuantity = async (productId, newQuantity) => {
    try {
      const updatedCart = cartItems.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      );

      await updateUser({
        email,
        data: { cart: updatedCart },
      }).unwrap();

      await refetch();
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const updatedCart = cartItems.filter(
        (item) => item.productId !== productId
      );

      await updateUser({
        email,
        data: { cart: updatedCart },
      }).unwrap();

      await refetch();
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const handleMoveToWishlist = async (item) => {
    try {
      // Add to wishlist
      const wishlistItem = {
        productId: item.productId,
        name: item.name,
        price: item.price,
        image: item.image,
      };

      const updatedWishlist = [...wishlist, wishlistItem];
      const updatedCart = cartItems.filter(
        (cartItem) => cartItem.productId !== item.productId
      );

      await updateUser({
        email,
        data: {
          cart: updatedCart,
          wishlist: updatedWishlist,
        },
      }).unwrap();

      await refetch();
    } catch (error) {
      console.error("Failed to move to wishlist:", error);
    }
  };

  const handleClearCart = async () => {
    try {
      await updateUser({
        email,
        data: { cart: [] },
      }).unwrap();

      await refetch();
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      router.push("/user/checkout");
    }
  };

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + shipping ;

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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
                className="text-red-400 hover:text-red-300 bg-transparent"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cart
              </Button>
            )}
          </div>

          {cartItems.length === 0 ? (
            /* Empty Cart */
            <Card>
              <CardContent className="p-8 text-center">
                <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Your Cart is Empty
                </h3>
                <p className="text-gray-400 mb-6">
                  Looks like you haven &apos;t added any items to your cart yet.
                </p>
                <div className="space-y-3">
                  <Button
                    variant="default"
                    onClick={() => router.push("/products")}
                    className="w-full sm:w-auto"
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Browse Products
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/wishlist")}
                    className="w-full sm:w-auto ml-0 sm:ml-3"
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
                    key={item.productId || index}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveItem}
                    onMoveToWishlist={handleMoveToWishlist}
                  />
                ))}
              </div>

              {/* Order Summary */}
              <div className="space-y-6">
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="mr-2 h-5 w-5 text-green-400" />
                      Order Summary
                    </CardTitle>
                    <CardDescription>
                      {totalItems} items in your cart
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
                      {/* <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Tax:</span>
                        <span className="text-white">৳{tax.toFixed(2)}</span>
                      </div> */}
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
                          Add ${(50 - subtotal).toFixed(2)} more for free
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
                <Card>
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
