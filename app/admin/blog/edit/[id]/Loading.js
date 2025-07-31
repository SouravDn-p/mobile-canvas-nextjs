export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto p-6 max-w-6xl relative z-10">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4">
            <div className="h-10 w-32 bg-gray-700/50 rounded animate-pulse"></div>
            <div>
              <div className="h-8 w-48 bg-gray-700/50 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-32 bg-gray-700/50 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-10 w-24 bg-gray-700/50 rounded animate-pulse"></div>
            <div className="h-10 w-28 bg-gray-700/50 rounded animate-pulse"></div>
            <div className="h-10 w-24 bg-gray-700/50 rounded animate-pulse"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs Skeleton */}
            <div className="w-full">
              <div className="grid grid-cols-3 gap-1 bg-gray-800/50 border border-gray-700/50 rounded-lg p-1 mb-6">
                <div className="h-10 bg-gray-700/50 rounded animate-pulse"></div>
                <div className="h-10 bg-gray-700/50 rounded animate-pulse"></div>
                <div className="h-10 bg-gray-700/50 rounded animate-pulse"></div>
              </div>

              {/* Content Card Skeleton */}
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 space-y-4">
                <div className="h-6 w-32 bg-gray-700/50 rounded animate-pulse"></div>
                <div className="h-4 w-64 bg-gray-700/50 rounded animate-pulse"></div>

                <div className="space-y-4">
                  <div className="h-12 bg-gray-700/50 rounded animate-pulse"></div>
                  <div className="h-24 bg-gray-700/50 rounded animate-pulse"></div>
                  <div className="h-64 bg-gray-700/50 rounded animate-pulse"></div>
                </div>
              </div>

              {/* Image Card Skeleton */}
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 space-y-4 mt-6">
                <div className="h-6 w-32 bg-gray-700/50 rounded animate-pulse"></div>
                <div className="h-48 bg-gray-700/50 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-6">
            {/* Publish Settings Skeleton */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 space-y-4">
              <div className="h-6 w-32 bg-gray-700/50 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-700/50 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-700/50 rounded animate-pulse"></div>
              <div className="h-px bg-gray-700/50"></div>
              <div className="flex justify-between items-center">
                <div className="h-4 w-24 bg-gray-700/50 rounded animate-pulse"></div>
                <div className="h-6 w-12 bg-gray-700/50 rounded-full animate-pulse"></div>
              </div>
              <div className="flex justify-between items-center">
                <div className="h-4 w-28 bg-gray-700/50 rounded animate-pulse"></div>
                <div className="h-6 w-12 bg-gray-700/50 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Tags Skeleton */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 space-y-4">
              <div className="h-6 w-16 bg-gray-700/50 rounded animate-pulse"></div>
              <div className="flex gap-2">
                <div className="flex-1 h-10 bg-gray-700/50 rounded animate-pulse"></div>
                <div className="h-10 w-10 bg-gray-700/50 rounded animate-pulse"></div>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="h-6 w-16 bg-gray-700/50 rounded-full animate-pulse"></div>
                <div className="h-6 w-20 bg-gray-700/50 rounded-full animate-pulse"></div>
                <div className="h-6 w-14 bg-gray-700/50 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Blog Info Skeleton */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 space-y-3">
              <div className="h-6 w-32 bg-gray-700/50 rounded animate-pulse"></div>
              <div className="h-4 w-40 bg-gray-700/50 rounded animate-pulse"></div>
              <div className="h-4 w-36 bg-gray-700/50 rounded animate-pulse"></div>
              <div className="h-4 w-32 bg-gray-700/50 rounded animate-pulse"></div>
              <div className="h-4 w-28 bg-gray-700/50 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
