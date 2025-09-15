import React, { useState } from 'react';
import { Search, Printer, Eye, Folder, User, Clock, ChevronDown, ChevronUp, FileText, Home, Check, X, Pencil } from 'lucide-react';
import VerificationModal from './components/VerificationModal';

const SuperAdmin = () => {
  const [activeMenu, setActiveMenu] = useState('Home');
  const [openDropdown, setOpenDropdown] = useState(false); // For Equipment dropdown
  const [openTransactionDropdown, setOpenTransactionDropdown] = useState(false); // For Transaction dropdown
  const [transactionView, setTransactionView] = useState('viewRequest'); // For transaction view switching
  const [processingRequest, setProcessingRequest] = useState(null); // Track which request is being processed
  
  // Modal state
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null, // 'approve' or 'reject'
    requestData: null,
    reason: ''
  });

  const [pendingRequests, setPendingRequests] = useState([
    { id: 1, name: "John Paul Francisco", position: "NOC tier 1", item: "Dell Laptop + 24\" Monitor", status: "Pending", approvedBy: "Ms. France", requestDate: "2024-01-15" },
    { id: 2, name: "Kyle Dela Cruz", position: "NOC tier 1", item: "MacBook Pro + Magic Mouse", status: "Pending", approvedBy: "Ms. Jewel", requestDate: "2024-01-16" },
    { id: 3, name: "Rica Alorro", position: "NOC tier 1", item: "HP Laptop + External Keyboard", status: "Pending", approvedBy: "Ms. France", requestDate: "2024-01-17" },
    { id: 4, name: "Carlo Divino", position: "NOC tier 1", item: "Lenovo ThinkPad + Webcam", status: "Pending", approvedBy: "Ms. France", requestDate: "2024-01-18" },
    { id: 5, name: "Maria Santos", position: "Software Developer", item: "Gaming Chair + Standing Desk", status: "Pending", approvedBy: "Mr. Johnson", requestDate: "2024-01-19" },
    { id: 6, name: "David Kim", position: "UI/UX Designer", item: "Wacom Tablet + 4K Monitor", status: "Pending", approvedBy: "Ms. Smith", requestDate: "2024-01-20" },
    { id: 7, name: "Sarah Johnson", position: "Project Manager", item: "Noise Cancelling Headphones", status: "Pending", approvedBy: "Mr. Brown", requestDate: "2024-01-21" },
  ]);
  const [approvedRequests, setApprovedRequests] = useState([
    { id: 101, name: "Alex Thompson", position: "Senior Developer", item: "Dell XPS 15 + Dual Monitors", status: "Approved", approvedBy: "John F.", approvedAt: "2024-01-10" },
    { id: 102, name: "Lisa Chen", position: "Data Analyst", item: "MacBook Air + iPad Pro", status: "Approved", approvedBy: "John F.", approvedAt: "2024-01-12" },
    { id: 103, name: "Michael Rodriguez", position: "DevOps Engineer", item: "Mechanical Keyboard + Mouse", status: "Approved", approvedBy: "John F.", approvedAt: "2024-01-14" },
  ]);

  const menuItems = [
    { icon: Home, label: 'Home' },
    { icon: FileText, label: 'Transaction', hasDropdown: true, dropdownType: 'transaction' },
    { icon: Folder, label: 'Equipment', hasDropdown: true, dropdownType: 'equipment' },
    { icon: User, label: 'Employee' },
    { icon: Clock, label: 'Reports' },
    { icon: User, label: 'Role Management' },
    { icon: User, label: 'Control Panel' },
    { icon: Clock, label: 'Activity Logs' },
    { icon: User, label: 'Users' },
  ];
  
  const transactionItems = [
    { icon: Eye, label: 'View Approved' },
    { icon: Eye, label: 'View Request' },
  ];

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

  const handleModalConfirm = () => {
    const { type, requestData } = modalState;
    
    if (type === 'approve') {
      // Remove from pending requests
      setPendingRequests(prev => prev.filter(req => req.id !== requestData.id));
      
      // Add to approved requests
      const approvedRequest = {
        ...requestData,
        status: "Approved",
        approvedBy: "John F.",
        approvedAt: new Date().toLocaleDateString()
      };
      
      setApprovedRequests(prev => [...prev, approvedRequest]);
      
      // Show success message
      alert(`Request from ${requestData.name} has been approved successfully! You can now view it in the "View Approved" section.`);
    } else if (type === 'reject') {
      // Remove from pending requests
      setPendingRequests(prev => prev.filter(req => req.id !== requestData.id));
      
      // Show success message
      alert(`Request from ${requestData.name} has been rejected.`);
    }
    
    handleModalClose();
  };

  const handleReasonChange = (reason) => {
    setModalState(prev => ({ ...prev, reason }));
  };

  const currentHolders = [
    { id: 1, name: "John Paul Francisco", position: "NOC tier 1", item: "Laptop, Monitor, etc", requestMode: "W.F.H", endDate: "10/08/25" },
    { id: 2, name: "Kyle Dela Cruz", position: "NOC tier 1", item: "Laptop, Monitor, etc", requestMode: "Onsite", endDate: "15/08/25" },
    { id: 3, name: "Rica Alorro", position: "NOC tier 1", item: "Laptop, Monitor, etc", requestMode: "W.F.H", endDate: "12/08/25" },
    { id: 4, name: "Carlo Divino", position: "NOC tier 1", item: "Laptop, Monitor, etc", requestMode: "Onsite", endDate: "18/08/25" },
  ];

  const verifyReturns = [
    { id: 1, name: "John Paul Francisco", position: "NOC tier 1", item: "Laptop, Monitor, etc", endDate: "10/08/25", status: "Partial" },
    { id: 2, name: "Kyle Dela Cruz", position: "NOC tier 1", item: "Laptop, Monitor, etc", endDate: "15/08/25", status: "Returned" },
    { id: 3, name: "Rica Alorro", position: "NOC tier 1", item: "Laptop, Monitor, etc", endDate: "12/08/25", status: "Partial" },
    { id: 4, name: "Carlo Divino", position: "NOC tier 1", item: "Laptop, Monitor, etc", endDate: "18/08/25", status: "Returned" },
  ];

  
  return (
    <div className="min-h-screen bg-white-100 flex">
      {/* Sidebar Wrapper */}
      <div className="flex flex-col">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img
            src="/images/Frame_89-removebg-preview.png"
            alt="iREPLY Logo"
            className="h-20 ml-4 w-auto object-contain"
            onError={(e) => {
              console.log('Image failed to load, trying fallback path');
              e.target.onerror = null;
              // Try multiple fallback paths
              e.target.src = '/images/Frame 35.jpg';
              // If that fails too, set another fallback
              e.target.onerror = () => {
                console.log('Fallback image also failed, using text fallback');
                e.target.onerror = null;
                // Replace with a div containing the text
                const parent = e.target.parentNode;
                if (parent) {
                  const textNode = document.createElement('div');
                  textNode.className = 'h-20 ml-4 flex items-center justify-center';
                  textNode.innerHTML = '<span class="text-white font-bold text-xl">iREPLY</span>';
                  parent.replaceChild(textNode, e.target);
                }
              };
            }}
          />
        </div>

        {/* Sidebar */}
        <aside className="w-60 bg-blue-600 min-h-full relative overflow-hidden rounded-tr-[60px] flex flex-col">
          <nav className="mt-8 space-y-2">
            {menuItems.map((item, index) => (
              <div key={index}>
                {/* Main Menu Button */}
                <button
                  onClick={() => {
                    setActiveMenu(item.label);
                    if (item.hasDropdown) {
                      if (item.dropdownType === 'transaction') {
                        setOpenTransactionDropdown(!openTransactionDropdown);
                        setOpenDropdown(false);
                      } else if (item.dropdownType === 'equipment') {
                        setOpenDropdown(!openDropdown);
                        setOpenTransactionDropdown(false);
                      }
                    } else {
                      // Handle navigation for non-dropdown items
                      if (item.label === 'Employee') {
                        window.location.href = '/employee';
                      } else if (item.label === 'Role Management') {
                        window.location.href = '/role-management';
                      } else if (item.label === 'Users') {
                        window.location.href = '/users';
                      } else if (item.label === 'Reports') {
                        // Could navigate to reports page or show reports section
                        console.log('Navigate to Reports');
                      } else if (item.label === 'Control Panel') {
                        // Could navigate to control panel or show control panel section
                        console.log('Navigate to Control Panel');
                      } else if (item.label === 'Activity Logs') {
                        // Could navigate to activity logs or show activity logs section
                        console.log('Navigate to Activity Logs');
                      }
                    }
                  }}
                  className={`w-50 flex items-center justify-between px-7 py-2 rounded-r-full transition-colors ${
                    activeMenu === item.label
                      ? 'bg-white text-blue-600'
                      : 'text-white hover:bg-blue-700'
                  }`}
                >
                  <div className="flex items-center space-x-5">
                    <item.icon className="h-6 w-6" />
                    <span className="font-normal">{item.label}</span>
                  </div>

                  {/* Dropdown Arrow if needed */}
                  {item.hasDropdown && (
                    (item.dropdownType === 'equipment' && openDropdown) || 
                    (item.dropdownType === 'transaction' && openTransactionDropdown) ? 
                      <ChevronUp className="h-4 w-4" />
                    : 
                      <ChevronDown className="h-4 w-4" />
                  )}
                </button>

                {/* Equipment Dropdown Content */}
                {item.hasDropdown && item.dropdownType === 'equipment' && openDropdown && (
                  <div className="ml-12 mt-2 space-y-2 text-sm text-white">
                    <p 
                      className="cursor-pointer hover:underline"
                      onClick={() => {
                        window.location.href = '/addstocks';
                        setActiveMenu('Equipment');
                      }}
                    >
                      • Add Stocks
                    </p>
                    <p 
                      className="cursor-pointer hover:underline"
                      onClick={() => {
                        window.location.href = '/equipment';
                        setActiveMenu('Equipment');
                      }}
                    >
                      • View Stocks
                    </p>
                  </div>
                )}
                
                {/* Transaction Dropdown Content */}
                {item.hasDropdown && item.dropdownType === 'transaction' && openTransactionDropdown && (
                  <div className="ml-12 mt-2 space-y-2 text-sm text-white">
                    <p 
                      className="cursor-pointer hover:underline"
                      onClick={() => {
                        setTransactionView('viewRequest');
                        setActiveMenu('Transaction');
                      }}
                    >
                      • View Request
                    </p>
                    <p 
                      className="cursor-pointer hover:underline"
                      onClick={() => {
                        setTransactionView('viewApproved');
                        setActiveMenu('Transaction');
                      }}
                    >
                      • View Approved
                    </p>
                    <p 
                      className="cursor-pointer hover:underline"
                      onClick={() => {
                        setTransactionView('currentHolder');
                        setActiveMenu('Transaction');
                      }}
                    >
                      • Current Holder
                    </p>
                    <p 
                      className="cursor-pointer hover:underline"
                      onClick={() => {
                        setTransactionView('verifyReturn');
                        setActiveMenu('Transaction');
                      }}
                    >
                      • Verify Return
                    </p>
                   </div>
                )}
              </div>
            ))}
          </nav>
        </aside>
      </div>

      {/* Main Section */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white-100">
          {/* Search */}
          <div className="flex-1 max-w-lg ml-9 mt-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-10 pr-4 py-2 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>
          </div>

          {/* Profile */}
          <div className="flex items-center space-x-3 ml-8 mt-2">
            <div className="w-8 h-8 bg-gray-300 rounded-lg"></div>
            <div className="w-8 h-8 bg-gray-300 rounded-lg"></div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">John F.</span>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">J</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 p-6 -ml-6 pl-12">
          
          {/* Dashboard Title */}
          <h2 className="text-4xl font-bold text-blue-600">Transaction</h2>
          <h3 className="text-base font-semibold text-gray-700 mt-3 tracking-wide">QUICK ACCESS</h3>

          {/* Quick Access Cards */}
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

          {/* Mode dropdown - only show for Transaction menu */}
          {activeMenu === 'Transaction' && (
            <div className="mt-6 flex justify-center">
              <div className="relative">
                <button
                  type="button"
                  className="w-44 h-10 bg-gray-300 rounded-md flex items-center justify-between px-4 text-gray-700"
                  onClick={() => {
                    // Toggle dropdown logic can be added here if needed
                  }}
                >
                  <span className="text-sm font-medium">
                    {transactionView === 'viewRequest' ? 'View Request' : 
                     transactionView === 'viewApproved' ? 'View Approved' :
                     transactionView === 'currentHolder' ? 'Current holder' : 'Verify return'}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Home Section */}
          {activeMenu === 'Home' && (
            <>
              <h3 className="mt-10 text-3xl font-semibold text-gray-700">Super Admin Dashboard</h3>
              <div className="mt-6 grid grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow p-6">
                  <h4 className="text-lg font-semibold mb-4">System Overview</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Users:</span>
                      <span className="font-semibold">150</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Active Equipment:</span>
                      <span className="font-semibold">89</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pending Requests:</span>
                      <span className="font-semibold text-orange-600">{pendingRequests.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Approved Requests:</span>
                      <span className="font-semibold text-green-600">{approvedRequests.length}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow p-6">
                  <h4 className="text-lg font-semibold mb-4">Quick Actions</h4>
                  <div className="space-y-3">
                    <button 
                      className="w-full text-left px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                      onClick={() => {
                        setActiveMenu('Transaction');
                        setTransactionView('viewRequest');
                      }}
                    >
                      Review Pending Requests
                    </button>
                    <button 
                      className="w-full text-left px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
                      onClick={() => {
                        setActiveMenu('Transaction');
                        setTransactionView('viewApproved');
                      }}
                    >
                      View Approved Requests
                    </button>
                    <button 
                      className="w-full text-left px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100"
                      onClick={() => window.location.href = '/users'}
                    >
                      Manage Users
                    </button>
                    <button 
                      className="w-full text-left px-4 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100"
                      onClick={() => window.location.href = '/role-management'}
                    >
                      Role Management
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* View Request Section */}
          {activeMenu === 'Transaction' && transactionView === 'viewRequest' && (
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
                    {pendingRequests.map((req) => (
                      <tr key={req.id} className="border-b last:border-0">
                        <td className="py-4">
                          <div className="font-medium text-gray-900">{req.name}</div>
                          <div className="text-gray-500 text-xs">{req.position}</div>
                        </td>
                        <td className="py-4 text-gray-700">{req.item}</td>
                        <td className="py-4 text-gray-600 text-sm">{req.requestDate}</td>
                        <td className="py-4">
                          <div className="flex items-center justify-end space-x-3">
                            <button 
                              onClick={() => handleApprove(req.id)}
                              className="h-10 w-10 flex items-center justify-center rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500/20 border border-green-200 hover:border-green-300 cursor-pointer"
                              title="Approve Request"
                              type="button"
                            >
                              <Check className="h-5 w-5" />
                            </button>
                            <button 
                              onClick={() => handleReject(req.id)}
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
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* View Approved Section */}
          {activeMenu === 'Transaction' && transactionView === 'viewApproved' && (
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
                      <th className="pb-2">Approved Date</th>
                      <th className="pb-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvedRequests.map((req) => (
                      <tr key={req.id} className="border-b last:border-0">
                        <td className="py-4">
                          <div className="font-medium text-gray-900">{req.name}</div>
                          <div className="text-gray-500 text-xs">{req.position}</div>
                        </td>
                        <td className="py-4 text-gray-700">{req.item}</td>
                        <td className="py-4 text-green-600">{req.status}</td>
                        <td className="py-4 text-gray-700">{req.approvedBy}</td>
                        <td className="py-4 text-gray-600 text-sm">{req.approvedAt}</td>
                        <td className="py-4">
                          <div className="flex items-center justify-end space-x-2">
                            <Printer className="h-5 w-5 text-gray-600" />
                            <button className="px-3 py-1 bg-green-500 text-white rounded-full text-xs">
                              Release
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Current Holder Section */}
          {activeMenu === 'Transaction' && transactionView === 'currentHolder' && (
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
                    {currentHolders.map((req) => (
                      <tr key={req.id} className="border-b last:border-0">
                        <td className="py-4">
                          <div className="font-medium text-gray-900">{req.name}</div>
                          <div className="text-gray-500 text-xs">{req.position}</div>
                        </td>
                        <td className="py-4 text-gray-700">{req.item}</td>
                        <td className="py-4 text-gray-700">{req.requestMode}</td>
                        <td className="py-4 text-red-600">{req.endDate}</td>
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
              </div>
            </>
          )}

          {/* Verify Return Section */}
          {activeMenu === 'Transaction' && transactionView === 'verifyReturn' && (
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
                    {verifyReturns.map((req) => (
                      <tr key={req.id} className="border-b last:border-0">
                        <td className="py-4">
                          <div className="font-medium text-gray-900">{req.name}</div>
                          <div className="text-gray-500 text-xs">{req.position}</div>
                        </td>
                        <td className="py-4 text-gray-700">{req.item}</td>
                        <td className="py-4 text-red-600">{req.endDate}</td>
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
    </div>
  );
};

export default SuperAdmin;
