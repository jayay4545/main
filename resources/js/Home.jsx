import React, { useState, useEffect } from "react";
import HomeSidebar from "./HomeSidebar";
import GlobalHeader from "./components/GlobalHeader";

const HomePage = () => {
  const [activeView, setActiveView] = useState("Dashboard");

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Sidebar */}
      <HomeSidebar onSelect={(label) => setActiveView(label)} />

      {/* Main Section */}
      <div className="flex-1 flex flex-col">
        <GlobalHeader 
          title="Dashboard"
        />

        {/* Main Content Area */}
        <main className="px-10 pt-3 pb-6 mb-10 flex flex-col overflow-hidden">
          <h2 className="text-4xl font-bold text-[#2262C6]">Dashboard</h2>

            <>
          {/* Stats Cards - Much Smaller Size with Fixed Height */}
      <div className="grid grid-cols-3 gap-9 mt-6">
        <div className="bg-gradient-to-b from-[#0064FF] to-[#003C99] text-white rounded-2xl p-3 shadow flex flex-col h-26">
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
           <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Equipment by Category</h3>
              </div>
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr className="text-left">
                      <th className="py-2.5 px-4 font-semibold">Items</th>
                      <th className="py-2.5 px-4 font-semibold">Available</th>
                      <th className="py-2.5 px-4 font-semibold">Total</th>
                      <th className="py-2.5 px-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-blue-50/40">
                      <td className="py-2.5 px-4">Laptop</td>
                      <td className="py-2.5 px-4">23</td>
                      <td className="py-2.5 px-4">30</td>
                      <td className="py-2.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">77% Available</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-blue-50/40">
                      <td className="py-2.5 px-4">Mouse</td>
                      <td className="py-2.5 px-4">23</td>
                      <td className="py-2.5 px-4">30</td>
                      <td className="py-2.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">77% Available</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-blue-50/40">
                      <td className="py-2.5 px-4">Keyboard</td>
                      <td className="py-2.5 px-4">3</td>
                      <td className="py-2.5 px-4">30</td>
                      <td className="py-2.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">10% Available</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* New Arrival */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">New Arrival</h3>
              </div>
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr className="text-left">
                      <th className="py-2.5 px-4 font-semibold">Date</th>
                      <th className="py-2.5 px-4 font-semibold">Items</th>
                      <th className="py-2.5 px-4 font-semibold">Available</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Qty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-blue-50/40">
                      <td className="py-2.5 px-4">Sept 04 2025</td>
                      <td className="py-2.5 px-4">Laptop</td>
                      <td className="py-2.5 px-4">20</td>
                      <td className="py-2.5 px-4 text-right">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">20</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-blue-50/40">
                      <td className="py-2.5 px-4">Sept 04 2025</td>
                      <td className="py-2.5 px-4">Mouse</td>
                      <td className="py-2.5 px-4">10</td>
                      <td className="py-2.5 px-4 text-right">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">10</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-blue-50/40">
                      <td className="py-2.5 px-4">Sept 04 2025</td>
                      <td className="py-2.5 px-4">Keyboard</td>
                      <td className="py-2.5 px-4">10</td>
                      <td className="py-2.5 px-4 text-right">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">10</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* Additional Boxes */}
          <div className="grid grid-cols-2 gap-6 mt-6">
            {/* Report Overview */}
           <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Report Overview</h3>
              </div>
              <div className="h-40 bg-gray-100 rounded-xl border border-dashed border-gray-300"></div>
            </div>
            {/* Add Category */}
           <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Add Category</h3>
              </div>
              <div className="h-40 bg-gray-100 rounded-xl border border-dashed border-gray-300"></div>
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
