export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header Skeleton */}
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-8 bg-gray-700/50 rounded-lg w-64 animate-pulse"></div>
              <div className="h-4 bg-gray-700/50 rounded-lg w-48 animate-pulse"></div>
            </div>
            <div className="h-10 bg-gray-700/50 rounded-lg w-32 animate-pulse"></div>
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-gray-800/50 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-700/50 rounded animate-pulse w-16"></div>
                    <div className="h-8 bg-gray-700/50 rounded animate-pulse w-12"></div>
                  </div>
                  <div className="w-12 h-12 bg-gray-700/50 rounded-lg animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Search Skeleton */}
          <div className="bg-gray-800/50 rounded-lg p-6">
            <div className="h-10 bg-gray-700/50 rounded-lg animate-pulse"></div>
          </div>

          {/* Table Skeleton */}
          <div className="bg-gray-800/50 rounded-lg">
            <div className="p-6 border-b border-gray-700/50">
              <div className="h-6 bg-gray-700/50 rounded animate-pulse w-32"></div>
            </div>
            <div className="p-6 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-lg"
                >
                  <div className="w-4 h-4 bg-gray-700/50 rounded animate-pulse"></div>
                  <div className="w-16 h-16 bg-gray-700/50 rounded-lg animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-700/50 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-700/50 rounded animate-pulse w-3/4"></div>
                    <div className="flex space-x-4">
                      <div className="h-3 bg-gray-700/50 rounded animate-pulse w-16"></div>
                      <div className="h-3 bg-gray-700/50 rounded animate-pulse w-20"></div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-8 h-8 bg-gray-700/50 rounded animate-pulse"></div>
                    <div className="w-8 h-8 bg-gray-700/50 rounded animate-pulse"></div>
                    <div className="w-8 h-8 bg-gray-700/50 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
