import React, { useState } from "react";
import HomeSidebar from "./HomeSidebar";
import Taskbar from "./components/Taskbar.jsx";

const HomePage = () => {
  const [activeView, setActiveView] = useState("Dashboard");

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Sidebar */}
      <HomeSidebar onSelect={(label) => setActiveView(label)} />

      {/* Main Section */}
      <div className="flex-1 flex flex-col">
        <Taskbar title="John F." />

        {/* Main Content Area */}
        <main className="px-10 py-6 mb-10 flex flex-col overflow-hidden">
          <h2 className="text-4xl font-bold text-blue-600">Dashboard</h2>

            <>
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
            </>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
