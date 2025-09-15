// Use absolute path so it doesn't append to /viewrequest
const API_BASE = '/api';

// Helper to fetch JSON with clear errors
const fetchJson = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.json();
};
import React, { useState, useEffect } from 'react';
import { Search, Printer, Check, X, ChevronDown, Eye, Pencil } from 'lucide-react';
import HomeSidebar from './HomeSidebar';

const ViewRequest = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [view, setView] = useState('viewRequest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Data states
  const [dashboardData, setDashboardData] = useState({
    new_requests: 0,
    current_holders: 0,
    verify_returns: 0
  });
  const [pendingRequests, setPendingRequests] = useState([]);
  const [currentHolders, setCurrentHolders] = useState([]);
  const [verifyReturns, setVerifyReturns] = useState([]);

  // API Base URL built from server-injected base path for reliable routing
  const API_BASE = (window.APP_BASE_URL || window.location.origin).replace(/\/$/, '') + '/api';

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Fetching data from API...');
      
      // Fetch dashboard metrics
      console.log('📊 Fetching dashboard metrics...');
      const dashboardRes = await fetch(`${API_BASE}/transactions/dashboard`);
      console.log('Dashboard response status:', dashboardRes.status);
      const dashboardData = await dashboardRes.json();
      console.log('Dashboard data:', dashboardData);
      if (dashboardData.success) {
        setDashboardData(dashboardData.data);
        console.log('✅ Dashboard data loaded:', dashboardData.data);
      } else {
        console.error('❌ Dashboard API error:', dashboardData.message);
      }

      // Fetch pending requests
      console.log('📋 Fetching pending requests...');
      const requestsRes = await fetch(`${API_BASE}/employees/pending-requests`);
      console.log('Requests response status:', requestsRes.status);
      const requestsData = await requestsRes.json();
      console.log('Requests data:', requestsData);
      if (requestsData.success) {
        setPendingRequests(requestsData.data);
        console.log('✅ Pending requests loaded:', requestsData.data.length, 'items');
      } else {
        console.error('❌ Requests API error:', requestsData.message);
      }

      // Fetch current holders
      console.log('👥 Fetching current holders...');
      const holdersRes = await fetch(`${API_BASE}/employees/current-holders`);
      console.log('Holders response status:', holdersRes.status);
      const holdersData = await holdersRes.json();
      console.log('Holders data:', holdersData);
      if (holdersData.success) {
        setCurrentHolders(holdersData.data);
        console.log('✅ Current holders loaded:', holdersData.data.length, 'items');
      } else {
        console.error('❌ Holders API error:', holdersData.message);
      }

      // Fetch verify returns
      console.log('🔄 Fetching verify returns...');
      const returnsRes = await fetch(`${API_BASE}/employees/verify-returns`);
      console.log('Returns response status:', returnsRes.status);
      const returnsData = await returnsRes.json();
      console.log('Returns data:', returnsData);
      if (returnsData.success) {
        setVerifyReturns(returnsData.data);
        console.log('✅ Verify returns loaded:', returnsData.data.length, 'items');
      } else {
        console.error('❌ Returns API error:', returnsData.message);
      }

      console.log('🎉 All data fetched successfully!');

    } catch (err) {
      const errorMsg = 'Failed to fetch data: ' + err.message;
      setError(errorMsg);
      console.error('❌ Error fetching data:', err);
      console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        name: err.name
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit'
    });
  };

  const getRequestModeDisplay = (mode) => {
    return mode === 'work_from_home' ? 'W.F.H' : 'Onsite';
  };

  const handleSelect = (next) => {
    setView(next);
    setIsMenuOpen(false);
  };

  return (
    <div className="h-screen overflow-hidden bg-white flex">
      <HomeSidebar />
      <div className="flex-1 flex flex-col">
      <header className="flex items-center justify-between px-10 py-6 bg-white">
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
               placeholder="Search"
            className="w-full pl-10 pr-4 py-3 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <span className="text-gray-700 font-medium">John F.</span>
          <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-white">J</div>
        </div>
      </header>

      <main className="px-10 py-6 mb-10 flex flex-col overflow-hidden">
        <div className="flex-1 min-h-0 overflow-y-auto">
        <h2 className="text-4xl font-bold text-blue-600">Transaction</h2>
        <h3 className="text-base font-semibold text-gray-700 mt-3 tracking-wide">QUICK ACCESS</h3>

        <div className="grid grid-cols-3 gap-6 mt-4">
          <div className="bg-blue-600 text-white rounded-2xl p-6 shadow flex flex-col">
            <h4 className="text-sm uppercase tracking-wider opacity-80">New Requests</h4>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-5xl font-bold">{loading ? '...' : dashboardData.new_requests}</p>
              <div className="w-10 h-10 rounded-full bg-white/30"></div>
            </div>
          </div>
          <div className="bg-gray-100 rounded-2xl p-6 shadow flex flex-col">
            <h4 className="text-sm font-semibold text-gray-600">Current holder</h4>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-4xl font-bold text-gray-900">{loading ? '...' : dashboardData.current_holders}</p>
              <div className="w-10 h-10 rounded-full bg-gray-300"></div>
            </div>
          </div>
          <div className="bg-gray-100 rounded-2xl p-6 shadow flex flex-col">
            <h4 className="text-sm font-semibold text-gray-600">Verify Return</h4>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-4xl font-bold text-gray-900">{loading ? '...' : dashboardData.verify_returns}</p>
              <div className="w-10 h-10 rounded-full bg-gray-300"></div>
            </div>
          </div>
        </div>

        {/* Mode dropdown (grey shape) */}
        <div className="mt-6 flex justify-center items-center space-x-4">
          <div className="relative">
            <button
              type="button"
              className="w-44 h-10 bg-gray-300 rounded-md flex items-center justify-between px-4 text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="text-sm font-medium">
                {view === 'viewRequest' ? 'View Request' : view === 'currentHolder' ? 'Current holder' : 'Verify return'}
              </span>
              <ChevronDown className="h-4 w-4" />
            </button>
            {isMenuOpen && (
              <div className="absolute z-10 mt-2 w-44 bg-white rounded-md shadow border border-gray-200">
                <button onClick={() => handleSelect('currentHolder')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">Current holder</button>
                <button onClick={() => handleSelect('verifyReturn')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">Verify return</button>
                <button onClick={() => handleSelect('viewRequest')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">View Request</button>
              </div>
            )}
          </div>
          
          {/* Refresh Button */}
          <button
            onClick={fetchAllData}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            {loading ? 'Loading...' : '🔄 Refresh Data'}
          </button>
        </div>

        {view === 'viewRequest' && (
          <>
            <h3 className="mt-10 text-3xl font-semibold text-gray-700">
              View Request 
              <span className="ml-2 text-lg font-normal text-gray-500">
                ({pendingRequests.length} requests)
              </span>
            </h3>
            <div className="mt-4 bg-white rounded-xl shadow p-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading requests...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <div className="text-red-600 mb-4">❌ Error: {error}</div>
                  <button 
                    onClick={fetchAllData}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Try Again
                  </button>
                </div>
              ) : pendingRequests.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No pending requests found
                </div>
              ) : (
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b text-gray-600">
                      <th className="pb-2">Name</th>
                      <th className="pb-2">Item</th>
                      <th className="pb-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingRequests.map((req) => (
                      <tr key={req.request_id} className="border-b last:border-0">
                        <td className="py-4">
                          <div className="font-medium text-gray-900">{req.first_name} {req.last_name}</div>
                          <div className="text-gray-500 text-xs">{req.position}</div>
                        </td>
                        <td className="py-4 text-gray-700">{req.equipment_name}</td>
                        <td className="py-4">
                          <div className="flex items-center justify-end space-x-3">
                            <button className="h-8 w-8 flex items-center justify-center rounded-md bg-green-500/10 text-green-600 hover:bg-green-500/20">
                              <Check className="h-4 w-4" />
                            </button>
                            <button className="h-8 w-8 flex items-center justify-center rounded-md bg-red-500/10 text-red-600 hover:bg-red-500/20">
                              <X className="h-4 w-4" />
                            </button>
                            <Printer className="h-5 w-5 text-gray-500" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {view === 'currentHolder' && (
          <>
            <h3 className="mt-10 text-3xl font-semibold text-gray-700">
              Current holder
              <span className="ml-2 text-lg font-normal text-gray-500">
                ({currentHolders.length} holders)
              </span>
            </h3>
            <div className="mt-4 bg-white rounded-xl shadow p-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading current holders...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <div className="text-red-600 mb-4">❌ Error: {error}</div>
                  <button 
                    onClick={fetchAllData}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Try Again
                  </button>
                </div>
              ) : currentHolders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No current holders found
                </div>
              ) : (
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b text-gray-600">
                      <th className="pb-2">Name</th>
                      <th className="pb-2">Position</th>
                      <th className="pb-2">Item</th>
                      <th className="pb-2">Request mode</th>
                      <th className="pb-2">End Date</th>
                      <th className="pb-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentHolders.map((holder) => (
                      <tr key={holder.transaction_id} className="border-b last:border-0">
                        <td className="py-4">{holder.first_name} {holder.last_name}</td>
                        <td className="py-4">{holder.position}</td>
                        <td className="py-4">{holder.equipment_name}</td>
                        <td className="py-4">{getRequestModeDisplay(holder.request_mode)}</td>
                        <td className="py-4 text-red-600">{formatDate(holder.expected_return_date)}</td>
                        <td className="py-4">
                          <div className="flex items-center justify-end space-x-4 text-gray-700">
                            <Eye className="h-5 w-5" />
                            <Pencil className="h-5 w-5" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {view === 'verifyReturn' && (
          <>
            <h3 className="mt-10 text-3xl font-semibold text-gray-700">
              Verify return
              <span className="ml-2 text-lg font-normal text-gray-500">
                ({verifyReturns.length} returns)
              </span>
            </h3>
            <div className="mt-4 bg-white rounded-xl shadow p-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading verify returns...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <div className="text-red-600 mb-4">❌ Error: {error}</div>
                  <button 
                    onClick={fetchAllData}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Try Again
                  </button>
                </div>
              ) : verifyReturns.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No verify returns found
                </div>
              ) : (
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b text-gray-600">
                      <th className="pb-2">Name</th>
                      <th className="pb-2">Position</th>
                      <th className="pb-2">Item</th>
                      <th className="pb-2">End Date</th>
                      <th className="pb-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {verifyReturns.map((returnItem) => (
                      <tr key={returnItem.transaction_id} className="border-b last:border-0">
                        <td className="py-4">{returnItem.first_name} {returnItem.last_name}</td>
                        <td className="py-4">{returnItem.position}</td>
                        <td className="py-4">{returnItem.equipment_name}</td>
                        <td className="py-4 text-red-600">{formatDate(returnItem.return_date)}</td>
                        <td className="py-4">
                          <div className="flex items-center justify-end space-x-3">
                            <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">Partial</span>
                            <span className="px-3 py-1 rounded-full text-xs bg-green-600 text-white">Returned</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
        </div>
      </main>
      </div>
    </div>
  );
};

export default ViewRequest;


