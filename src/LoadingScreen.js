import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-yellow-300 mb-4">Loading Adventure...</h1>
        <div className="w-64 h-6 bg-gray-700 rounded-full mx-auto">
          <div className="w-0 h-full bg-yellow-300 rounded-full animate-loading-bar"></div>
        </div>
        <p className="text-blue-300 mt-4 animate-pulse">Preparing your quest...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;