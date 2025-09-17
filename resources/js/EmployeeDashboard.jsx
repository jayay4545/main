import React, { useState, useEffect } from 'react';

const EmployeeDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [currentHolders, setCurrentHolders] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [verifyReturns, setVerifyReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API Base URL
  const API_BASE = 'http://localhost:8000/api';

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [employeesRes, currentHoldersRes, pendingRequestsRes, verifyReturnsRes] = await Promise.all([
        fetch(`${API_BASE}/employees`),
        fetch(`${API_BASE}/employees/current-holders`),
        fetch(`${API_BASE}/employees/pending-requests`),
        fetch(`${API_BASE}/employees/verify-returns`)
      ]);

      const [employeesData, currentHoldersData, pendingRequestsData, verifyReturnsData] = await Promise.all([
        employeesRes.json(),
        currentHoldersRes.json(),
        pendingRequestsRes.json(),
        verifyReturnsRes.json()
      ]);

      if (employeesData.success) setEmployees(employeesData.data);
      if (currentHoldersData.success) setCurrentHolders(currentHoldersData.data);
      if (pendingRequestsData.success) setPendingRequests(pendingRequestsData.data);
      if (verifyReturnsData.success) setVerifyReturns(verifyReturnsData.data);

    } catch (err) {
      setError('Failed to fetch data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit'
    });
  };

  const getRequestModeDisplay = (mode) => {
    return mode === 'work_from_home' ? 'W.F.H' : 'Onsite';
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="employee-dashboard">
      <h1>Employee Dashboard</h1>
      
      {/* All Employees Section */}
      <div className="section">
        <h2>All Employees ({employees.length})</h2>
        <div className="employee-grid">
          {employees.map(emp => (
            <div key={emp.id} className="employee-card">
              <h3>{emp.first_name} {emp.last_name}</h3>
              <p><strong>ID:</strong> {emp.employee_id}</p>
              <p><strong>Position:</strong> {emp.position}</p>
              <p><strong>Department:</strong> {emp.department}</p>
              <p><strong>Email:</strong> {emp.email}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Current Holders Section */}
      <div className="section">
        <h2>Current Holders ({currentHolders.length})</h2>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Item</th>
                <th>Request Mode</th>
                <th>End Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentHolders.map(holder => (
                <tr key={holder.transaction_id}>
                  <td>{holder.first_name} {holder.last_name}</td>
                  <td>{holder.position}</td>
                  <td>{holder.equipment_name}</td>
                  <td>{getRequestModeDisplay(holder.request_mode)}</td>
                  <td className="end-date">{formatDate(holder.expected_return_date)}</td>
                  <td>
                    <button className="action-btn view">👁️</button>
                    <button className="action-btn edit">✏️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending Requests Section */}
      <div className="section">
        <h2>View Request ({pendingRequests.length})</h2>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Item</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingRequests.map(request => (
                <tr key={request.request_id}>
                  <td>
                    <div>
                      <strong>{request.first_name} {request.last_name}</strong>
                      <br />
                      <small>{request.position}</small>
                    </div>
                  </td>
                  <td>{request.equipment_name}</td>
                  <td>
                    <button className="action-btn approve">✓</button>
                    <button className="action-btn reject">✗</button>
                    <button className="action-btn print">🖨️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verify Returns Section */}
      <div className="section">
        <h2>Verify Return ({verifyReturns.length})</h2>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Item</th>
                <th>End Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {verifyReturns.map(returnItem => (
                <tr key={returnItem.transaction_id}>
                  <td>{returnItem.first_name} {returnItem.last_name}</td>
                  <td>{returnItem.position}</td>
                  <td>{returnItem.equipment_name}</td>
                  <td className="end-date">{formatDate(returnItem.return_date)}</td>
                  <td>
                    <button className="action-btn partial">Partial</button>
                    <button className="action-btn returned">Returned</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
