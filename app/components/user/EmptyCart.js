import React from "react";
import Button from "../ui/button";
import { ShoppingBag } from "lucide-react";
import CardContent from "../ui/cardContent";
import Card from "../ui/card";
import { useRouter } from "next/navigation";

const EmptyCart = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        <CardContent className="p-6 sm:p-8">
          <ShoppingBag className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Your Cart is Empty
          </h2>
          <p className="text-gray-400 mb-6 text-sm sm:text-base">
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
};

export default EmptyCart;
