import React, { useState, useEffect } from 'react';

export const Container = ({ children, size = "default", className = "" }) => {
  const sizeClasses = {
    sm: "max-w-3xl",
    default: "max-w-7xl", 
    lg: "max-w-full",
    xl: "max-w-screen-2xl"
  };

  return (
    <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  );
};

export const Grid = ({ children, cols = "default", gap = "default", className = "" }) => {
  const colsClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    default: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
  };

  const gapClasses = {
    sm: "gap-2",
    default: "gap-4",
    lg: "gap-6",
    xl: "gap-8"
  };

  return (
    <div className={`grid ${colsClasses[cols]} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
};

export const Flex = ({ children, direction = "row", align = "start", justify = "start", wrap = "nowrap", className = "" }) => {
  const directionClasses = {
    row: "flex-row",
    rowReverse: "flex-row-reverse",
    col: "flex-col",
    colReverse: "flex-col-reverse"
  };

  const alignClasses = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch"
  };

  const justifyClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around"
  };

  const wrapClasses = {
    wrap: "flex-wrap",
    nowrap: "flex-nowrap",
    reverse: "flex-wrap-reverse"
  };

  return (
    <div className={`flex ${directionClasses[direction]} ${alignClasses[align]} ${justifyClasses[justify]} ${wrapClasses[wrap]} ${className}`}>
      {children}
    </div>
  );
};

export const Card = ({ children, hover = false, padding = "default", className = "", ...props }) => {
  const paddingClasses = {
    sm: "p-4",
    default: "p-6",
    lg: "p-8"
  };

  return (
    <div
      className={`
        bg-white rounded-xl shadow-sm border border-gray-200
        ${hover ? 'hover:shadow-md hover:border-gray-300 transition-all duration-200' : ''}
        ${paddingClasses[padding]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export const Section = ({ children, title, subtitle, className = "", ...props }) => (
  <section className={`py-12 md:py-16 ${className}`} {...props}>
    {title && (
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
        {subtitle && <p className="text-lg text-gray-600 max-w-3xl mx-auto">{subtitle}</p>}
      </div>
    )}
    {children}
  </section>
);

export const ResponsiveImage = ({ src, alt, className = "", ...props }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      {error && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        {...props}
      />
    </div>
  );
};

export const ResponsiveButton = ({ 
  children, 
  size = "default", 
  variant = "primary", 
  fullWidth = false, 
  loading = false,
  disabled = false,
  className = "",
  ...props 
}) => {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    default: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  const variantClasses = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
    outline: "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-indigo-500",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-indigo-500"
  };

  return (
    <button
      className={`
        inline-flex items-center justify-center font-medium rounded-lg
        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${loading ? 'cursor-wait' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
};

export const SkeletonCard = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
  </div>
);

export const EmptyState = ({ 
  icon, 
  title, 
  description, 
  action, 
  className = "" 
}) => (
  <div className={`text-center py-12 ${className}`}>
    {icon && (
      <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
        {icon}
      </div>
    )}
    <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500 mb-6">{description}</p>
    {action}
  </div>
);

export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = screenSize.width < 640;
  const isTablet = screenSize.width >= 640 && screenSize.width < 1024;
  const isDesktop = screenSize.width >= 1024;

  return {
    screenSize,
    isMobile,
    isTablet,
    isDesktop
  };
};
