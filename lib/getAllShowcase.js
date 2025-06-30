export default function getAllShowcase(){
    const showcase = [
      {
        id: "1",
        name: "iPhone 15 Pro",
        category: "Smartphone",
        price: 999,
        image:
          "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg",
        icon: Smartphone,
        color: "from-blue-500 to-purple-600",
        description: "Revolutionary A17 Pro chip",
        features: ["Titanium Design", "48MP Camera", "Action Button"],
      },
      {
        id: "2",
        name: "iPad Pro",
        category: "Tablet",
        price: 799,
        image:
          "https://images.pexels.com/photos/1334598/pexels-photo-1334598.jpeg",
        icon: Tablet,
        color: "from-green-500 to-emerald-600",
        description: "M2 chip performance",
        features: ["Liquid Retina", "Apple Pencil", "Magic Keyboard"],
      },
      {
        id: "3",
        name: "MacBook Pro",
        category: "Laptop",
        price: 1999,
        image: "https://images.pexels.com/photos/18105/pexels-photo.jpg",
        icon: Laptop,
        color: "from-purple-500 to-pink-600",
        description: "M3 Pro unleashed",
        features: ["16-inch Display", "22-hour Battery", "Studio Quality"],
      },
      {
        id: "4",
        name: "AirPods Pro",
        category: "Audio",
        price: 249,
        image:
          "https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg",
        icon: Headphones,
        color: "from-orange-500 to-red-600",
        description: "Adaptive Audio magic",
        features: ["Noise Cancelling", "Spatial Audio", "USB-C"],
      },
      {
        id: "5",
        name: "Apple Watch",
        category: "Wearable",
        price: 399,
        image:
          "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg",
        icon: Watch,
        color: "from-teal-500 to-cyan-600",
        description: "Health at your wrist",
        features: ["ECG Monitor", "Fitness Tracking", "Always-On Display"],
      },
      {
        id: "6",
        name: "Sony Camera",
        category: "Camera",
        price: 1299,
        image: "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg",
        icon: Camera,
        color: "from-indigo-500 to-blue-600",
        description: "Professional imaging",
        features: ["4K Video", "Image Stabilization", "Pro Lens"],
      },
    ];

    return showcase
}

