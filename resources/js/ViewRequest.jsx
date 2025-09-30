import React, { useEffect, useState } from 'react';
import { Search, Printer, Check, X, ChevronDown, Eye, Pencil } from 'lucide-react';
import GlobalHeader from './components/GlobalHeader';
import HomeSidebar from './HomeSidebar';
import VerificationModal from './components/VerificationModal';
import SimpleConfirmModal from './components/SimpleConfirmModal.jsx';
import SuccessModal from './components/SuccessModal';
import ViewTransactionModal from './components/ViewTransactionModal';
import EditTransactionModal from './components/EditTransactionModal';
import api from './services/api';

const ViewRequest = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [currentHolders, setCurrentHolders] = useState([]);
  const [verifyReturns, setVerifyReturns] = useState([]); // Added this missing state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch pending and approved requests from backend
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const pendingRes = await fetch('/api/requests?status=pending');
        const approvedRes = await fetch('/api/requests?status=approved');
        const pendingData = await pendingRes.json();
        const approvedData = await approvedRes.json();
        if (pendingData.success && Array.isArray(pendingData.data.data)) {
          setPendingRequests(pendingData.data.data);
        }
        if (approvedData.success && Array.isArray(approvedData.data.data)) {
          setApprovedRequests(approvedData.data.data);
        }
      } catch (e) {
        console.error('Failed to fetch requests:', e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [view, setView] = useState('viewRequest');
  
  // Modal state
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null, // 'approve' or 'reject'
    requestData: null,
    reason: ''
  });

  // Success modal state
  const [successModal, setSuccessModal] = useState({
    isOpen: false,
    type: null, // 'approve' or 'reject'
    requestData: null
  });

  // Simple confirm modal state for check/X buttons
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    mode: null, // 'approve' | 'delete'
    requestId: null
  });

  // View and Edit modal states
  const [viewModal, setViewModal] = useState({
    isOpen: false,
    transactionData: null
  });

  const [editModal, setEditModal] = useState({
    isOpen: false,
    transactionData: null
  });

  const handleSelect = (next) => {
    setView(next);
    setIsMenuOpen(false);
  };

  // Handler functions for approve and reject actions
  const handleApprove = (requestId) => {
    const requestToApprove = pendingRequests.find(req => req.id === requestId);
    
    if (requestToApprove) {
      setModalState({
        isOpen: true,
        type: 'approve',
        requestData: requestToApprove,
        reason: ''
      });
    }
  };

  // Row click opens the detailed approval modal
  const handleRowClick = (requestId) => {
    const req = pendingRequests.find(r => r.id === requestId);
    if (!req) return;
    setModalState({
      isOpen: true,
      type: 'approve',
      requestData: req,
      reason: ''
    });
  };

  const handleReject = (requestId) => {
    const requestToReject = pendingRequests.find(req => req.id === requestId);
    
    if (requestToReject) {
      setModalState({
        isOpen: true,
        type: 'reject',
        requestData: requestToReject,
        reason: ''
      });
    }
  };

  // Modal handlers
  const handleModalClose = () => {
    setModalState({
      isOpen: false,
      type: null,
      requestData: null,
      reason: ''
    });
  };

  const handleModalConfirm = async () => {
    const { type, requestData } = modalState;
    
    try {
    if (type === 'approve') {
        const response = await api.post(`/requests/${requestData.id}/approve`, {
          approval_notes: modalState.reason
        });
        
        if (response.data.success) {
      // Remove from pending requests
      setPendingRequests(prev => prev.filter(req => req.id !== requestData.id));
      
      // Add to approved requests
      const approvedRequest = {
        ...requestData,
            status: "approved",
            approved_by_name: "Admin",
            approved_at: new Date().toISOString()
      };
      
      setApprovedRequests(prev => [...prev, approvedRequest]);
      
      // Redirect to dedicated View Approved page
      if (typeof window !== 'undefined') {
        window.location.href = '/viewapproved';
          }
      }
    } else if (type === 'reject') {
        const response = await api.post(`/requests/${requestData.id}/reject`, {
          rejection_reason: modalState.reason
        });
        
        if (response.data.success) {
      // Remove from pending requests
      setPendingRequests(prev => prev.filter(req => req.id !== requestData.id));
        }
    }
    
    handleModalClose();
    } catch (err) {
      console.error('Error processing request:', err);
      alert('Error processing request: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleReasonChange = (reason) => {
    setModalState(prev => ({ ...prev, reason }));
  };

  // View and Edit modal handlers
  const handleViewTransaction = (transactionId) => {
    const transaction = currentHolders.find(t => t.id === transactionId);
    if (transaction) {
      setViewModal({
        isOpen: true,
        transactionData: transaction
      });
    }
  };

  const handleEditTransaction = (transactionId) => {
    const transaction = currentHolders.find(t => t.id === transactionId);
    if (transaction) {
      setEditModal({
        isOpen: true,
        transactionData: transaction
      });
    }
  };

  const handleCloseViewModal = () => {
    setViewModal({
      isOpen: false,
      transactionData: null
    });
  };

  const handleCloseEditModal = () => {
    setEditModal({
      isOpen: false,
      transactionData: null
    });
  };

  const handleTransactionUpdate = (updatedTransaction) => {
    // Update the current holders list with the updated transaction
    setCurrentHolders(prev => 
      prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t)
    );
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch pending requests
      const pendingResponse = await api.get('/requests', { params: { status: 'pending' } });
      if (pendingResponse.data.success) {
        setPendingRequests(pendingResponse.data.data);
      } else {
        console.error('Failed to fetch pending requests:', pendingResponse.data.message);
      }
      
      // Fetch approved requests
      const approvedResponse = await api.get('/requests', { params: { status: 'approved' } });
      if (approvedResponse.data.success) {
        setApprovedRequests(approvedResponse.data.data);
      } else {
        console.error('Failed to fetch approved requests:', approvedResponse.data.message);
      }
      
      // Fetch transactions for Current holder view
      const transactionsResponse = await api.get('/transactions');
      if (transactionsResponse.data.success) {
        const rows = Array.isArray(transactionsResponse.data.data) ? transactionsResponse.data.data : [];
        const mapped = rows.map((t) => ({
          id: t.id,
          name: t.full_name || t.name || '',
          position: t.position || '',
          item: t.equipment_name || t.item || '',
          requestMode: t.request_mode || 'onsite',
          requestDate: t.created_at,
          transactionNumber: t.transaction_number || null,
          status: t.status || 'pending',
          expectedReturnDate: t.expected_return_date || null,
          releaseDate: t.issued_at || null,
          returnDate: t.returned_at || null,
          releaseCondition: t.release_condition || t.condition_on_issue || null,
          returnCondition: t.return_condition || t.condition_on_return || null,
          releaseNotes: t.release_notes || t.notes || '',
          returnNotes: t.return_notes || '',
          brand: t.brand || null,
          model: t.model || null,
          categoryName: t.category_name || null,
        }));
        setCurrentHolders(mapped);

        // Populate verify returns (items that need return verification)
        const returnsToVerify = rows.filter(r => 
          ['returned', 'pending_return', 'released'].includes((r.status || '').toString().toLowerCase())
        ).map((t) => ({
          id: t.id,
          full_name: t.full_name || t.name || '',
          position: t.position || '',
          equipment_name: t.equipment_name || t.item || '',
          request_mode: t.request_mode || 'onsite',
          return_date: t.return_date || t.expected_return_date || null,
          expected_return_date: t.expected_return_date || null,
        }));
        setVerifyReturns(returnsToVerify);

        // If there are transactions, show the Current holder view automatically
        if (mapped.length > 0) {
          setView('currentHolder');
        }

        // Populate approved requests from transactions (statuses like 'released' or 'completed')
        const approved = rows.filter(r => ['released', 'completed', 'approved'].includes((r.status || '').toString().toLowerCase()))
          .map((t) => ({
            id: t.id,
            name: t.full_name || t.name || '',
            position: t.position || '',
            item: t.equipment_name || t.item || '',
            status: t.status || 'approved',
            approvedBy: t.released_by || t.approved_by || null,
            approvedAt: t.release_date || t.issued_at || t.created_at || null,
          }));

        if (approved.length > 0) {
          setApprovedRequests(approved);
        }
      } else {
        console.error('Failed to fetch transactions:', transactionsResponse.data.message);
        setCurrentHolders([]);
        setVerifyReturns([]); // Make sure to clear this too
      }
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data');
      setVerifyReturns([]); // Clear on error
    } finally {
      setLoading(false);
    }
  };

  // Small UI formatter helpers
  const formatRequestMode = (mode) => {
    const normalized = (mode || '').toString().toLowerCase();
    if (['work_from_home', 'w.f.h', 'wfh', 'work from home'].includes(normalized)) {
      return 'W.F.H';
    }
    return 'On-site';
  };

  // Success modal handlers
  const handleSuccessModalClose = () => {
    setSuccessModal({
      isOpen: false,
      type: null,
      requestData: null
    });
  };

  return (
    <div className="h-screen overflow-hidden bg-white flex">
      <HomeSidebar />
    <div className="flex-1 flex flex-col">
        <GlobalHeader title="View Request" />

      <main className="px-10 py-6 mb-10 flex flex-col overflow-hidden">
        <div className="flex-1 min-h-0 overflow-y-auto">
        <h2 className="text-4xl font-bold  text-blue-600">Transaction</h2>
        <h3 className="text-base font-semibold text-gray-700 mt-3 tracking-wide">QUICK ACCESS</h3>


          {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-9 mt-6">
          <div className="bg-gradient-to-b from-[#0064FF] to-[#003C99] text-white rounded-2xl p-3 shadow flex flex-col h-26">
            <h4 className="text-sm uppercase tracking-wider opacity-80">New Requests</h4>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-5xl font-bold">{pendingRequests.length}</p>
              <div className="w-6 h-6 rounded-full bg-white/30"></div>
            </div>
          </div>
          <div className="bg-gray-100 rounded-2xl p-3 shadow flex flex-col h-26">
            <h4 className="text-xs font-semibold text-gray-600">Current Holder</h4>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-2xl font-bold text-gray-900">{approvedRequests.length}</p>
              <div className="w-6 h-6 rounded-full bg-gray-300"></div>
            </div>
          </div>
          <div className="bg-gray-100 rounded-2xl p-3 shadow flex flex-col h-26">
            <h4 className="text-xs font-semibold text-gray-600">Verify Return</h4>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-2xl font-bold text-gray-900">{verifyReturns.length}</p>
              <div className="w-6 h-6 rounded-full bg-gray-300"></div>
            </div>
          </div>
        </div>

        {/* Dropdown will be shown inside each section header aligned with its title */}

{view === 'viewRequest' && (
  <>
    <div className="mt-8">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-800">View Request</h4>
          <div className="relative">
            <button
              type="button"
              className="w-44 h-10 bg-gray-300 rounded-md flex items-center justify-between px-4 text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="text-sm font-medium">
                {view === 'viewRequest' ? 'View Request' : 
                 view === 'viewApproved' ? 'View Approved' :
                 view === 'currentHolder' ? 'Current holder' : 'Verify return'}
              </span>
              <ChevronDown className="h-4 w-4" />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 z-10 mt-2 w-44 bg-white rounded-md shadow border border-gray-200">
                <button onClick={() => handleSelect('viewRequest')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">View Request</button>
                <button onClick={() => handleSelect('currentHolder')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">Current holder</button>
                <button onClick={() => handleSelect('verifyReturn')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">Verify return</button>
              </div>
            )}
          </div>
        </div>
        <div className="flex text-xs font-medium text-gray-900 uppercase tracking-wider mb-4 px-4 mt-4">
          <div className="flex-1">Name</div>
          <div className="flex-1">Item</div>
          <div className="w-24 text-right">Actions</div>
        </div>
      </div>
      
      {loading ? (
        <div className="py-8 text-center text-gray-500">
          Loading pending requests...
        </div>
      ) : error ? (
        <div className="py-8 text-center text-red-500">
          Error: {error}
        </div>
      ) : pendingRequests.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          No pending requests found
        </div>
      ) : (
        <div className="space-y-3">
          {pendingRequests.map((req, index) => (
            <div
              key={req.id}
              onClick={() => handleRowClick(req.id)}
              className="flex items-center py-4 px-4 rounded-xl cursor-pointer border-2 bg-white border-gray-300 hover:bg-blue-50 hover:border-blue-400 transition-all duration-200"
            >
              {/* Name */}
              <div className="flex-1">
                <div className="text-base font-medium text-gray-900">{req.full_name}</div>
              </div>
              
              {/* Item  */}
              <div className="flex-1">
                <span className="inline-block text-gray-900 text-sm font-medium px-3 py-1 rounded-md">
                  {req.equipment_name}
                </span>
              </div>
              
              {/* Action Buttons */}
              <div className="w-24 flex items-center justify-end space-x-2">
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setConfirmModal({ isOpen: true, mode: 'approve', requestId: req.id });
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded-md bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                  title="Approve Request"
                  type="button"
                >
                  <Check size={14} />
                </button>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    handleReject(req.id);
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded-md bg-red-500 hover:bg-red-600 text-white transition-colors"
                  title="Reject Request"
                  type="button"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </>
)}

{view === 'currentHolder' && (
  <>
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold text-gray-800">Current holder</h3>
        <div className="relative">
          <button
            type="button"
            className="w-44 h-10 bg-gray-300 rounded-md flex items-center justify-between px-4 text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="text-sm font-medium">
              {view === 'viewRequest' ? 'View Request' : 
               view === 'viewApproved' ? 'View Approved' :
               view === 'currentHolder' ? 'Current holder' : 'Verify return'}
            </span>
            <ChevronDown className="h-4 w-4" />
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 z-10 mt-2 w-44 bg-white rounded-md shadow border border-gray-200">
              <button onClick={() => handleSelect('viewRequest')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">View Request</button>
              <button onClick={() => handleSelect('currentHolder')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">Current holder</button>
              <button onClick={() => handleSelect('verifyReturn')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">Verify return</button>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Name</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Position</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Item</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Request mode</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">End Date</th>
              <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
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
                <tr key={row.id} className="border-b border-gray-100 last:border-0 hover:bg-blue-50">
                  <td className="py-4 px-6 text-sm font-medium text-gray-900">
                    {row.name || 'John Doe'}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-700">
                    {row.position || 'Manager'}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-700">
                    {row.item || 'Laptop'}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-700">
                    {formatRequestMode(row.requestMode)}
                  </td>
                  <td className="py-4 px-6 text-sm text-red-600 font-medium">
                    {row.expectedReturnDate ? new Date(row.expectedReturnDate).toLocaleDateString() : '2025-10-23'}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end space-x-2">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        Active
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-600 text-white">
                        Released
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  </>
)}

{view === 'verifyReturn' && (
  <>
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold text-gray-800">Verify return</h3>
        <div className="relative">
          <button
            type="button"
            className="w-44 h-10 bg-gray-300 rounded-md flex items-center justify-between px-4 text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="text-sm font-medium">
              {view === 'viewRequest' ? 'View Request' : 
               view === 'viewApproved' ? 'View Approved' :
               view === 'currentHolder' ? 'Current holder' : 'Verify return'}
            </span>
            <ChevronDown className="h-4 w-4" />
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 z-10 mt-2 w-44 bg-white rounded-md shadow border border-gray-200">
              <button onClick={() => handleSelect('viewRequest')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">View Request</button>
              <button onClick={() => handleSelect('currentHolder')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">Current holder</button>
              <button onClick={() => handleSelect('verifyReturn')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">Verify return</button>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Name</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Position</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Item</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Request mode</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">End Date</th>
              <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-gray-500">
                  Loading verify returns...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-red-500">
                  Error: {error}
                </td>
              </tr>
            ) : verifyReturns.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-gray-500">
                  No returns to verify found
                </td>
              </tr>
            ) : (
              verifyReturns.map((row) => (
                <tr key={row.id} className="border-b border-gray-100 last:border-0 hover:bg-blue-50">
                  <td className="py-4 px-6 text-sm font-medium text-gray-900">
                    {row.full_name || 'John Doe'}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-700">
                    {row.position || 'Manager'}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-700">
                    {row.equipment_name || 'Laptop'}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-700">
                    {formatRequestMode(row.request_mode)}
                  </td>
                  <td className="py-4 px-6 text-sm text-red-600 font-medium">
                    {row.return_date || row.expected_return_date || '2025-10-23'}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end space-x-2">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                        Pending
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-600 text-white">
                        Returned
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  </>
)}
 </div>
</main>
</div>
      
      {/* Verification Modal */}
      <VerificationModal
        isOpen={modalState.isOpen}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        type={modalState.type}
        requestData={modalState.requestData}
        title={modalState.type === 'approve' ? 'Approve Request' : 'Reject Request'}
        message={modalState.type === 'approve' 
          ? 'Are you sure you want to approve this request? This will move it to the approved list.'
          : 'Are you sure you want to reject this request? This action cannot be undone.'
        }
        confirmText={modalState.type === 'approve' ? 'Approve Request' : 'Reject Request'}
        cancelText="Cancel"
        showReasonInput={modalState.type === 'reject'}
        reason={modalState.reason}
        onReasonChange={handleReasonChange}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={handleSuccessModalClose}
        type={successModal.type}
        requestData={successModal.requestData}
        action={successModal.type === 'approve' ? 'approved' : 'rejected'}
      />

      {/* Simple Confirm Modal for check/X */}
      <SimpleConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, mode: null, requestId: null })}
        onConfirm={async () => {
          if (confirmModal.mode === 'approve') {
            try {
              const response = await api.post(`/requests/${confirmModal.requestId}/approve`);
              if (response.data.success) {
            const requestToApprove = pendingRequests.find(req => req.id === confirmModal.requestId);
            if (requestToApprove) {
              setPendingRequests(prev => prev.filter(req => req.id !== confirmModal.requestId));
              const approvedRequest = {
                ...requestToApprove,
                    status: 'approved',
                    approved_by_name: 'Admin',
                    approved_at: new Date().toISOString()
              };
              setApprovedRequests(prev => [...prev, approvedRequest]);
                }
              }
            } catch (err) {
              console.error('Error approving request:', err);
              alert('Error approving request: ' + (err.response?.data?.message || err.message));
            }
          } else if (confirmModal.mode === 'delete') {
            // For delete, open the detailed reject modal to capture optional reason
            const requestToReject = pendingRequests.find(req => req.id === confirmModal.requestId);
            if (requestToReject) {
              setModalState({ isOpen: true, type: 'reject', requestData: requestToReject, reason: '' });
            }
          }
          setConfirmModal({ isOpen: false, mode: null, requestId: null });
        }}
        title={confirmModal.mode === 'approve' ? 'Approving Request' : 'Deleting Request'}
        message={'Are you sure you want to continue?'}
        confirmText={confirmModal.mode === 'approve' ? 'Approve' : 'Delete'}
        confirmTone={confirmModal.mode === 'approve' ? 'primary' : 'danger'}
      />

      {/* View Transaction Modal */}
      <ViewTransactionModal
        isOpen={viewModal.isOpen}
        onClose={handleCloseViewModal}
        transactionData={viewModal.transactionData}
      />

      {/* Edit Transaction Modal */}
      <EditTransactionModal
        isOpen={editModal.isOpen}
        onClose={handleCloseEditModal}
        transactionData={editModal.transactionData}
        onUpdate={handleTransactionUpdate}
      />
    </div>
  );
};

export default ViewRequest;