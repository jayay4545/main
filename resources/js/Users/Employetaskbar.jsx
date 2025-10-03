import React, { useState } from "react";
import { Search, Bell, User, Settings, LogOut } from "lucide-react";

const EmployeeTaskbar = ({ 
  onSearch, 
  employeeName = "Employee",
  userRole = "employee",
  notifications = 0,
  onProfileClick,
  onSettingsClick,
  onLogoutClick 
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // Get user initials for avatar
  const getInitials = (name) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleMenuItemClick = (action) => {
    setShowProfileMenu(false);
    if (action === 'profile' && onProfileClick) {
      onProfileClick();
    } else if (action === 'settings' && onSettingsClick) {
      onSettingsClick();
    } else if (action === 'logout' && onLogoutClick) {
      onLogoutClick();
    }
  };

  return (
    <header className="flex items-center justify-between px-10 py-6 bg-white shadow-sm border-b border-gray-200">
      {/* Search Section */}
      <div className="flex-1" style={{ maxWidth: "644px" }}>
        <div className="relative">
          <input
            type="text"
            placeholder="Search equipment, requests, or transactions..."
            className="w-full pl-10 pr-4 py-3 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
            onChange={(e) => onSearch && onSearch(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative">
          <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notifications > 9 ? '9+' : notifications}
              </span>
            )}
          </button>
        </div>

        {/* Profile Menu */}
        <div className="relative">
          <button
            onClick={handleProfileClick}
            className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {employeeName.charAt(0).toUpperCase()}
            </div>
            <span className="hidden md:block text-sm font-medium text-gray-700">
              {employeeName}
            </span>
          </button>

          {/* Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
              {/* User Info Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white text-lg font-bold">
                    {getInitials(employeeName)}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{employeeName}</div>
                    <div className="text-sm text-gray-500">{userRole}</div>
                  </div>
                </div>
              </div>
              
              {/* Menu Items */}
              <div className="py-2">
                <button
                  onClick={() => handleMenuItemClick('profile')}
                  className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User className="h-5 w-5 mr-3 text-gray-500" />
                  <span>Edit Profile</span>
                </button>
                
                <button
                  onClick={() => handleMenuItemClick('settings')}
                  className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Settings className="h-5 w-5 mr-3 text-gray-500" />
                  <span>Settings</span>
                </button>
              </div>
              
              {/* Logout Button */}
              <div className="border-t border-gray-100 p-2">
                <button
                  onClick={() => handleMenuItemClick('logout')}
                  className="flex items-center justify-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <LogOut className="h-5 w-5 mr-2 text-gray-500" />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close menu */}
      {showProfileMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowProfileMenu(false)}
        />
      )}
    </header>
  );
};

export default EmployeeTaskbar;
