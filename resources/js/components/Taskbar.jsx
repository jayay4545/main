import React from "react";
import { Search } from "lucide-react";

const Taskbar = ({ title = "", onSearch }) => {
  return (
    <header className="flex items-center justify-between px-10 py-6 bg-white ">
      <div className="flex-1" style={{ maxWidth: "644px" }}>
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-3 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => onSearch && onSearch(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-5 text-gray-400" />
        </div>
      </div>

      <div className="flex items-center space-x-6">
        {title ? <span className="text-gray-700 font-medium hidden sm:block">{title}</span> : null}
        <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-white">J</div>
      </div>
    </header>
  );
};

export default Taskbar;


