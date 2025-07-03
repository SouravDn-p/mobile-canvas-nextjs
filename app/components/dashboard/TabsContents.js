import React from "react";
import Card from "../ui/card";
import CardHeader from "../ui/cardHeader";
import { CardDescription, CardTitle } from "../ui/radix/card";
import CardContent from "../ui/cardContent";
import { Badge } from "lucide-react";
import Image from "next/image";
import { TabsContent } from "@radix-ui/react-tabs";

// Mock order history
const orderHistory = [
  {
    id: "ORD-001",
    date: "2024-01-15",
    status: "delivered",
    total: 1199.99,
    items: [
      {
        name: "iPhone 15 Pro Max",
        price: 1199.99,
        quantity: 1,
        image:
          "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg",
      },
    ],
  },
  {
    id: "ORD-002",
    date: "2024-01-10",
    status: "shipped",
    total: 899.99,
    items: [
      {
        name: 'iPad Pro 12.9"',
        price: 899.99,
        quantity: 1,
        image:
          "https://images.pexels.com/photos/1334598/pexels-photo-1334598.jpeg",
      },
    ],
  },
  {
    id: "ORD-003",
    date: "2024-01-05",
    status: "processing",
    total: 649.98,
    items: [
      {
        name: "AirPods Pro",
        price: 249.99,
        quantity: 1,
        image:
          "https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg",
      },
      {
        name: "Apple Watch Series 9",
        price: 399.99,
        quantity: 1,
        image:
          "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg",
      },
    ],
  },
  {
    id: "ORD-004",
    date: "2023-12-20",
    status: "cancelled",
    total: 1299.99,
    items: [
      {
        name: 'MacBook Pro 16"',
        price: 1299.99,
        quantity: 1,
        image: "https://images.pexels.com/photos/18105/pexels-photo.jpg",
      },
    ],
  },
];

const TabsContents = ({ getStatusIcon, getStatusColor }) => {
  return (
    <TabsContent value="orders" className="space-y-6">
      <Card className="glass border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Order History</CardTitle>
          <CardDescription className="text-gray-400">
            View and track your orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orderHistory.map((order) => (
              <div
                key={order.id}
                className="glass rounded-lg p-4 border border-white/5"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h4 className="font-semibold text-white">{order.id}</h4>
                      <p className="text-sm text-gray-400">
                        {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">
                      ${order.total.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-400">
                      {order.items.length} item(s)
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Image
                        width={500}
                        height={500}
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="text-white text-sm">{item.name}</p>
                        <p className="text-gray-400 text-xs">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-white text-sm">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default TabsContents;
