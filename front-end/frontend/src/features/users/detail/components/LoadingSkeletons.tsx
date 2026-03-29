import React from "react";

const LoadingSkeletons: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-8 py-8 space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse" />
          </div>

          <div className="flex-1 space-y-3">
            <div className="h-8 bg-gray-200 rounded-lg animate-pulse w-1/3" />
            <div className="flex gap-3">
              <div className="h-6 bg-gray-200 rounded-full animate-pulse w-24" />
              <div className="h-6 bg-gray-200 rounded-full animate-pulse w-32" />
            </div>
            <div className="flex gap-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
            </div>
          </div>

          <div className="flex gap-2">
            <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-32" />
            <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-32" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3 mb-6" />

          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
              <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-3">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3 mb-6" />

          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex justify-between items-center py-3 border-b border-gray-200"
            >
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="h-6 bg-gray-200 rounded animate-pulse w-1/4 mb-6" />

        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border-2 border-red-200 p-6 space-y-4">
        <div className="h-6 bg-gray-200 rounded animate-pulse w-1/4" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
              <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeletons;
