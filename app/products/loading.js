export default function Loading() {
  // A simple skeleton for a product card
  const ProductCardSkeleton = () => (
    <div className="relative group bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4 animate-pulse overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-cyan-600/10 blur-xl opacity-50"></div>
      <div className="relative z-10">
        <div className="w-full h-48 bg-gray-700 rounded-xl mb-4"></div>{" "}
        {/* Image placeholder */}
        <div className="h-6 bg-gray-700 rounded-md w-3/4 mb-2"></div>{" "}
        {/* Title placeholder */}
        <div className="h-4 bg-gray-700 rounded-md w-1/2 mb-4"></div>{" "}
        {/* Price placeholder */}
        <div className="flex justify-between items-center">
          <div className="h-10 bg-gray-700 rounded-xl w-24"></div>{" "}
          {/* Button placeholder */}
          <div className="h-8 bg-gray-700 rounded-full w-8"></div>{" "}
          {/* Icon placeholder */}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 p-4">
      <div className="container mx-auto py-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-12 bg-gray-700 rounded-xl w-1/2 mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-700 rounded-md w-3/4 animate-pulse"></div>
        </div>

        {/* Filters and Search Skeleton */}
        <div className="relative group mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-cyan-600/10 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
          <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md h-12 bg-gray-700 rounded-xl animate-pulse"></div>
              <div className="md:flex md:flex-wrap md:gap-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-10 bg-gray-700 rounded-xl w-24 animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Count Skeleton */}
        <div className="mb-6 h-6 bg-gray-700 rounded-md w-1/4 animate-pulse"></div>

        {/* Products Grid Skeleton */}
        <div className="grid gap-8 mb-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="flex items-center justify-center space-x-2 mt-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-10 w-10 bg-gray-700 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
