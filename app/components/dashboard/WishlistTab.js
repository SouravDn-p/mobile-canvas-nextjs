import React from "react";
import Button from "../ui/button";
import { ShoppingBag } from "lucide-react";
import Badge from "../ui/badge";
import Image from "next/image";
import CardContent from "../ui/cardContent";
import { CardDescription, CardTitle } from "../ui/radix/card";
import CardHeader from "../ui/cardHeader";
import Card from "../ui/card";
import { TabsContent } from "@radix-ui/react-tabs";

const WishlistTab = () => {
  const wishlist = [
    {
      id: "1",
      name: "Samsung Galaxy S24 Ultra",
      price: 1099,
      image:
        "https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg",
      inStock: true,
    },
    {
      id: "2",
      name: "Sony WH-1000XM5",
      price: 399,
      image:
        "https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg",
      inStock: true,
    },
    {
      id: "3",
      name: "Dell XPS 13",
      price: 1199,
      image: "https://images.pexels.com/photos/18105/pexels-photo.jpg",
      inStock: false,
    },
  ];
  return (
    <TabsContent value="wishlist" className="space-y-6">
      <Card className="glass border-white/10">
        <CardHeader>
          <CardTitle className="text-white">My Wishlist</CardTitle>
          <CardDescription className="text-gray-400">
            Items you&apos;ve saved for later
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="glass rounded-lg p-4 border border-white/5"
              >
                <Image
                  width={500}
                  height={500}
                  src={item.image}
                  alt={item.name}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h4 className="font-semibold text-white mb-2">{item.name}</h4>
                <div className="flex items-center justify-between">
                  <p className="text-green-400 font-semibold">${item.price}</p>
                  <Badge
                    className={
                      item.inStock
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }
                  >
                    {item.inStock ? "In Stock" : "Out of Stock"}
                  </Badge>
                </div>
                <div className="flex space-x-2 mt-3">
                  <Button
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-green-500 cursor-pointer to-emerald-400 hover:from-green-600 hover:to-emerald-500 text-black"
                    disabled={!item.inStock}
                  >
                    <ShoppingBag className="mr-1 h-3 w-3" />
                    Add to Cart
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 cursor-pointer"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default WishlistTab;
