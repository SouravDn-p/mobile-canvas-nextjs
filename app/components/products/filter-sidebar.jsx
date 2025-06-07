"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ProductCard from "@/app/components/products/filter-sidebar";
import FilterSidebar from "@/app/components/products/filter-sidebar";

// Enhanced product data with more details
const products = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    price: 1199,
    originalPrice: 1299,
    category: "phones",
    brand: "Apple",
    image: "/placeholder.svg?height=400&width=400",
    description:
      "The most advanced iPhone ever with titanium design and A17 Pro chip for unprecedented performance.",
    features: [
      "6.7-inch Super Retina XDR display",
      "A17 Pro chip with 6-core GPU",
      "48MP Main camera with 5x zoom",
      "Up to 29 hours video playback",
      "Titanium design",
      "Action Button",
    ],
    inStock: true,
    rating: 4.9,
    reviews: 1250,
    discount: 8,
  },
  {
    id: 2,
    name: "Samsung Galaxy S24 Ultra",
    price: 1099,
    category: "phones",
    brand: "Samsung",
    image: "/placeholder.svg?height=400&width=400",
    description:
      "Ultimate Android flagship with S Pen and revolutionary 200MP camera system for professional photography.",
    features: [
      "6.8-inch Dynamic AMOLED 2X",
      "Snapdragon 8 Gen 3 for Galaxy",
      "200MP camera with AI zoom",
      "S Pen included",
      "Titanium frame",
      "Galaxy AI features",
    ],
    inStock: true,
    rating: 4.8,
    reviews: 980,
  },
  {
    id: 3,
    name: "Google Pixel 8 Pro",
    price: 899,
    category: "phones",
    brand: "Google",
    image: "/placeholder.svg?height=400&width=400",
    description:
      "Pure Android experience with advanced AI photography features and 7 years of guaranteed updates.",
    features: [
      "6.7-inch LTPO OLED display",
      "Google Tensor G3 chip",
      "50MP Triple camera system",
      "7 years of OS updates",
      "Magic Eraser",
      "Call Screen",
    ],
    inStock: true,
    rating: 4.7,
    reviews: 650,
  },
  {
    id: 4,
    name: "iPad Pro 12.9-inch",
    price: 1099,
    category: "tablets",
    brand: "Apple",
    image: "/placeholder.svg?height=400&width=400",
    description:
      "Professional-grade tablet with M2 chip and stunning Liquid Retina XDR display for creative professionals.",
    features: [
      "12.9-inch Liquid Retina XDR",
      "M2 chip with 8-core CPU",
      "12MP Ultra Wide front camera",
      "Apple Pencil (2nd gen) support",
      "Thunderbolt / USB 4",
      "Face ID",
    ],
    inStock: true,
    rating: 4.9,
    reviews: 450,
  },
  {
    id: 5,
    name: "Samsung Galaxy Tab S9+",
    price: 799,
    category: "tablets",
    brand: "Samsung",
    image: "/placeholder.svg?height=400&width=400",
    description:
      "Premium Android tablet with S Pen and gorgeous AMOLED display for productivity and entertainment.",
    features: [
      "12.4-inch Dynamic AMOLED 2X",
      "Snapdragon 8 Gen 2 for Galaxy",
      "13MP rear camera",
      "S Pen included",
      "IP68 water resistance",
      "DeX mode",
    ],
    inStock: true,
    rating: 4.6,
    reviews: 320,
  },
  {
    id: 6,
    name: "Sony WH-1000XM5",
    price: 399,
    category: "accessories",
    brand: "Sony",
    image: "/placeholder.svg?height=400&width=400",
    description:
      "Industry-leading noise canceling wireless headphones with exceptional sound quality and comfort.",
    features: [
      "30-hour battery life",
      "Multipoint Bluetooth connection",
      "Speak-to-Chat technology",
      "Quick Charge (3 min = 3 hours)",
      "Hi-Res Audio Wireless",
      "Touch controls",
    ],
    inStock: true,
    rating: 4.8,
    reviews: 1999,
  },
  {
    id: 7,
    name: "Apple AirPods Pro (2nd Gen)",
    price: 249,
    category: "accessories",
    brand: "Apple",
    image: "/placeholder.svg?height=400&width=400",
    description:
      "Wireless earbuds with active noise cancellation and spatial audio for immersive listening experience.",
    features: [
      "Active Noise Cancellation",
      "Spatial Audio with head tracking",
      "Up to 6 hours listening time",
      "MagSafe charging case",
      "Sweat and water resistant",
      "Touch controls",
    ],
    inStock: true,
    rating: 4.7,
    reviews: 2150,
  },
  {
    id: 8,
    name: "MacBook Pro 14-inch",
    price: 1999,
    category: "laptops",
    brand: "Apple",
    image: "/placeholder.svg?height=400&width=400",
    description:
      "Powerful laptop with M3 Pro chip designed for professional workflows and creative tasks.",
    features: [
      "14-inch Liquid Retina XDR display",
      "M3 Pro chip with 11-core CPU",
      "18-hour battery life",
      "Three Thunderbolt 4 ports",
      "1080p FaceTime HD camera",
      "Studio-quality mics",
    ],
    inStock: true,
    rating: 4.9,
    reviews: 780,
  },
  {
    id: 9,
    name: "Dell XPS 13",
    price: 1699,
    category: "laptops",
    brand: "Dell",
    image: "/placeholder.svg?height=400&width=400",
    description:
      "Ultra-portable laptop with stunning InfinityEdge display and premium build quality.",
    features: [
      "13.4-inch InfinityEdge display",
      "Intel Core i7-1360P",
      "16GB LPDDR5 RAM",
      "512GB PCIe SSD",
      "Killer Wi-Fi 6E",
      "Windows 11 Pro",
    ],
    inStock: true,
    rating: 4.6,
    reviews: 450,
  },
  {
    id: 10,
    name: "Apple Watch Series 9",
    price: 399,
    category: "wearables",
    brand: "Apple",
    image: "/placeholder.svg?height=400&width=400",
    description:
      "Advanced smartwatch with comprehensive health monitoring and innovative Double Tap gesture.",
    features: [
      "Always-On Retina display",
      "S9 SiP with Neural Engine",
      "Double Tap gesture",
      "Up to 18 hours battery life",
      "Blood Oxygen monitoring",
      "ECG app",
    ],
    inStock: true,
    rating: 4.8,
    reviews: 1200,
  },
  {
    id: 11,
    name: "Samsung Galaxy Watch 6",
    price: 329,
    category: "wearables",
    brand: "Samsung",
    image: "/placeholder.svg?height=400&width=400",
    description:
      "Comprehensive health and fitness tracking smartwatch with advanced sleep monitoring.",
    features: [
      "1.3-inch Super AMOLED display",
      "Exynos W930 processor",
      "Advanced sleep tracking",
      "40-hour battery life",
      "Body composition analysis",
      "Wear OS powered by Samsung",
    ],
    inStock: true,
    rating: 4.5,
    reviews: 680,
  },
  {
    id: 12,
    name: "Anker PowerCore 10000",
    price: 29,
    category: "accessories",
    brand: "Anker",
    image: "/placeholder.svg?height=400&width=400",
    description:
      "Compact portable charger with fast charging technology and universal compatibility.",
    features: [
      "10,000mAh capacity",
      "PowerIQ 3.0 technology",
      "Ultra-compact design",
      "Multi-device charging",
      "LED power indicator",
      "18-month warranty",
    ],
    inStock: true,
    rating: 4.7,
    reviews: 3200,
  },
];

const categories = [
  { id: "phones", name: "Smartphones", icon: "📱" },
  { id: "tablets", name: "Tablets", icon: "📟" },
  { id: "laptops", name: "Laptops", icon: "💻" },
  { id: "accessories", name: "Accessories", icon: "🎧" },
  { id: "wearables", name: "Wearables", icon: "⌚" },
];

const brands = ["Apple", "Samsung", "Google", "Sony", "Dell", "Anker"];

export default function Products() {
  const { category } = useParams();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(category || "");
  const [sortBy, setSortBy] = useState("name");
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    // Simulate loading delay for better UX
    const timer = setTimeout(() => {
      let filtered = products;

      // Filter by category
      if (selectedCategory) {
        filtered = filtered.filter(
          (product) => product.category === selectedCategory
        );
      }

      // Filter by search term
      if (searchTerm) {
        filtered = filtered.filter(
          (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            product.features.some((feature) =>
              feature.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
      }

      // Filter by brand
      if (selectedBrand) {
        filtered = filtered.filter(
          (product) => product.brand === selectedBrand
        );
      }

      // Filter by price range
      filtered = filtered.filter(
        (product) =>
          product.price >= priceRange[0] && product.price <= priceRange[1]
      );

      // Sort products
      filtered.sort((a, b) => {
        switch (sortBy) {
          case "price-low":
            return a.price - b.price;
          case "price-high":
            return b.price - a.price;
          case "rating":
            return b.rating - a.rating;
          case "reviews":
            return b.reviews - a.reviews;
          case "newest":
            return b.id - a.id;
          case "name":
          default:
            return a.name.localeCompare(b.name);
        }
      });

      setFilteredProducts(filtered);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedCategory, searchTerm, selectedBrand, sortBy, priceRange]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedBrand("");
    setSelectedCategory("");
    setPriceRange([0, 2000]);
    setSortBy("name");
  };

  const currentCategory = categories.find((cat) => cat.id === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-400 mb-4">
            <span>Home</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
            <span>Products</span>
            {currentCategory && (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                <span>{currentCategory.name}</span>
              </>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {currentCategory ? (
                  <span className="flex items-center">
                    <span className="mr-3 text-5xl">
                      {currentCategory.icon}
                    </span>
                    {currentCategory.name}
                  </span>
                ) : (
                  "All Products"
                )}
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl">
                {currentCategory
                  ? `Discover our premium collection of ${currentCategory.name.toLowerCase()} with cutting-edge technology and innovative features.`
                  : "Explore our complete range of mobile devices, laptops, and premium tech accessories."}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <FilterSidebar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            sortBy={sortBy}
            setSortBy={setSortBy}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            brands={brands}
            categories={categories}
            onClearFilters={handleClearFilters}
          />

          {/* Products Grid */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 bg-gray-900/90 backdrop-blur-xl rounded-xl p-4 shadow-lg border border-gray-700">
              <div className="mb-4 sm:mb-0">
                <p className="text-gray-300">
                  {loading ? (
                    "Loading products..."
                  ) : (
                    <>
                      Showing{" "}
                      <span className="font-semibold">
                        {filteredProducts.length}
                      </span>{" "}
                      product
                      {filteredProducts.length !== 1 ? "s" : ""}
                      {searchTerm && (
                        <span>
                          {" "}
                          for "
                          <span className="font-semibold">{searchTerm}</span>"
                        </span>
                      )}
                    </>
                  )}
                </p>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid"
                      ? "bg-indigo-900/50 text-indigo-400 border border-indigo-700"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list"
                      ? "bg-indigo-900/50 text-indigo-400 border border-indigo-700"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-700 overflow-hidden"
                  >
                    <div className="aspect-square bg-gradient-to-br from-gray-700 to-gray-800 animate-pulse" />
                    <div className="p-6 space-y-3">
                      <div className="h-4 bg-gray-700 rounded animate-pulse" />
                      <div className="h-6 bg-gray-700 rounded animate-pulse" />
                      <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse" />
                      <div className="h-10 bg-gray-700 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Products Display */}
            {!loading && (
              <>
                {filteredProducts.length > 0 ? (
                  <div
                    className={`grid gap-6 ${
                      viewMode === "grid"
                        ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                        : "grid-cols-1"
                    }`}
                  >
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-700">
                    <div className="text-8xl mb-6">🔍</div>
                    <h3 className="text-3xl font-bold text-white mb-4">
                      No products found
                    </h3>
                    <p className="text-gray-300 text-lg mb-8 max-w-md mx-auto">
                      We couldn't find any products matching your criteria. Try
                      adjusting your filters or search terms.
                    </p>
                    <button
                      onClick={handleClearFilters}
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
