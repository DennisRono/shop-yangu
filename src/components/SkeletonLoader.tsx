import React from 'react'

const SkeletonLoader = () => {
  return (
    <div className="space-y-4">
      {Array(3)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className="animate-pulse border border-gray-300 rounded-lg p-4"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="bg-gray-300 rounded-full w-10 h-10"></div>
                <div className="h-4 bg-gray-300 rounded w-32"></div>
              </div>
              <div className="h-4 bg-gray-300 rounded w-20"></div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>
        ))}
    </div>
  )
}

export default SkeletonLoader
