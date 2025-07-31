export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header Skeleton */}
          <div className="text-center space-y-4">
            <div className="h-12 bg-gray-700/50 rounded-lg w-64 mx-auto animate-pulse"></div>
            <div className="h-6 bg-gray-700/50 rounded-lg w-96 mx-auto animate-pulse"></div>
          </div>

          {/* Search Skeleton */}
          <div className="bg-gray-800/50 rounded-lg p-6">
            <div className="h-10 bg-gray-700/50 rounded-lg animate-pulse"></div>
          </div>

          {/* Blog Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-800/50 rounded-lg overflow-hidden"
              >
                <div className="h-48 bg-gray-700/50 animate-pulse"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-700/50 rounded animate-pulse w-20"></div>
                  <div className="h-6 bg-gray-700/50 rounded animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-700/50 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-700/50 rounded animate-pulse w-3/4"></div>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-gray-700/50">
                    <div className="h-4 bg-gray-700/50 rounded animate-pulse w-16"></div>
                    <div className="flex space-x-4">
                      <div className="h-4 bg-gray-700/50 rounded animate-pulse w-8"></div>
                      <div className="h-4 bg-gray-700/50 rounded animate-pulse w-8"></div>
                      <div className="h-4 bg-gray-700/50 rounded animate-pulse w-8"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
