import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

/**
 * Custom hook for managing request data with proper error handling and loading states
 */
export const useRequestData = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [currentHolders, setCurrentHolders] = useState([]);
  const [verifyReturns, setVerifyReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all data in parallel for better performance
      const [pendingRes, approvedRes, transactionsRes] = await Promise.all([
        api.get('/requests', { params: { status: 'pending' } }),
        api.get('/requests', { params: { status: 'approved' } }),
        api.get('/transactions')
      ]);

      // Handle pending requests
      if (pendingRes.data.success) {
        setPendingRequests(pendingRes.data.data);
      }

      // Handle approved requests
      if (approvedRes.data.success) {
        setApprovedRequests(approvedRes.data.data);
      }

      // Handle transactions
      if (transactionsRes.data.success) {
        const rows = Array.isArray(transactionsRes.data.data) ? transactionsRes.data.data : [];
        
        // Map transactions to current holders
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

        // Populate verify returns
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
      }
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    pendingRequests,
    approvedRequests,
    currentHolders,
    verifyReturns,
    loading,
    error,
    refreshData,
    setPendingRequests,
    setApprovedRequests,
    setCurrentHolders,
    setVerifyReturns
  };
};
