import React, { useState, useEffect } from "react";
import HomeSidebar from "./HomeSidebar";
import GlobalHeader from "./components/GlobalHeader";
import api from './services/api';

const HomePage = () => {
  const [activeView, setActiveView] = useState("Dashboard");
  const [dashboardData, setDashboardData] = useState({
    totalEquipment: 0,
    availableStock: 0,
    currentHolder: 0,
    categories: [],
    newArrivals: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories and equipment data
        const [categoriesRes, equipmentRes] = await Promise.all([
          api.get('/categories'),
          api.get('/equipment')
        ]);

        if (categoriesRes?.data?.success && equipmentRes?.data?.success) {
          const categories = categoriesRes.data.data || [];
          const equipment = equipmentRes.data.data?.data || [];

          // Calculate statistics
          const totalEquipment = equipment.length;
          const availableStock = equipment.filter(eq => eq.status === 'available').length;
          const currentHolder = equipment.filter(eq => eq.status === 'in_use').length;

          // Process categories with equipment counts and status
          const categoriesWithStats = categories.map(cat => {
            const categoryEquipment = equipment.filter(eq => eq.category_id === cat.id);
            const available = categoryEquipment.filter(eq => eq.status === 'available').length;
            const total = categoryEquipment.length;
            const percentage = total > 0 ? Math.round((available / total) * 100) : 0;
            
            return {
              ...cat,
              available,
              total,
              percentage,
              status: percentage >= 50 ? 'good' : percentage >= 20 ? 'warning' : 'low'
            };
          });

          // Get recent equipment (last 30 days) - simulate with recent entries
          const recentEquipment = equipment
            .filter(eq => eq.created_at)
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 10);

          // Group recent equipment by category for new arrivals
          const newArrivals = categories.map(cat => {
            const recentInCategory = recentEquipment.filter(eq => eq.category_id === cat.id);
            if (recentInCategory.length > 0) {
              const available = recentInCategory.filter(eq => eq.status === 'available').length;
              return {
                date: new Date(recentInCategory[0].created_at).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: '2-digit', 
                  year: 'numeric' 
                }),
                name: cat.name,
                available,
                qty: recentInCategory.length
              };
            }
            return null;
          }).filter(Boolean).slice(0, 5);

          setDashboardData({
            totalEquipment,
            availableStock,
            currentHolder,
            categories: categoriesWithStats,
            newArrivals
          });
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
        <main className="px-10 pt-3 pb-6 flex-1 overflow-y-auto">
          <div className="min-h-full">
            <h2 className="text-4xl font-bold text-[#2262C6]">Dashboard</h2>

            {/* Stats Cards - Much Smaller Size with Fixed Height */}
            <div className="grid grid-cols-3 gap-9 mt-6">
              <div className="bg-gradient-to-b from-[#0064FF] to-[#003C99] text-white rounded-2xl p-3 shadow flex flex-col h-26">
                <h4 className="text-xs uppercase tracking-wider opacity-80">Total Number of Equipment</h4>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-2xl font-bold">{loading ? '...' : dashboardData.totalEquipment}</p>
                  <div className="w-6 h-6 rounded-full bg-white/30"></div>
                </div>
              </div>
              <div className="bg-gray-100 rounded-2xl p-3 shadow flex flex-col h-26">
                <h4 className="text-xs font-semibold text-gray-600">Available stock</h4>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-2xl font-bold text-gray-900">{loading ? '...' : dashboardData.availableStock}</p>
                  <div className="w-6 h-6 rounded-full bg-gray-300"></div>
                </div>
              </div>
              <div className="bg-gray-100 rounded-2xl p-3 shadow flex flex-col h-26">
                <h4 className="text-xs font-semibold text-gray-600">Current holder</h4>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-2xl font-bold text-gray-900">{loading ? '...' : dashboardData.currentHolder}</p>
                  <div className="w-6 h-6 rounded-full bg-gray-300"></div>
                </div>
              </div>
            </div>

            {/* Tables */}
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
                    {loading ? (
                      <tr>
                        <td colSpan="4" className="py-4 px-4 text-center text-gray-500">Loading...</td>
                      </tr>
                    ) : dashboardData.categories.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="py-4 px-4 text-center text-gray-500">No categories found</td>
                      </tr>
                    ) : (
                      dashboardData.categories.map((category) => (
                        <tr key={category.id} className="hover:bg-blue-50/40">
                          <td className="py-2.5 px-4">{category.name}</td>
                          <td className="py-2.5 px-4">{category.available}</td>
                          <td className="py-2.5 px-4">{category.total}</td>
                          <td className="py-2.5 px-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              category.status === 'good' 
                                ? 'bg-green-100 text-green-700' 
                                : category.status === 'warning'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {category.percentage}% Available
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
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
                    {loading ? (
                      <tr>
                        <td colSpan="4" className="py-4 px-4 text-center text-gray-500">Loading...</td>
                      </tr>
                    ) : dashboardData.newArrivals.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="py-4 px-4 text-center text-gray-500">No recent arrivals</td>
                      </tr>
                    ) : (
                      dashboardData.newArrivals.map((arrival, index) => (
                        <tr key={`${arrival.name}-${index}`} className="hover:bg-blue-50/40">
                          <td className="py-2.5 px-4">{arrival.date}</td>
                          <td className="py-2.5 px-4">{arrival.name}</td>
                          <td className="py-2.5 px-4">{arrival.available}</td>
                          <td className="py-2.5 px-4 text-right">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                              {arrival.qty}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            </div>
            
            {/* Additional Boxes */}
            <div className="grid grid-cols-2 gap-6 mt-6 mb-6">
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
        </main>
      </div>
    </div>
  );
};

export default HomePage;
