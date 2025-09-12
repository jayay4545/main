import React from 'react';

const SuperAdminFallback = () => {
  return (
    <div className="min-h-screen bg-white-100 flex justify-center items-center">
      <div className="text-center p-10 max-w-lg bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Super Admin Dashboard</h2>
        <p className="text-gray-600 mb-6">The dashboard is currently unavailable. Please try again later.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
};

export default SuperAdminFallback;