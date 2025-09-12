import React, { useState } from 'react';
import { Search, Printer, Eye, Folder, User, Clock, ChevronDown, ChevronUp, FileText, Home } from 'lucide-react';

const SuperAdmin = () => {
  const [activeMenu, setActiveMenu] = useState('Home');
  const [openDropdown, setOpenDropdown] = useState(false); // For Equipment dropdown
  const [openTransactionDropdown, setOpenTransactionDropdown] = useState(false); // For Transaction dropdown

  const menuItems = [
    { icon: Home, label: 'Home' },
    { icon: FileText, label: 'Transaction', hasDropdown: true, dropdownType: 'transaction' },
    { icon: Folder, label: 'Equipment', hasDropdown: true, dropdownType: 'equipment' },
    { icon: User, label: 'Add Employee' },
    { icon: Clock, label: 'Reports' },
  ];
  
  const transactionItems = [
    { icon: Eye, label: 'View Approved' },
    { icon: Eye, label: 'View Request' },
  ];

  const requests = [
    { id: 1, name: "John Paul Francisco", position: "NOC tier 1", item: "Laptop, Monitor, etc", status: "Approved", approvedBy: "Ms. France" },
    { id: 2, name: "Kyle Dela Cruz", position: "NOC tier 1", item: "Laptop, Monitor, etc", status: "Approved", approvedBy: "Ms. Jewel" },
    { id: 3, name: "Rica Alorro", position: "NOC tier 1", item: "Laptop, Monitor, etc", status: "Approved", approvedBy: "Ms. France" },
    { id: 4, name: "Carlo Divino", position: "NOC tier 1", item: "Laptop, Monitor, etc", status: "Approved", approvedBy: "Ms. France" },
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
                    <p className="cursor-pointer hover:underline">• Add Stocks</p>
                    <p className="cursor-pointer hover:underline">• View Stocks</p>
                  </div>
                )}
                
                {/* Transaction Dropdown Content */}
                {item.hasDropdown && item.dropdownType === 'transaction' && openTransactionDropdown && (
                  <div className="ml-12 mt-2 space-y-2 text-sm text-white">
                    {transactionItems.map((transItem, idx) => (
                      <p 
                        key={idx} 
                        className="cursor-pointer hover:underline"
                        onClick={() => {
                          if (transItem.label === 'View Request') {
                            window.location.href = '/employee';
                          } else if (transItem.label === 'View Approved') {
                            window.location.href = '/dashboard';
                          }
                        }}
                      >
                        • {transItem.label}
                      </p>
                    ))}
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
          <h2 className="text-2xl font-bold text-blue-600">View Approved</h2>
          <h3 className="text-sm font-semibold text-gray-600 mt-2">QUICK ACCESS</h3>

          {/* Quick Access Cards */}
          <div className="grid grid-cols-3 gap-6 mt-4">
            <div className="bg-blue-600 text-white rounded-2xl p-6 flex flex-col justify-between shadow">
              <h4 className="text-lg font-semibold">New Requests</h4>
              <p className="text-3xl font-bold">11</p>
            </div>
            <div className="bg-gray-300 rounded-2xl p-6 flex flex-col justify-between shadow">
              <h4 className="text-lg font-semibold">Current holder</h4>
              <p className="text-3xl font-bold">22</p>
            </div>
            <div className="bg-gray-300 rounded-2xl p-6 flex flex-col justify-between shadow">
              <h4 className="text-lg font-semibold">Verify Return</h4>
              <p className="text-3xl font-bold">6</p>
            </div>
          </div>

          {/* New Request Table */}
          <div className="mt-8 bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">New Approved</h3>
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b">
                  <th className="pb-2">Name</th>
                  <th className="pb-2">Position</th>
                  <th className="pb-2">Item</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Approved by</th>
                  <th className="pb-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id} className="border-b last:border-0">
                    <td className="py-2">{req.name}</td>
                    <td>{req.position}</td>
                    <td>{req.item}</td>
                    <td className="text-green-600">{req.status}</td>
                    <td>{req.approvedBy}</td>
                    <td className="flex items-center space-x-2">
                      <Printer className="h-5 w-5 text-gray-600" />
                      <button className="px-3 py-1 bg-green-500 text-white rounded-full text-xs">
                        Release
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdmin;
