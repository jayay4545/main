import React from "react";
import { Search, UserCog } from "lucide-react";
import HomeSidebar from "./HomeSidebar";

const ControlPanel = () => {
  // Page-level data only (cards)

  const controlPanelCards = [
    { id: 1, title: 'Admin Position', subtitle: 'Manage', icon: UserCog },
    { id: 2, title: 'Add Categories', subtitle: 'Manage', icon: UserCog },
    { id: 3, title: 'Item Condition', subtitle: 'Manage', icon: UserCog },
    { id: 4, title: 'Admin Position', subtitle: 'Manage', icon: UserCog },
    { id: 5, title: 'Admin Position', subtitle: 'Manage', icon: UserCog },
  ];

  return (
    <div className="h-screen overflow-hidden bg-white flex">
      <HomeSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-10 py-6 bg-white border-b border-gray-100">
          {/* Search */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-10 pr-4 py-3 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          {/* Profile Section */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
            </div>
            <span className="text-gray-700 font-medium">John F.</span>
            <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
              J
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="px-10 py-6 flex-1 overflow-y-auto">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#2262C6] mb-2">Control Panel</h1>
            <p className="text-gray-500 text-lg">Control Panel</p>
          </div>

          {/* Control Panel Cards */}
          <div className="grid grid-cols-3 gap-6 max-w-4xl">
            {controlPanelCards.map((card, index) => (
              <div
                key={card.id}
               className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              style={{ boxShadow: '0 2px 8px rgba(29, 78, 216, 0.4)', 
            }}
              >
                <div className="flex items-center space-x-4">
                  {/* Icon on the left */}
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <card.icon className="h-6 w-6 text-white" />
                  </div>
                  
                  {/* Text content on the right */}
                  <div className="flex flex-col">
                    <h3 className="text-lg font-semibold text-blue-600 mb-1">
                      {card.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {card.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ControlPanel;
