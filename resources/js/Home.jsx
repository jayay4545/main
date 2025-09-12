import React from "react";
import HomeSidebar from "./HomeSidebar";

const HomePage = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Sidebar */}
      <HomeSidebar />

      {/* Main Section */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-10 py-6 bg-white">
          {/* Search */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-10 pr-4 py-3 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                />
              </svg>
            </div>
          </div>

          {/* Profile */}
          <div className="flex items-center space-x-6">
            <span className="text-gray-700 font-medium">John F.</span>
            <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-white"> J
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="px-10 py-6 mb-10 flex flex-col overflow-hidden">
          <h2 className="text-4xl font-bold text-blue-600">Dashboard</h2>

          {/* Stats Cards - Much Smaller Size with Fixed Height */}
      <div className="grid grid-cols-3 gap-9 mt-6">
        <div className="bg-blue-600 text-white rounded-2xl p-3 shadow flex flex-col h-26">
          <h4 className="text-xs uppercase tracking-wider opacity-80">Total Number of Equipment</h4>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-2xl font-bold">90</p>
            <div className="w-6 h-6 rounded-full bg-white/30"></div>
          </div>
        </div>
        <div className="bg-gray-100 rounded-2xl p-3 shadow flex flex-col h-26">
          <h4 className="text-xs font-semibold text-gray-600">Available stock</h4>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-2xl font-bold text-gray-900">49</p>
            <div className="w-6 h-6 rounded-full bg-gray-300"></div>
          </div>
        </div>
        <div className="bg-gray-100 rounded-2xl p-3 shadow flex flex-col h-26">
          <h4 className="text-xs font-semibold text-gray-600">Current holder</h4>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-2xl font-bold text-gray-900">41</p>
            <div className="w-6 h-6 rounded-full bg-gray-300"></div>
          </div>
        </div>
      </div>

          {/* Tables */}
          <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="grid grid-cols-2 gap-6 mt-6">
            {/* Equipment by Category */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Equipment by Category</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-2">Items</th>
                    <th className="pb-2">Available</th>
                    <th className="pb-2">Total</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td>Laptop</td>
                    <td>23</td>
                    <td>30</td>
                    <td className="text-green-600">77% Available</td>
                  </tr>
                  <tr className="border-b">
                    <td>Mouse</td>
                    <td>23</td>
                    <td>30</td>
                    <td className="text-green-600">77% Available</td>
                  </tr>
                  <tr>
                    <td>Keyboard</td>
                    <td>3</td>
                    <td>30</td>
                    <td className="text-red-600">10% Available</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* New Arrival */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold mb-4">New Arrival</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Items</th>
                    <th className="pb-2">Available</th>
                    <th className="pb-2">Qty</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td>Sept 04 2025</td>
                    <td>Laptop</td>
                    <td>20</td>
                    <td>20</td>
                  </tr>
                  <tr className="border-b">
                    <td>Sept 04 2025</td>
                    <td>Mouse</td>
                    <td>10</td>
                    <td>10</td>
                  </tr>
                  <tr>
                    <td>Sept 04 2025</td>
                    <td>Keyboard</td>
                    <td>10</td>
                    <td>10</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Additional Boxes */}
          <div className="grid grid-cols-2 gap-6 mt-6">
            {/* Report Overview */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Report Overview</h3>
              <div className="h-40 bg-gray-100 rounded"></div>
            </div>
            {/* Add Category */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Add Category</h3>
              <div className="h-40 bg-gray-100 rounded"></div>
            </div>
          </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
