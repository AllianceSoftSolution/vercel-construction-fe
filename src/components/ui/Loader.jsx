import React from "react";

const Loader = ({ 
  showText = true, 
  text = "Loading ...", 
  size = "medium",
  className = "" 
}) => {
  const sizeClasses = {
    small: "h-6 w-6",
    medium: "h-8 w-8", 
    large: "h-12 w-12"
  };

  const textSizes = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg"
  };

  return (
    <div className={`text-center py-8 ${className}`}>
      <div className={`inline-block animate-spin rounded-full border-b-2 border-primary ${sizeClasses[size]}`}></div>
      {showText && (
        <p className={`mt-2 text-gray-600 ${textSizes[size]}`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default Loader;