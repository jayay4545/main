import React, { useState } from 'react';
import { Home, FileText, Folder, User, Clock, ChevronDown, ChevronUp } from 'lucide-react';

const Sidebar = ({ activeMenu, setActiveMenu }) => {
  const [openTransactionDropdown, setOpenTransactionDropdown] = useState(false);
  const [openEquipmentDropdown, setOpenEquipmentDropdown] = useState(false);

  const menuItems = [
    {
      icon: Home,
      label: 'Home',
      path: '/home',
      hasDropdown: false
    },
    {
      icon: FileText,
      label: 'Transaction',
      hasDropdown: true,
      dropdownItems: [
        { label: 'View Request', path: '/viewrequest' },
        { label: 'View Approved', path: '/viewapproved' }
      ]
    },
    {
      icon: Folder,
      label: 'Equipment',
      hasDropdown: true,
      dropdownItems: [
        { label: 'Inventory', path: '/equipment' },
        { label: 'Add Stocks', path: '/addstocks' }
      ]
    },
    {
      icon: User,
      label: 'Employee',
      path: '/employee',
      hasDropdown: false
    },
    {
      icon: Clock,
      label: 'Reports',
      path: '/reports',
      hasDropdown: false
    },
    {
      icon: User,
      label: 'Role Management',
      path: '/role-management',
      hasDropdown: false
    },
    {
      icon: User,
      label: 'Control Panel',
      path: '/control-panel',
      hasDropdown: false
    },
    {
      icon: Clock,
      label: 'Activity Logs',
      path: '/activitylogs',
      hasDropdown: false
    },
    {
      icon: User,
      label: 'Users',
      path: '/users',
      hasDropdown: false
    }
  ];

  const handleMenuClick = (item) => {
    setActiveMenu(item.label);
    
    if (item.hasDropdown) {
      if (item.label === 'Transaction') {
        setOpenTransactionDropdown(!openTransactionDropdown);
        setOpenEquipmentDropdown(false);
      } else if (item.label === 'Equipment') {
        setOpenEquipmentDropdown(!openEquipmentDropdown);
        setOpenTransactionDropdown(false);
      }
    } else if (item.path) {
      window.location.href = item.path;
    }
  };

  return (
    <div className="flex flex-col">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <img
          src="/images/Frame_89-removebg-preview.png"
          alt="iREPLY Logo"
          className="h-20 ml-4 w-auto object-contain"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/Frame 35.jpg';
          }}
        />
      </div>

      {/* Sidebar */}
      <aside className="w-60 bg-blue-600 min-h-full relative overflow-hidden rounded-tr-[60px] flex flex-col">
        <nav className="mt-8 space-y-2">
          {menuItems.map((item, index) => (
            <div key={index}>
              <button
                onClick={() => handleMenuClick(item)}
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
                {item.hasDropdown && (
                  (item.label === 'Equipment' && openEquipmentDropdown) || 
                  (item.label === 'Transaction' && openTransactionDropdown) ? 
                    <ChevronUp className="h-4 w-4" /> : 
                    <ChevronDown className="h-4 w-4" />
                )}
              </button>

              {/* Dropdown Content */}
              {item.hasDropdown && (
                (item.label === 'Equipment' && openEquipmentDropdown) || 
                (item.label === 'Transaction' && openTransactionDropdown)
              ) && (
                <div className="ml-12 mt-2 space-y-2 text-sm text-white">
                  {item.dropdownItems.map((dropdownItem, dropIndex) => (
                    <p 
                      key={dropIndex}
                      className="cursor-pointer hover:underline"
                      onClick={() => {
                        window.location.href = dropdownItem.path;
                        setActiveMenu(item.label);
                      }}
                    >
                      • {dropdownItem.label}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;