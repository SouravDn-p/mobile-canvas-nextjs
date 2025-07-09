"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  CreditCard,
  MapPin,
  Lock,
  ShoppingBag,
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  CheckCircle,
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
import CardHeader from "@/app/components/ui/cardHeader";
import CardTitle from "@/app/components/ui/card/cardTitle";
import CardDescription from "@/app/components/ui/card/CardDescription";
import CardContent from "@/app/components/ui/cardContent";

const Input = ({ className = "", error, ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border ${
      error ? "border-red-500" : "border-gray-600"
    } bg-gray-800/50 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
      error ? "focus:ring-red-500" : "focus:ring-blue-500"
    } focus:border-transparent ${className}`}
    {...props}
  />
);

const Select = ({ children, className = "", error, ...props }) => (
  <select
    className={`flex h-10 w-full rounded-md border ${
      error ? "border-red-500" : "border-gray-600"
    } bg-gray-800/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 ${
      error ? "focus:ring-red-500" : "focus:ring-blue-500"
    } focus:border-transparent ${className}`}
    {...props}
  >
    {children}
  </select>
);

const ErrorMessage = ({ message }) => (
  <p className="text-red-400 text-xs mt-1">{message}</p>
);

const CheckoutItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <div className="flex items-center space-x-4 p-4 border border-gray-700 rounded-lg">
      <div className="w-16 h-16 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
        <Image
          src={item.image || "/placeholder.svg?height=64&width=64"}
          alt={item.name}
          width={64}
          height={64}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-white truncate">{item.name}</h4>
        <p className="text-sm text-gray-400">${item.price} each</p>
      </div>

      <div className="flex items-center ">
        <Button
          variant="outline"
          size="xsm"
          onClick={() =>
            onUpdateQuantity(item.productId, Math.max(1, item.quantity - 1))
          }
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center text-white text-sm">
          {item.quantity}
        </span>
        <Button
          variant="outline"
          size="xsm"
          onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="text-right">
        <p className="font-medium text-white">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(item.productId)}
          className="text-red-400 hover:text-red-300 p-1"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default function CheckoutPage() {
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

  // State
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      // Shipping Information
      firstName: "",
      lastName: "",
      email: email || "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",

      // Payment Information
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardName: "",

      // Options
      saveInfo: false,
      sameAsShipping: true,
    },
  });

  // Load checkout items on mount
  useEffect(() => {
    // Check if items were passed from wishlist
    const wishlistItems = localStorage.getItem("checkoutItems");
    if (wishlistItems) {
      setCheckoutItems(JSON.parse(wishlistItems));
      localStorage.removeItem("checkoutItems");
    } else {
      // Load from user's cart
      const user = userData?.user;
      if (user?.cart && user.cart.length > 0) {
        setCheckoutItems(user.cart);
      } else {
        // Mock cart data
        setCheckoutItems([
          {
            productId: "p1001",
            name: "Wireless Mouse",
            quantity: 2,
            price: 19.99,
            image: "/placeholder.svg?height=64&width=64",
          },
          {
            productId: "p1003",
            name: "USB-C Hub",
            quantity: 1,
            price: 34.99,
            image: "/placeholder.svg?height=64&width=64",
          },
        ]);
      }
    }
  }, [userData]);

  // Loading state
  if (status === "loading" || isLoading) {
    return <LoadingSpinner />;
  }

  // Unauthenticated state
  if (status === "unauthenticated") {
    return <AccessDenied />;
  }

  const user = userData?.user;

  const handleUpdateQuantity = (productId, newQuantity) => {
    setCheckoutItems((items) =>
      items.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (productId) => {
    setCheckoutItems((items) =>
      items.filter((item) => item.productId !== productId)
    );
  };

  const subtotal = checkoutItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const onSubmit = async (formData) => {
    setIsProcessing(true);

    try {
      // Simulate order processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create order object
      const order = {
        items: checkoutItems,
        total: total,
        status: "processing",
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        paymentMethod: {
          last4: formData.cardNumber.slice(-4),
          type: "credit_card",
        },
        createdAt: new Date().toISOString(),
      };

      // Clear cart after successful order
      await updateUser({
        email,
        data: { cart: [] },
      }).unwrap();

      setOrderComplete(true);
    } catch (error) {
      console.error("Order processing failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-8">
            <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Order Placed Successfully!
            </h2>
            <p className="text-gray-400 mb-6">
              Thank you for your purchase. You&apos;ll receive a confirmation
              email shortly.
            </p>
            <div className="space-y-3">
              <Button
                variant="default"
                onClick={() => router.push("/orders")}
                className="w-full"
              >
                View Orders
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/")}
                className="w-full"
              >
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-8">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Your Cart is Empty
            </h2>
            <p className="text-gray-400 mb-6">
              Add some items to your cart before checking out.
            </p>
            <Button
              variant="default"
              onClick={() => router.push("/products")}
              className="w-full"
            >
              Browse Products
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
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto py-4 sm:py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Checkout
              </h1>
              <p className="mt-2 text-gray-400 text-sm sm:text-base">
                Complete your purchase securely
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-4">
              {/* Checkout Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Shipping Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="mr-2 h-5 w-5 text-blue-400" />
                      Shipping Information
                    </CardTitle>
                    <CardDescription>
                      Where should we deliver your order?
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          First Name
                        </label>
                        <Input
                          {...register("firstName", {
                            required: "First name is required",
                          })}
                          placeholder="John"
                          error={errors.firstName}
                        />
                        {errors.firstName && (
                          <ErrorMessage message={errors.firstName.message} />
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Last Name
                        </label>
                        <Input
                          {...register("lastName", {
                            required: "Last name is required",
                          })}
                          placeholder="Doe"
                          error={errors.lastName}
                        />
                        {errors.lastName && (
                          <ErrorMessage message={errors.lastName.message} />
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Email
                        </label>
                        <Input
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Invalid email address",
                            },
                          })}
                          placeholder="john@example.com"
                          error={errors.email}
                        />
                        {errors.email && (
                          <ErrorMessage message={errors.email.message} />
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Phone
                        </label>
                        <Input
                          {...register("phone", {
                            required: "Phone number is required",
                          })}
                          placeholder="+1 (555) 123-4567"
                          error={errors.phone}
                        />
                        {errors.phone && (
                          <ErrorMessage message={errors.phone.message} />
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Address
                      </label>
                      <Input
                        {...register("address", {
                          required: "Address is required",
                        })}
                        placeholder="123 Main Street"
                        error={errors.address}
                      />
                      {errors.address && (
                        <ErrorMessage message={errors.address.message} />
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          City
                        </label>
                        <Input
                          {...register("city", {
                            required: "City is required",
                          })}
                          placeholder="New York"
                          error={errors.city}
                        />
                        {errors.city && (
                          <ErrorMessage message={errors.city.message} />
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          State
                        </label>
                        <Select
                          {...register("state", {
                            required: "State is required",
                          })}
                          error={errors.state}
                        >
                          <option value="">Select State</option>
                          <option value="NY">New York</option>
                          <option value="CA">California</option>
                          <option value="TX">Texas</option>
                          <option value="FL">Florida</option>
                        </Select>
                        {errors.state && (
                          <ErrorMessage message={errors.state.message} />
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          ZIP Code
                        </label>
                        <Input
                          {...register("zipCode", {
                            required: "ZIP code is required",
                          })}
                          placeholder="10001"
                          error={errors.zipCode}
                        />
                        {errors.zipCode && (
                          <ErrorMessage message={errors.zipCode.message} />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="mr-2 h-5 w-5 text-green-400" />
                      Payment Information
                    </CardTitle>
                    <CardDescription>
                      Your payment details are secure and encrypted
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Card Number
                      </label>
                      <Input
                        {...register("cardNumber", {
                          required: "Card number is required",
                          pattern: {
                            value: /^[0-9]{16}$/,
                            message:
                              "Please enter a valid 16-digit card number",
                          },
                        })}
                        placeholder="1234 5678 9012 3456"
                        maxLength={16}
                        error={errors.cardNumber}
                      />
                      {errors.cardNumber && (
                        <ErrorMessage message={errors.cardNumber.message} />
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Expiry Date
                        </label>
                        <Input
                          {...register("expiryDate", {
                            required: "Expiry date is required",
                            pattern: {
                              value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                              message: "Please enter MM/YY format",
                            },
                          })}
                          placeholder="MM/YY"
                          maxLength={5}
                          error={errors.expiryDate}
                        />
                        {errors.expiryDate && (
                          <ErrorMessage message={errors.expiryDate.message} />
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          CVV
                        </label>
                        <Input
                          {...register("cvv", {
                            required: "CVV is required",
                            pattern: {
                              value: /^[0-9]{3,4}$/,
                              message: "Please enter a valid CVV",
                            },
                          })}
                          placeholder="123"
                          maxLength={4}
                          error={errors.cvv}
                        />
                        {errors.cvv && (
                          <ErrorMessage message={errors.cvv.message} />
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Cardholder Name
                      </label>
                      <Input
                        {...register("cardName", {
                          required: "Cardholder name is required",
                        })}
                        placeholder="John Doe"
                        error={errors.cardName}
                      />
                      {errors.cardName && (
                        <ErrorMessage message={errors.cardName.message} />
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        {...register("saveInfo")}
                        className="rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
                      />
                      <label className="text-sm text-gray-400">
                        Save payment information for future purchases
                      </label>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="space-y-6">
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <ShoppingBag className="mr-2 h-5 w-5 text-purple-400" />
                      Order Summary
                    </CardTitle>
                    <CardDescription>
                      {checkoutItems.length} items in your order
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Order Items */}
                    <div className="space-y-3 max-h-64 ">
                      {checkoutItems.map((item, index) => (
                        <CheckoutItem
                          key={item.productId || index}
                          item={item}
                          onUpdateQuantity={handleUpdateQuantity}
                          onRemove={handleRemoveItem}
                        />
                      ))}
                    </div>

                    {/* Order Totals */}
                    <div className="border-t border-gray-700 pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Subtotal:</span>
                        <span className="text-white">
                          ${subtotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Shipping:</span>
                        <span className="text-white">
                          {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Tax:</span>
                        <span className="text-white">${tax.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-gray-600 pt-2">
                        <div className="flex justify-between font-semibold text-lg">
                          <span className="text-white">Total:</span>
                          <span className="text-white">
                            ${total.toFixed(2)}
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

                    {/* Place Order Button */}
                    <Button
                      type="submit"
                      variant="default"
                      disabled={isProcessing}
                      className="w-full h-12 text-lg"
                    >
                      {isProcessing ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Processing...
                        </div>
                      ) : (
                        <>
                          <Lock className="mr-2 h-5 w-5" />
                          Place Order - ${total.toFixed(2)}
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-gray-400 text-center">
                      Your payment information is secure and encrypted
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
