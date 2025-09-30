import React from 'react';
import { RefreshCw, Filter, Clock } from 'lucide-react';
import GlobalHeader from './components/GlobalHeader';
import HomeSidebar from './HomeSidebar';

const ActivityLogs = () => {
  const activityLogs = [
    {
      id: 1,
      action: 'Arvin Admin Updated an Item',
      detail: 'Updated accountability form configuration. No detailed field changes logged',
      timestamp: '9/12/25, 10:50:30 AM'
    },
    {
      id: 2,
      action: 'System Administrator Marked Request(s) for Release',
      detail: 'Marked 1 item(s) as for release from request number(s): 893959 (on site)',
      timestamp: '9/12/25, 10:50:30 AM'
    },
    {
      id: 3,
      action: 'Jeffrey Magallanes Added an item',
      detail: 'Laptop',
      timestamp: '9/12/25, 10:50:30 AM'
    },
    {
      id: 4,
      action: 'Arvin Admin Updated an Item',
      detail: 'Updated accountability form configuration. No detailed field changes logged',
      timestamp: '9/12/25, 10:50:30 AM'
    }
  ];

  return (
    <div className="h-screen overflow-hidden bg-white flex">
      <HomeSidebar />
      <div className="flex-1 flex flex-col">
        <GlobalHeader title="Activity Logs" />

        <main className="px-10 py-6 mb-10 flex flex-col overflow-hidden">
          <div className="flex-1 min-h-0 overflow-y-auto">
            <h2 className="text-4xl font-bold text-blue-600">Activity Logs</h2>
            <p className="text-sm text-gray-500 mt-2">Activity logs / Users</p>

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-6">
              <button className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <RefreshCw className="h-4 w-4" />
                <span className="text-sm font-medium">Refresh</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Filter className="h-4 w-4" />
                <span className="text-sm font-medium">Filter</span>
              </button>
            </div>

            {/* Header Line */}
            <div className="border-t border-gray-200 mt-4">
              <div className="flex justify-end pt-2">
                <span className="text-xs text-gray-500">Date and time</span>
              </div>
            </div>

            {/* Activity Log Entries */}
            <div className="mt-4 space-y-3">
              {activityLogs.map((log) => (
                <div key={log.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Clock className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-blue-600">{log.action}</p>
                      <p className="text-xs text-gray-500 mt-1">{log.detail}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="text-xs text-gray-500">{log.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ActivityLogs;
