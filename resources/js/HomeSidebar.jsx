import React, { useState } from "react";
import {
  Eye,
  ArrowLeftRight,
  Folder,
  User,
  FileText,
  Users,
  Settings,
  Clock,
} from "lucide-react";

const HomeSidebar = ({ onSelect }) => {
  const [openTransaction, setOpenTransaction] = useState(true);
  const [openEquipment, setOpenEquipment] = useState(true);

  const isActive = (path) => typeof window !== 'undefined' && window.location && window.location.pathname === path;
  const linkClass = (path) =>
    `flex items-center w-full space-x-3 px-4 py-2 rounded-r-full transition-colors ${
      isActive(path) ? 'bg-white text-blue-600' : 'hover:bg-white hover:text-blue-600'
    }`;

  return (
    <div className="flex flex-col">
      {/* Logo */}
      <div className="flex items-center space-x-3 p-6">
        <img
          src="/images/Frame_89-removebg-preview.png"
          alt="iREPLY Logo"
          className="h-12 w-auto"
        />
      </div>

      {/* Sidebar */}
      <aside className="w-57 bg-[#2262C6] text-white flex flex-col h-screen overflow-hidden rounded-tr-[72px]">
         {/* Navigation */}
        <nav className="flex-1 min-h-0 px-4 py-6 mt-5 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-blue-200">
        {/* Home */}
        <a
          href="/dashboard"
          className={linkClass('/dashboard')}
        >
          <Eye className="h-5 w-5" />
          <span>Home</span>
        </a>

        {/* Transaction */}
        <button
          className="flex items-center w-full space-x-3 px-4 py-2 rounded-r-full transition-colors hover:bg-white hover:text-blue-600"
          onClick={() => setOpenTransaction(!openTransaction)}
        >
          <ArrowLeftRight className="h-5 w-5" />
          <span>Transaction</span>
          <span className="ml-auto text-xs">{openTransaction ? "▾" : "▸"}</span>
        </button>
        {openTransaction && (
          <ul className="ml-10 mt-1 space-y-1">
            <li>
              <a
                href="/viewrequest"
                className={`block p-2 rounded-md ${isActive('/viewrequest') ? 'bg-white text-blue-600' : 'text-white/90 hover:bg-white hover:text-blue-600'}`}
              >
                View Request
              </a>
            </li>
            <li>
              <a
                href="/viewapproved"
                className={`block p-2 rounded-md ${isActive('/viewapproved') ? 'bg-white text-blue-600' : 'text-white/90 hover:bg-white hover:text-blue-600'}`}
              >
                View Approved
              </a>
            </li>
          </ul>
        )}

        {/* Equipment */}
        <button
          className="flex items-center w-full space-x-3 px-4 py-2 rounded-r-full transition-colors hover:bg-white hover:text-blue-600"
          onClick={() => setOpenEquipment(!openEquipment)}
        >
          <Folder className="h-5 w-5" />
          <span>Equipment</span>
          <span className="ml-auto text-xs">{openEquipment ? "▾" : "▸"}</span>
        </button>
        {openEquipment && (
          <ul className="ml-10 mt-1 space-y-1">
            <li>
              <a
                href="/equipment"
                className={`block p-2 rounded-md ${isActive('/equipment') ? 'bg-white text-blue-600' : 'text-white/90 hover:bg-white hover:text-blue-600'}`}
              >
                Inventory
              </a>
            </li>
            <li>
              <a
                href="/addstocks"
                className={`block p-2 rounded-md ${isActive('/addstocks') ? 'bg-white text-blue-600' : 'text-white/90 hover:bg-white hover:text-blue-600'}`}
              >
                Add Stocks
              </a>
            </li>
          </ul>
        )}

        {/* Other Menus */}
        <a
          href="/employee"
          className={linkClass('/employee')}
        >
          <User className="h-5 w-5" />
          <span>Employee</span>
        </a>

        <button className="flex items-center w-full space-x-3 px-4 py-2 rounded-r-full transition-colors hover:bg-white hover:text-blue-600">
          <FileText className="h-5 w-5" />
          <span>Reports</span>
        </button>

        <a
          href="/role-management"
          className={linkClass('/role-management')}
        >
          <Users className="h-5 w-5" />
          <span>Role Management</span>
        </a>

        <a
          href="/control-panel"
          className={linkClass('/control-panel')}
        >
          <Settings className="h-5 w-5" />
          <span>Control Panel</span>
        </a>

        <button className="flex items-center w-full space-x-3 px-4 py-2 rounded-r-full transition-colors hover:bg-white hover:text-blue-600">
          <Clock className="h-5 w-5" />
          <span>Activity Logs</span>
        </button>

        <a
          href="/users"
          className={linkClass('/users')}
        >
          <User className="h-5 w-5" />
          <span>Users</span>
        </a>
      </nav>
    </aside>
    </div>
  );
};

export default HomeSidebar;
