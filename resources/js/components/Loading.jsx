import React from 'react';

const Loading = ({ size = 'medium', text = 'Loading...', fullScreen = false }) => {
  const getSizeClasses = (size) => {
    switch (size) {
      case 'small':
        return 'h-4 w-4';
      case 'large':
        return 'h-12 w-12';
      case 'medium':
      default:
        return 'h-8 w-8';
    }
  };

  const getTextSizeClasses = (size) => {
    switch (size) {
      case 'small':
        return 'text-sm';
      case 'large':
        return 'text-lg';
      case 'medium':
      default:
        return 'text-base';
    }
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${getSizeClasses(size)}`}></div>
      {text && (
        <p className={`text-gray-600 ${getTextSizeClasses(size)}`}>{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default Loading;
