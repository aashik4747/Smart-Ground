import React from 'react';

export const PageLoader = ({ message = "Loading...", size = "medium" }) => {
  const sizeClasses = {
    small: "h-8 w-8",
    medium: "h-12 w-12", 
    large: "h-16 w-16"
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative">
        <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-200 border-t-indigo-600 shadow-lg`}></div>
        <div className={`absolute inset-0 ${sizeClasses[size]} rounded-full border-2 border-transparent border-t-purple-400 animate-spin opacity-60`} style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
      </div>
      <p className="mt-4 text-gray-600 font-medium animate-pulse">{message}</p>
    </div>
  );
};

export const CardLoader = () => (
  <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
  </div>
);

export const ButtonLoader = ({ children, loading, ...props }) => (
  <button 
    {...props}
    disabled={loading || props.disabled}
    className={`${props.className} ${loading ? 'opacity-75 cursor-not-allowed' : ''} transition-all duration-200 flex items-center justify-center gap-2`}
  >
    {loading && (
      <div className="h-4 w-4 animate-spin rounded-full border border-current border-t-transparent"></div>
    )}
    {children}
  </button>
);

export const SkeletonLoader = ({ lines = 3, className = "" }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <div 
        key={i}
        className={`h-4 bg-gray-200 rounded animate-pulse ${i === 0 ? 'w-3/4' : i === lines - 1 ? 'w-5/6' : 'w-full'}`}
        style={{ animationDelay: `${i * 0.1}s` }}
      ></div>
    ))}
  </div>
);
