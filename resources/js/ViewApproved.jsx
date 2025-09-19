import React, { useState, useEffect } from 'react';
import { Search, Printer, ChevronDown } from 'lucide-react';
import Taskbar from './components/Taskbar.jsx';
import HomeSidebar from './HomeSidebar';
import ConfirmModal from './components/ConfirmModal.jsx';
import PrintReceipt from './components/PrintReceipt.jsx';
import { transactionService, apiUtils } from './services/api.js';
import api from './services/api';

const ViewApproved = () => {
  const [approved, setApproved] = useState([]);
  const [currentHolders, setCurrentHolders] = useState([]);
  const [verifyReturns, setVerifyReturns] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    new_requests: 0,
    current_holders: 0,
    verify_returns: 0
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [view, setView] = useState('viewApproved');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: null,
    transactionData: null
  });
  const [printModal, setPrintModal] = useState({
    isOpen: false,
    transactionData: null
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch dashboard stats
      const statsResponse = await transactionService.getDashboard();
      if (statsResponse.success) {
        setDashboardStats(statsResponse.data);
      }
      
      // Fetch approved requests (status = 'approved' - ready for release)
      const approvedResponse = await api.get('/requests', { params: { status: 'approved' } });
      if (approvedResponse.data.success) {
        setApproved(approvedResponse.data.data);
      } else {
        console.error('Failed to fetch approved requests:', approvedResponse.data.message);
      }
      
      // Fetch current holders (status = 'released' - equipment released)
      const holdersResponse = await transactionService.getAll({ status: 'released' });
      if (holdersResponse.success) {
        setCurrentHolders(holdersResponse.data);
      } else {
        console.error('Failed to fetch current holders:', holdersResponse.message);
      }
      
      // Fetch verify returns (status = 'returned' - equipment returned)
      const returnsResponse = await transactionService.getAll({ status: 'returned' });
      if (returnsResponse.success) {
        setVerifyReturns(returnsResponse.data);
      } else {
        console.error('Failed to fetch verify returns:', returnsResponse.message);
      }
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(apiUtils.handleError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (next) => {
    setView(next);
    setIsMenuOpen(false);
  };

  // Handle release action
  const handleRelease = async (transactionData) => {
    try {
      const response = await transactionService.release(transactionData.id, {
        notes: transactionData.notes,
        condition_on_issue: transactionData.condition_on_issue
      });
      
      if (response.success) {
        // Update the local state
        setApproved(prev => prev.filter(item => item.id !== transactionData.id));
        setCurrentHolders(prev => [...prev, response.data]);
        
        // Update dashboard stats
        setDashboardStats(prev => ({
          ...prev,
          current_holders: prev.current_holders + 1
        }));
        
        // Close modal
        setConfirmModal({ isOpen: false, type: null, transactionData: null });
        
        // Show success message
        alert('Equipment released successfully!');
      }
    } catch (err) {
      console.error('Error releasing equipment:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Unknown error occurred';
      alert('Error releasing equipment: ' + errorMessage);
    }
  };

  // Handle print action
  const handlePrint = async (transactionData) => {
    try {
      // If transactionData doesn't have an id, it might be the wrong format
      if (!transactionData || !transactionData.id) {
        console.error('Invalid transaction data for printing:', transactionData);
        alert('Error: Invalid transaction data for printing');
        return;
      }

      const response = await transactionService.print(transactionData.id);
      
      if (response.success) {
        setPrintModal({
          isOpen: true,
          transactionData: response.data
        });
      } else {
        alert('Error generating print data: ' + response.message);
      }
    } catch (err) {
      console.error('Error fetching print data:', err);
      alert('Error generating receipt: ' + apiUtils.handleError(err));
    }
  };

  // Modal handlers
  const openConfirmModal = (type, transactionData) => {
    setConfirmModal({
      isOpen: true,
      type,
      transactionData
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal({ isOpen: false, type: null, transactionData: null });
  };

  const closePrintModal = () => {
    setPrintModal({ isOpen: false, transactionData: null });
  };

  return (
     <div className="h-screen overflow-hidden bg-white flex">
      <div className="flex-shrink-0">
        <HomeSidebar />
      </div>
      
      <div className="flex-1 px-10 py-6 overflow-y-auto min-h-0">
        <Taskbar title="Transaction" />

        <main className="px-10 py-6 mb-10 flex flex-col overflow-hidden">
          <h2 className="text-4xl font-bold text-blue-600">Transaction</h2>
          <h3 className="text-base font-semibold text-gray-700 mt-3 tracking-wide">QUICK ACCESS</h3>

          <div className="grid grid-cols-3 gap-6 mt-4">
            <div className="bg-blue-600 text-white rounded-2xl p-6 shadow flex flex-col">
              <h4 className="text-sm uppercase tracking-wider opacity-80">New Requests</h4>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-5xl font-bold">{loading ? '...' : dashboardStats.new_requests}</p>
                <div className="w-10 h-10 rounded-full bg-white/30"></div>
              </div>
            </div>
            <div className="bg-gray-100 rounded-2xl p-6 shadow flex flex-col">
              <h4 className="text-sm font-semibold text-gray-600">Current holder</h4>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-4xl font-bold text-gray-900">{loading ? '...' : dashboardStats.current_holders}</p>
                <div className="w-10 h-10 rounded-full bg-gray-300"></div>
              </div>
            </div>
            <div className="bg-gray-100 rounded-2xl p-6 shadow flex flex-col">
              <h4 className="text-sm font-semibold text-gray-600">Verify Return</h4>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-4xl font-bold text-gray-900">{loading ? '...' : dashboardStats.verify_returns}</p>
                <div className="w-10 h-10 rounded-full bg-gray-300"></div>
              </div>
            </div>
          </div>

          {/* Mode dropdown */}
          <div className="mt-6 flex justify-center">
            <div className="relative">
              <button
                type="button"
                className="w-44 h-10 bg-gray-300 rounded-md flex items-center justify-between px-4 text-gray-700"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span className="text-sm font-medium">
                  {view === 'viewApproved' ? 'View Approved' : 
                   view === 'currentHolder' ? 'Current holder' : 'Verify return'}
                </span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {isMenuOpen && (
                <div className="absolute z-10 mt-2 w-44 bg-white rounded-md shadow border border-gray-200">
                  <button onClick={() => handleSelect('viewApproved')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">View Approved</button>
                  <button onClick={() => handleSelect('currentHolder')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">Current holder</button>
                  <button onClick={() => handleSelect('verifyReturn')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">Verify return</button>
                </div>
              )}
            </div>
          </div>

          {view === 'viewApproved' && (
            <>
              <h3 className="mt-10 text-3xl font-semibold text-gray-700">View Approved</h3>
              <div className="mt-4 bg-white rounded-xl shadow p-6">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b text-gray-600">
                      <th className="pb-2">Name</th>
                      <th className="pb-2">Position</th>
                      <th className="pb-2">Item</th>
                      <th className="pb-2">Status</th>
                      <th className="pb-2">Approved by</th>
                      <th className="pb-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-gray-500">
                          Loading approved transactions...
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-red-500">
                          Error: {error}
                        </td>
                      </tr>
                    ) : approved.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-gray-500">
                          No approved transactions found
                        </td>
                      </tr>
                    ) : (
                      approved.map((row) => (
                        <tr key={row.id} className="border-b last:border-0">
                          <td className="py-4">{row.full_name || 'N/A'}</td>
                          <td className="py-4">{row.position || 'N/A'}</td>
                          <td className="py-4">{row.equipment_name || 'N/A'}</td>
                          <td className="py-4 text-green-600">{row.status || 'N/A'}</td>
                          <td className="py-4">{row.approved_by_name || 'N/A'}</td>
                          <td className="py-4">
                            <div className="flex items-center justify-end space-x-3">
                              <button
                                onClick={() => handlePrint(row)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Print Receipt"
                              >
                                <Printer className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                              </button>
                              <button 
                                onClick={() => openConfirmModal('release', row)}
                                className="px-3 py-1 bg-green-600 text-white rounded-full text-xs hover:bg-green-700 transition-colors"
                              >
                                Release
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {view === 'currentHolder' && (
            <>
              <h3 className="mt-10 text-3xl font-semibold text-gray-700">Current holder</h3>
              <div className="mt-4 bg-white rounded-xl shadow p-6">
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
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-gray-500">
                          Loading current holders...
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-red-500">
                          Error: {error}
                        </td>
                      </tr>
                    ) : currentHolders.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-gray-500">
                          No current holders found
                        </td>
                      </tr>
                    ) : (
                      currentHolders.map((row) => (
                        <tr key={row.id} className="border-b last:border-0">
                          <td className="py-4">{row.full_name || 'N/A'}</td>
                          <td className="py-4">{row.position || 'N/A'}</td>
                          <td className="py-4">{row.equipment_name || 'N/A'}</td>
                          <td className="py-4">{row.request_mode || 'Onsite'}</td>
                          <td className="py-4 text-red-600">{row.expected_return_date || 'N/A'}</td>
                          <td className="py-4">
                            <div className="flex items-center justify-end space-x-4 text-gray-700">
                              <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">Active</span>
                              <span className="px-3 py-1 rounded-full text-xs bg-green-600 text-white">Released</span>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {view === 'verifyReturn' && (
            <>
              <h3 className="mt-10 text-3xl font-semibold text-gray-700">Verify return</h3>
              <div className="mt-4 bg-white rounded-xl shadow p-6">
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
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-gray-500">
                          Loading verify returns...
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-red-500">
                          Error: {error}
                        </td>
                      </tr>
                    ) : verifyReturns.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-gray-500">
                          No returns to verify found
                        </td>
                      </tr>
                    ) : (
                      verifyReturns.map((row) => (
                        <tr key={row.id} className="border-b last:border-0">
                          <td className="py-4">{row.full_name || 'N/A'}</td>
                          <td className="py-4">{row.position || 'N/A'}</td>
                          <td className="py-4">{row.equipment_name || 'N/A'}</td>
                          <td className="py-4 text-red-600">{row.return_date || row.expected_return_date || 'N/A'}</td>
                          <td className="py-4">
                            <div className="flex items-center justify-end space-x-3">
                              <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">Pending</span>
                              <span className="px-3 py-1 rounded-full text-xs bg-green-600 text-white">Returned</span>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={handleRelease}
        transactionData={confirmModal.transactionData}
        type={confirmModal.type}
      />

      {/* Print Receipt Modal */}
      <PrintReceipt
        isOpen={printModal.isOpen}
        onClose={closePrintModal}
        transactionData={printModal.transactionData}
      />
    </div>
  );
};

export default ViewApproved;