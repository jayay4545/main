import React, { useState } from 'react';
import { Search, Home, History, Users, BarChart3, Laptop, Mouse, Plus, Package } from 'lucide-react';
import Taskbar from '../components/Taskbar.jsx';

const Employee = () => {
  const [activeMenu, setActiveMenu] = useState('Home');
  
  
  const menuItems = [
    { icon: Home, label: 'Home', active: true },
    { icon: History, label: 'Transaction', active: false },
    { icon: Package, label: 'Returned Items', active: false },
  ];

  const itemTypes = [
    {
      id: 1,
      icon: Laptop,
      brand: 'LENOVO',
      quantity: 'x5',
      specs: 'icore 5 16gb RAM, 1T storage, Windows 11'
    },
    {
      id: 2,
      icon: Mouse,
      brand: 'ASUS',
      quantity: 'x5',
      specs: 'icore 5 16gb RAM, 1T storage, Windows 11'
    },
    {
      id: 3,
      icon: Laptop,
      brand: 'ACER',
      quantity: 'x5',
      specs: 'icore 5 16gb RAM, 1T storage, Windows 11'
    },
    {
      id: 4,
      icon: Laptop,
      brand: 'TOSHIBA',
      quantity: 'x5',
      specs: 'icore 5 16gb RAM, 1T storage, Windows 11'
    }
  ];

  const items = [
    {
      id: 1,
      icon: Laptop,
      name: 'Laptop',
      brand: 'Lenovo',
      quantity: 1,
      available: true,
      inUse: false
    },
    {
      id: 2,
      icon: Mouse,
      name: 'Mouse',
      brand: 'Asus w2',
      quantity: 1,
      available: true,
      inUse: false
    }
  ];

  const StatusDot = ({ type }) => {
    const colors = {
      available: 'bg-green-500',
      inUse: 'bg-red-500',
      unavailable: 'bg-gray-400'
    };
    
    return <div className={`w-2 h-2 rounded-full ${colors[type]}`} />;
  };

  // Handle menu item click
  const handleMenuClick = (label) => {
    setActiveMenu(label);
  };

  

  return (
    <div className="min-h-full bg-gray-100 flex">
  {/* Sidebar Wrapper with Logo on Top */}
  <div className="flex flex-col">
    {/* Logo with image file */}
          <div className="flex items-center space-x-3">
            <img 
              src="/images/Frame_89-removebg-preview.png"
              alt="iREPLY Logo" 
              className="h-20 ml-4 w-auto object-contain"
              onError={(e) => {
                console.error('Logo failed to load:', e.target.src);
                // Fallback to text logo
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'block';
              }}
            />
            {/* Fallback text logo (hidden by default) */}
            <div className="hidden items-center space-x-2" id="fallback-logo">
              <div className="relative">
                <div className="w-10 h-8 bg-blue-600 rounded-tl-lg rounded-tr-lg rounded-br-lg">
                  <div className="flex items-center justify-center h-full space-x-0.5">
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="absolute -bottom-1 left-1 w-2 h-2 bg-blue-600 transform rotate-45"></div>
              </div>
              <h1 className="text-xl font-bold">
                <span className="text-gray-900">i</span>
                <span className="text-blue-600">REPLY</span>
              </h1>
            </div>
          </div>

    {/* Sidebar */}
    <aside className="w-60 bg-blue-600 min-h-full relative overflow-hidden rounded-tr-[60px] flex flex-col">
      {/* Menu */}
      <nav className="mt-8 space-y-2">
        {menuItems.map((item, index) => (
          <div key={index}>
            <button
              onClick={() => handleMenuClick(item.label)}
              className={`w-50 flex items-center space-x-5 px-7 py-2 rounded-r-full transition-colors ${
                activeMenu === item.label
                  ? 'bg-white text-blue-600'
                  : 'text-white hover:bg-blue-700'
              }`}
            >
              <item.icon className="h-6 w-6" />
              <span className="font-normal">{item.label}</span>
              
            </button>
            
            
          </div>
        ))}
      </nav>
    </aside>
  </div>

  {/* Main Section */}
  <div className="flex-1 flex flex-col">
    <Taskbar title="Employee" />

        {/* Main Content */}
        <div className="flex-1 p-6 -ml-6 pl-12">
          <div className="grid grid-cols-12 gap-6 h-full">
            {/* Item Table */}
            <div className="col-span-3">
              <div className="bg-white rounded-lg shadow-sm p-6 pl-10  left-5 h-full">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Item table</h2>
                <div className="grid grid-cols-2 gap-3">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Types */}
            <div className="col-span-6">
              <div className="bg-white rounded-lg shadow-sm p-6 h-full">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Types</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600 pb-2">
                    <div className="col-span-3">Brand</div>
                    <div className="col-span-7">Specs</div>
                    <div className="col-span-2"></div>
                  </div>
                  
                  {itemTypes.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 gap-4 items-center py-3 border-b border-gray-100">
                      <div className="col-span-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                            <item.icon className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{item.brand}</div>
                            <div className="text-sm text-gray-500">{item.quantity}</div>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-7">
                        <p className="text-sm text-gray-600">{item.specs}</p>
                      </div>
                      <div className="col-span-2 flex justify-end">
                        <button className="w-8 h-8 bg-blue-100 hover:bg-blue-200 rounded-full flex items-center justify-center transition-colors">
                          <Plus className="h-4 w-4 text-blue-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="col-span-3">
              <div className="bg-white rounded-lg shadow-sm p-6 h-full">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Items</h2>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                          <item.icon className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.brand}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <StatusDot type="available" />
                        <StatusDot type="inUse" />
                        <span className="text-sm text-gray-500">x{item.quantity}</span>
                      </div>
                    </div>
                  ))}
                  
                  {/* Empty placeholders */}
                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <div className="aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300"></div>
                    <div className="aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300"></div>
                  </div>
                </div>
                
                {/* Recent Request section */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">RECENT REQUEST</h3>
                  <div className="mt-4 space-y-3">
                    <div className="aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Employee;