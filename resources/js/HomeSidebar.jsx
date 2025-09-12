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

const HomeSidebar = () => {
  const [openTransaction, setOpenTransaction] = useState(true);
  const [openEquipment, setOpenEquipment] = useState(true);

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
        <nav className="flex-1 min-h-0 px-4 py-6 mt-10 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-blue-200">
        {/* Home */}
        <a
          href="/dashboard"
          className="flex items-center w-full space-x-3 px-4 py-2 rounded-r-full transition-colors hover:bg-white hover:text-blue-600"
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
                className="block p-2 text-white/90 hover:bg-blue-700 rounded-md"
              >
                View Request
              </a>
            </li>
            <li>
              <a
                href="/viewapproved"
                className="block p-2 text-white/90 hover:bg-blue-700 rounded-md"
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
                className="block p-2 text-white/90 hover:bg-blue-700 rounded-md"
              >
                Inventory
              </a>
            </li>
            <li>
              <a
                href="/addstocks"
                className="block p-2 text-white/90 hover:bg-blue-700 rounded-md"
              >
                Add Stocks
              </a>
            </li>
          </ul>
        )}

        {/* Other Menus */}
        <a
          href="/employee"
          className="flex items-center w-full space-x-3 px-4 py-2 rounded-r-full transition-colors hover:bg-white hover:text-blue-600"
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
          className="flex items-center w-full space-x-3 px-4 py-2 rounded-r-full transition-colors hover:bg-white hover:text-blue-600"
        >
          <Users className="h-5 w-5" />
          <span>Role Management</span>
        </a>

        <button className="flex items-center w-full space-x-3 px-4 py-2 rounded-r-full transition-colors hover:bg-white hover:text-blue-600">
          <Settings className="h-5 w-5" />
          <span>Control Panel</span>
        </button>

        <button className="flex items-center w-full space-x-3 px-4 py-2 rounded-r-full transition-colors hover:bg-white hover:text-blue-600">
          <Clock className="h-5 w-5" />
          <span>Activity Logs</span>
        </button>

        <a
          href="/users"
          className="flex items-center w-full space-x-3 px-4 py-2 rounded-r-full transition-colors hover:bg-white hover:text-blue-600"
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
