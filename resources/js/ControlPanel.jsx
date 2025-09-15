import React from "react";
import { UserCog } from "lucide-react";
import HomeSidebar from "./HomeSidebar";
import Taskbar from "./components/Taskbar.jsx";

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
        <Taskbar title="John F." />

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
