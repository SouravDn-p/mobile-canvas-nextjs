import React from "react";
import Card from "../ui/card";
import CardContent from "../ui/cardContent";
import { CheckCircle } from "lucide-react";
import Button from "../ui/button";
import { useRouter } from "next/navigation";

const OrderDone = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        <CardContent className="p-6 sm:p-8">
          <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Order Placed Successfully!
          </h2>
          <p className="text-gray-400 mb-6 text-sm sm:text-base">
            Thank you for your purchase. You&apos;ll receive a confirmation
            email shortly.
          </p>
          <div className="space-y-3">
            <Button
              variant="default"
              onClick={() => router.push("/user/orders")}
              className="w-full cursor-pointer"
            >
              View Orders
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="w-full cursor-pointer"
            >
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDone;
