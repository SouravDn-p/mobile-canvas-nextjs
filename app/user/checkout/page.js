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
  Smartphone,
  Building2,
  Wallet,
} from "lucide-react";
import { useSession } from "next-auth/react";
import {
  useGetUserByEmailQuery,
  usePlaceOrderMutation,
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
import OrderDone from "@/app/components/user/OrderDone";
import EmptyCart from "@/app/components/user/EmptyCart";

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
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 border border-gray-700 rounded-lg bg-gray-800/20">
      <div className="w-full sm:w-12 h-24 sm:h-12 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
        <Image
          src={item.image || "/placeholder.svg?height=64&width=64"}
          alt={item.name}
          width={64}
          height={64}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0 w-full sm:w-auto">
        <h4 className="font-medium text-white text-sm truncate">{item.name}</h4>
        <p className="text-xs text-gray-400">${item.price} each</p>
      </div>

      <div className="flex items-center justify-between w-full sm:w-auto gap-2">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="xsm"
            onClick={() =>
              onUpdateQuantity(item.productId, Math.max(1, item.quantity - 1))
            }
            className="w-6 h-6 p-0"
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-6 text-center text-white text-xs">
            {item.quantity}
          </span>
          <Button
            variant="outline"
            size="xsm"
            onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
            className="w-6 h-6 p-0"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        <div className="text-right">
          <p className="font-medium text-white text-sm">
            ৳ {(item.price * item.quantity).toFixed(2)}
          </p>
          <Button
            variant="admin"
            size="sm"
            onClick={() => onRemove(item.productId)}
            className="text-red-400  hover:text-red-300 p-0 h-12 w-12"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Payment Method Selection Component
const PaymentMethodCard = ({
  method,
  selected,
  onSelect,
  icon: Icon,
  title,
  description,
  logo,
}) => (
  <div
    onClick={() => onSelect(method)}
    className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
      selected
        ? "border-blue-500 bg-blue-500/10"
        : "border-gray-600 hover:border-gray-500 bg-gray-800/30"
    }`}
  >
    <div className="flex items-center space-x-3">
      <div
        className={`p-2 rounded-lg ${
          selected ? "bg-blue-500/20" : "bg-gray-700/50"
        }`}
      >
        {logo ? (
          <Image
            src={logo || "/placeholder.svg"}
            alt={title}
            width={24}
            height={24}
            className="w-6 h-6"
          />
        ) : (
          <Icon
            className={`h-6 w-6 ${
              selected ? "text-blue-400" : "text-gray-400"
            }`}
          />
        )}
      </div>
      <div className="flex-1">
        <h4
          className={`font-medium ${selected ? "text-blue-300" : "text-white"}`}
        >
          {title}
        </h4>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
      <div
        className={`w-4 h-4 rounded-full border-2 ${
          selected ? "border-blue-500 bg-blue-500" : "border-gray-500"
        }`}
      >
        {selected && (
          <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
        )}
      </div>
    </div>
  </div>
);

export default function CheckoutPage() {
  const { data: session, isLoading: loading, status } = useSession();
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
  const [placeOrder, { isLoading: loadingPlaceOrder, isSuccess, error }] =
    usePlaceOrderMutation();

  // State
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");

  // Payment methods available in Bangladesh
  const paymentMethods = [
    // {
    //   id: "card",
    //   title: "Credit/Debit Card",
    //   description: "Visa, Mastercard, American Express",
    //   icon: CreditCard,
    // },
    // {
    //   id: "bkash",
    //   title: "bKash",
    //   description: "Mobile Financial Service",
    //   icon: Smartphone,
    //   color: "text-pink-400",
    // },
    // {
    //   id: "rocket",
    //   title: "Rocket",
    //   description: "Dutch-Bangla Bank Mobile Banking",
    //   icon: Smartphone,
    //   color: "text-purple-400",
    // },
    // {
    //   id: "nagad",
    //   title: "Nagad",
    //   description: "Digital Financial Service",
    //   icon: Smartphone,
    //   color: "text-orange-400",
    // },
    // {
    //   id: "upay",
    //   title: "Upay",
    //   description: "UCB Fintech Company Limited",
    //   icon: Smartphone,
    //   color: "text-green-400",
    // },
    {
      id: "sslcommerz",
      title: "SSLCommerz",
      description: "All major banks & mobile banking",
      icon: Building2,
      color: "text-blue-400",
    },
    {
      id: "Cash On Delivery",
      title: "Cash On Delivery",
      description: "Hand Cash ",
      icon: Wallet,
      color: "text-blue-400",
    },
  ];

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
      country: "Bangladesh",

      // Payment Information
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardName: "",

      // Mobile Banking
      mobileNumber: "",
      transactionPin: "",

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
  if (status === "loading" || isLoading || loading) {
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
  const shipping = subtotal > 500 ? 0 : 120; // Free shipping for orders over 500 BDT, otherwise 120 BDT
  const total = subtotal + shipping;

  const onSubmit = async (formData) => {
    setIsProcessing(true);

    try {
      // Simulate order processing
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const shippingAddress = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
      };

      // Create order object
      const order = {
        items: checkoutItems,
        total: total,
        status: "processing",
        payment: "pending",
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
          type: paymentMethod,
          ...(paymentMethod === "card"
            ? { last4: formData.cardNumber.slice(-4) }
            : { mobileNumber: formData.mobileNumber }),
        },
        createdAt: new Date().toISOString(),
      };

      await placeOrder({ order });

      // Clear cart after successful order
      await updateUser({
        email,
        data: { cart: [], shippingAddress: shippingAddress },
      }).unwrap();

      setOrderComplete(true);
    } catch (error) {
      console.error("Order processing failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderComplete) {
    return <OrderDone />;
  }

  if (checkoutItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto py-4 sm:py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button variant="outline" onClick={() => router.back()} size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Checkout
              </h1>
              <p className="mt-1 sm:mt-2 text-gray-400 text-xs sm:text-sm lg:text-base">
                Complete your purchase securely
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                {/* Shipping Information */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-base sm:text-lg">
                      <MapPin className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                      Shipping Information
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Where should we deliver your order?
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">
                          First Name
                        </label>
                        <Input
                          {...register("firstName", {
                            required: "First name is required",
                          })}
                          placeholder="Sourav"
                          defaultValue={
                            userData?.user.shippingAddress?.firstName
                          }
                          error={errors.firstName}
                        />
                        {errors.firstName && (
                          <ErrorMessage message={errors.firstName.message} />
                        )}
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">
                          Last Name
                        </label>
                        <Input
                          {...register("lastName", {
                            required: "Last name is required",
                          })}
                          placeholder="Debnath"
                          defaultValue={userData?.shippingAddress?.lastName}
                          error={errors.lastName}
                        />
                        {errors.lastName && (
                          <ErrorMessage message={errors.lastName.message} />
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">
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
                          value={user?.email}
                          readOnly
                          placeholder="mobileCampus@gmail.com"
                          error={errors.email}
                          className="opacity-75"
                        />
                        {errors.email && (
                          <ErrorMessage message={errors.email.message} />
                        )}
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">
                          Phone
                        </label>
                        <Input
                          {...register("phone", {
                            required: "Phone number is required",
                          })}
                          placeholder="+880 1234-567890"
                          defaultValue={userData?.shippingAddress?.phone}
                          error={errors.phone}
                        />
                        {errors.phone && (
                          <ErrorMessage message={errors.phone.message} />
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">
                        Address
                      </label>
                      <Input
                        {...register("address", {
                          required: "Address is required",
                        })}
                        placeholder="Kalikaccha Nathpara"
                        defaultValue={userData?.shippingAddress?.address}
                        error={errors.address}
                      />
                      {errors.address && (
                        <ErrorMessage message={errors.address.message} />
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">
                          City
                        </label>
                        <Input
                          {...register("city", {
                            required: "City is required",
                          })}
                          placeholder="Brahmanbaria"
                          defaultValue={userData?.shippingAddress?.city}
                          error={errors.city}
                        />
                        {errors.city && (
                          <ErrorMessage message={errors.city.message} />
                        )}
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">
                          Division
                        </label>
                        <Select
                          {...register("state", {
                            required: "Division is required",
                          })}
                          defaultValue={userData?.shippingAddress?.state}
                          error={errors.state}
                        >
                          <option value="">Select Division</option>
                          <option value="Chittagong">Chittagong</option>
                          <option value="Dhaka">Dhaka</option>
                          <option value="Sylhet">Sylhet</option>
                          <option value="Rajshahi">Rajshahi</option>
                          <option value="Khulna">Khulna</option>
                          <option value="Barisal">Barisal</option>
                          <option value="Rangpur">Rangpur</option>
                          <option value="Mymensingh">Mymensingh</option>
                        </Select>
                        {errors.state && (
                          <ErrorMessage message={errors.state.message} />
                        )}
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">
                          Postal Code
                        </label>
                        <Input
                          {...register("zipCode", {
                            required: "Postal code is required",
                          })}
                          placeholder="3400"
                          defaultValue={userData?.shippingAddress?.zipCode}
                          error={errors.zipCode}
                        />
                        {errors.zipCode && (
                          <ErrorMessage message={errors.zipCode.message} />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method Selection */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-base sm:text-lg">
                      <Wallet className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
                      Payment Method
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Choose your preferred payment method
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {paymentMethods.map((method) => (
                        <PaymentMethodCard
                          key={method.id}
                          method={method.id}
                          selected={paymentMethod === method.id}
                          onSelect={setPaymentMethod}
                          icon={method.icon}
                          title={method.title}
                          description={method.description}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Information */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-base sm:text-lg">
                      <CreditCard className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                      Payment Details
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      {paymentMethod === "card"
                        ? "Your payment details are secure and encrypted"
                        : "Enter your mobile banking details"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {paymentMethod === "card" ? (
                      // Credit Card Form
                      <>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">
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
                            <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">
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
                              <ErrorMessage
                                message={errors.expiryDate.message}
                              />
                            )}
                          </div>
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">
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
                          <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">
                            Cardholder Name
                          </label>
                          <Input
                            {...register("cardName", {
                              required: "Cardholder name is required",
                            })}
                            placeholder="Sourav Rahman"
                            error={errors.cardName}
                          />
                          {errors.cardName && (
                            <ErrorMessage message={errors.cardName.message} />
                          )}
                        </div>
                      </>
                    ) : (
                      // Mobile Banking Form
                      <>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">
                            Mobile Number
                          </label>
                          <Input
                            {...register("mobileNumber", {
                              required: "Mobile number is required",
                              pattern: {
                                value: /^(\+880|880|0)?1[3-9]\d{8}$/,
                                message:
                                  "Please enter a valid Bangladeshi mobile number",
                              },
                            })}
                            placeholder="+880 1234-567890"
                            error={errors.mobileNumber}
                          />
                          {errors.mobileNumber && (
                            <ErrorMessage
                              message={errors.mobileNumber.message}
                            />
                          )}
                        </div>

                        {(paymentMethod === "bkash" ||
                          paymentMethod === "rocket" ||
                          paymentMethod === "nagad") && (
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">
                              Transaction PIN
                            </label>
                            <Input
                              {...register("transactionPin", {
                                required: "Transaction PIN is required",
                                pattern: {
                                  value: /^[0-9]{4,6}$/,
                                  message:
                                    "Please enter a valid PIN (4-6 digits)",
                                },
                              })}
                              type="password"
                              placeholder="Enter your PIN"
                              maxLength={6}
                              error={errors.transactionPin}
                            />
                            {errors.transactionPin && (
                              <ErrorMessage
                                message={errors.transactionPin.message}
                              />
                            )}
                          </div>
                        )}

                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                          <p className="text-xs sm:text-sm text-blue-300">
                            You will be redirected to{" "}
                            {
                              paymentMethods.find((m) => m.id === paymentMethod)
                                ?.title
                            }{" "}
                            to complete the payment.
                          </p>
                        </div>
                      </>
                    )}

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        {...register("saveInfo")}
                        className="rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
                      />
                      <label className="text-xs sm:text-sm text-gray-400">
                        Save payment information for future purchases
                      </label>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="space-y-4 sm:space-y-6">
                <Card className="sticky top-4">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-base sm:text-lg">
                      <ShoppingBag className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
                      Order Summary
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      {checkoutItems.length} items in your order
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Order Items */}
                    <div className="space-y-2 max-h-48 sm:max-h-64 overflow-y-auto">
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
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-400">Subtotal:</span>
                        <span className="text-white">
                          ৳ {(subtotal ).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-400">Shipping:</span>
                        <span className="text-white">
                          {shipping === 0
                            ? "Free"
                            : `৳  ${(shipping ).toFixed(2)}`}
                        </span>
                      </div>
                      {/* <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-400">Tax:</span>
                        <span className="text-white">
                          ৳{(tax ).toFixed(2)}
                        </span>
                      </div> */}
                      <div className="border-t border-gray-600 pt-2">
                        <div className="flex justify-between font-semibold text-sm sm:text-lg">
                          <span className="text-white">Total:</span>
                          <span className="text-white">
                            ৳ {(total ).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Free Shipping Notice */}
                    {subtotal < 50 && (
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                        <p className="text-xs sm:text-sm text-blue-300">
                          Add ৳ {((50 - subtotal) ).toFixed(2)} more for
                          free shipping!
                        </p>
                      </div>
                    )}

                    {/* Place Order Button */}
                    <Button
                      type="submit"
                      variant="default"
                      disabled={isProcessing}
                      className="w-full h-10 sm:h-12 text-sm sm:text-lg cursor-pointer"
                    >
                      {isProcessing ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                          Processing...
                        </div>
                      ) : (
                        <>
                          <Lock className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                          Place Order - ৳ {(total ).toFixed(2)}
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
