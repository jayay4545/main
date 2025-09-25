import React from "react";
import { Search } from "lucide-react";
import BubbleProfile from "./BubbleProfile";

const Taskbar = ({ title = "", onSearch, hideSearch = false, user, onEditProfile, onLogout }) => {
  const handleEditProfile = () => {
    if (onEditProfile) {
      onEditProfile();
    } else {
      console.log('Edit profile clicked');
      // You can add navigation to edit profile page here
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      console.log('Logout clicked');
      // You can add logout logic here
    }
  };

  return (
    <header className="flex items-center justify-between px-10 py-6 bg-white ">
      {!hideSearch && (
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
      )}

      <div className="flex items-center space-x-6">
        {title ? <span className="text-gray-700 font-medium hidden sm:block">{title}</span> : null}
        <BubbleProfile 
          name={user?.name || "User"}
          image={user?.image}
          size={36}
          user={user}
          onEditProfile={handleEditProfile}
          onLogout={handleLogout}
        />
      </div>
    </header>
  );
};

export default Taskbar;


