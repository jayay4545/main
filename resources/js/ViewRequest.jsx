import React, { useEffect, useState } from 'react';
import { Search, Printer, Check, X, ChevronDown, Eye, Pencil } from 'lucide-react';
import Taskbar from './components/Taskbar.jsx';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [view, setView] = useState('viewRequest');
  const [currentHolders, setCurrentHolders] = useState([]);
  
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
      } else {
        console.error('Failed to fetch transactions:', transactionsResponse.data.message);
      }
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
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
      <Taskbar title="Transaction" />

      <main className="px-10 py-6 mb-10 flex flex-col overflow-hidden">
        <div className="flex-1 min-h-0 overflow-y-auto">
        <h2 className="text-4xl font-bold text-blue-600">Transaction</h2>
        <h3 className="text-base font-semibold text-gray-700 mt-3 tracking-wide">QUICK ACCESS</h3>

        <div className="grid grid-cols-3 gap-6 mt-4">
          <div className="bg-blue-600 text-white rounded-2xl p-6 shadow flex flex-col">
            <h4 className="text-sm uppercase tracking-wider opacity-80">New Requests</h4>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-5xl font-bold">{pendingRequests.length}</p>
              <div className="w-10 h-10 rounded-full bg-white/30"></div>
            </div>
          </div>
          <div className="bg-gray-100 rounded-2xl p-6 shadow flex flex-col">
            <h4 className="text-sm font-semibold text-gray-600">Approved Requests</h4>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-4xl font-bold text-gray-900">{approvedRequests.length}</p>
              <div className="w-10 h-10 rounded-full bg-gray-300"></div>
            </div>
          </div>
          <div className="bg-gray-100 rounded-2xl p-6 shadow flex flex-col">
            <h4 className="text-sm font-semibold text-gray-600">Verify Return</h4>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-4xl font-bold text-gray-900">6</p>
              <div className="w-10 h-10 rounded-full bg-gray-300"></div>
            </div>
          </div>
        </div>

        {/* Mode dropdown (grey shape) */}
        <div className="mt-6 flex justify-center">
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
              <div className="absolute z-10 mt-2 w-44 bg-white rounded-md shadow border border-gray-200">
                <button onClick={() => handleSelect('viewRequest')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">View Request</button>
                <button onClick={() => handleSelect('currentHolder')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">Current holder</button>
                <button onClick={() => handleSelect('verifyReturn')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">Verify return</button>
              </div>
            )}
          </div>
        </div>

        {view === 'viewRequest' && (
          <>
            <h3 className="mt-10 text-3xl font-semibold text-gray-700">View Request</h3>
            <div className="mt-4 bg-white rounded-xl shadow p-6">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b text-gray-600">
                    <th className="pb-2">Name</th>
                    <th className="pb-2">Item</th>
                    <th className="pb-2">Request Date</th>
                    <th className="pb-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-gray-500">
                        Loading pending requests...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-red-500">
                        Error: {error}
                      </td>
                    </tr>
                  ) : pendingRequests.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-gray-500">
                        No pending requests found
                      </td>
                    </tr>
                  ) : (
                    pendingRequests.map((req) => (
                    <tr
                      key={req.id}
                      onClick={() => handleRowClick(req.id)}
                      className="border-b last:border-0 cursor-pointer hover:bg-gray-50"
                    >
                      <td className="py-4">
                          <div className="font-medium text-gray-900">{req.full_name}</div>
                        <div className="text-gray-500 text-xs">{req.position}</div>
                      </td>
                        <td className="py-4 text-gray-700">{req.equipment_name}</td>
                        <td className="py-4 text-gray-600 text-sm">{req.requested_date}</td>
                      <td className="py-4">
                        <div className="flex items-center justify-end space-x-3">
                          <button 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              setConfirmModal({ isOpen: true, mode: 'approve', requestId: req.id });
                            }}
                            className="h-10 w-10 flex items-center justify-center rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500/20 border border-green-200 hover:border-green-300 cursor-pointer"
                            title="Approve Request"
                            type="button"
                          >
                            <Check className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              handleReject(req.id);
                            }}
                            className="h-10 w-10 flex items-center justify-center rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 border border-red-200 hover:border-red-300 cursor-pointer"
                            title="Reject Request"
                            type="button"
                          >
                            <X className="h-5 w-5" />
                          </button>
                          <Printer className="h-5 w-5 text-gray-500 cursor-pointer hover:text-gray-700" title="Print Request" />
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
                  {currentHolders.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-gray-500">No current holders found</td>
                    </tr>
                  ) : (
                    currentHolders.map((req) => (
                      <tr key={req.id} className="border-b last:border-0">
                        <td className="py-4">
                          <div className="font-medium text-gray-900">{req.name}</div>
                        </td>
                        <td className="py-4">{req.position}</td>
                        <td className="py-4">{req.item}</td>
                        <td className="py-4">{req.requestMode === 'work_from_home' ? 'W.F.H' : 'Onsite'}</td>
                        <td className="py-4 text-red-600">{req.expectedReturnDate ? new Date(req.expectedReturnDate).toLocaleDateString() : 'N/A'}</td>
                        <td className="py-4">
                          <div className="flex items-center justify-end space-x-4 text-gray-700">
                            <button onClick={() => handleViewTransaction(req.id)} className="p-1 hover:bg-blue-50 rounded transition-colors" title="View Transaction Details">
                              <Eye className="h-5 w-5 cursor-pointer hover:text-blue-600" />
                            </button>
                            <button onClick={() => handleEditTransaction(req.id)} className="p-1 hover:bg-blue-50 rounded transition-colors" title="Edit Transaction">
                              <Pencil className="h-5 w-5 cursor-pointer hover:text-blue-600" />
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
                  {approvedRequests.map((req) => (
                    <tr key={req.id} className="border-b last:border-0">
                      <td className="py-4">{req.name}</td>
                      <td className="py-4">{req.position}</td>
                      <td className="py-4">{req.item}</td>
                      <td className="py-4 text-red-600">10/08/25</td>
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


