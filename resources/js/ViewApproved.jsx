import React, { useState } from 'react';
import { Search, Printer, ChevronDown } from 'lucide-react';
import Taskbar from './components/Taskbar.jsx';
import HomeSidebar from './HomeSidebar';

const ViewApproved = () => {
  const approved = [
    { id: 1, name: 'John Paul Francisco', position: 'NOC tier 1', item: 'Laptop, Monitor, etc', status: 'Approved', approvedBy: 'Ms. France' },
    { id: 2, name: 'Kyle Dela Cruz', position: 'NOC tier 1', item: 'Laptop, Monitor, etc', status: 'Approved', approvedBy: 'Ms. Jewel' },
    { id: 3, name: 'Rica Alorro', position: 'NOC tier 1', item: 'Laptop, Monitor, etc', status: 'Approved', approvedBy: 'Ms. France' },
    { id: 4, name: 'Carlo Divino', position: 'NOC tier 1', item: 'Laptop, Monitor, etc', status: 'Approved', approvedBy: 'Ms. France' },
  ];

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [view, setView] = useState('viewApproved');

  const handleSelect = (next) => {
    setView(next);
    setIsMenuOpen(false);
  };

  return (
    <div className="h-screen overflow-hidden bg-white flex">
      <HomeSidebar />
      <div className="flex-1 flex flex-col">
      <Taskbar title="Transaction" />

      <main className="px-10 py-6 mb-10 flex flex-col overflow-hidden">
        <div className="flex-1 min-h-0 overflow-y-auto">
        <h2 className="text-4xl font-bold text-blue-600">Transaction</h2>
        <h3 className="text-base font-semibold text-gray-700 mt-3 tracking-wide">QUICK ACCESS</h3>

        <div className="grid grid-cols-3 gap-6 mt-4">
          <div className="bg-blue-600 text-white rounded-2xl p-6 shadow flex flex-col">
            <h4 className="text-sm uppercase tracking-wider opacity-80">New Requests</h4>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-5xl font-bold">11</p>
              <div className="w-10 h-10 rounded-full bg-white/30"></div>
            </div>
          </div>
          <div className="bg-gray-100 rounded-2xl p-6 shadow flex flex-col">
            <h4 className="text-sm font-semibold text-gray-600">Current holder</h4>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-4xl font-bold text-gray-900">22</p>
              <div className="w-10 h-10 rounded-full bg-gray-300"></div>
            </div>
          </div>
          <div className="bg-gray-100 rounded-2xl p-6 shadow flex flex-col">
            <h4 className="text-sm font-semibold text-gray-600">Verify Return</h4>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-4xl font-bold text-gray-900">6</p>
              <div className="w-10 h-10 rounded-full bg-gray-300"></div>
            </div>
          </div>
        </div>

        {/* Mode dropdown (grey shape) */}
        <div className="mt-6 flex justify-center">
          <div className="relative">
            <button
              type="button"
              className="w-44 h-10 bg-gray-300 rounded-md flex items-center justify-between px-4 text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="text-sm font-medium">
                {view === 'viewApproved' ? 'View Approved' : view === 'currentHolder' ? 'Current holder' : 'Verify return'}
              </span>
              <ChevronDown className="h-4 w-4" />
            </button>
            {isMenuOpen && (
              <div className="absolute z-10 mt-2 w-44 bg-white rounded-md shadow border border-gray-200">
                <button onClick={() => handleSelect('currentHolder')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">Current holder</button>
                <button onClick={() => handleSelect('verifyReturn')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">Verify return</button>
                <button onClick={() => handleSelect('viewApproved')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">View Approved</button>
              </div>
            )}
          </div>
        </div>

        {view === 'viewApproved' && (
          <>
            <h3 className="mt-10 text-3xl font-semibold text-gray-700">View Approved</h3>
            <div className="mt-4 bg-white rounded-xl shadow p-6">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b text-gray-600">
                    <th className="pb-2">Name</th>
                    <th className="pb-2">Position</th>
                    <th className="pb-2">Item</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Approved by</th>
                    <th className="pb-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {approved.map((row) => (
                    <tr key={row.id} className="border-b last:border-0">
                      <td className="py-4">{row.name}</td>
                      <td className="py-4">{row.position}</td>
                      <td className="py-4">{row.item}</td>
                      <td className="py-4 text-green-600">{row.status}</td>
                      <td className="py-4">{row.approvedBy}</td>
                      <td className="py-4">
                        <div className="flex items-center justify-end space-x-3">
                          <Printer className="h-5 w-5 text-gray-500" />
                          <button className="px-3 py-1 bg-green-600 text-white rounded-full text-xs">Release</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {view === 'currentHolder' && (
          <>
            <h3 className="mt-10 text-3xl font-semibold text-gray-700">Current holder</h3>
            <div className="mt-4 bg-white rounded-xl shadow p-6">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b text-gray-600">
                    <th className="pb-2">Name</th>
                    <th className="pb-2">Position</th>
                    <th className="pb-2">Item</th>
                    <th className="pb-2">Request mode</th>
                    <th className="pb-2">End Date</th>
                    <th className="pb-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {approved.map((row) => (
                    <tr key={row.id} className="border-b last:border-0">
                      <td className="py-4">{row.name}</td>
                      <td className="py-4">{row.position}</td>
                      <td className="py-4">{row.item}</td>
                      <td className="py-4">{row.id % 2 ? 'W.F.H' : 'Onsite'}</td>
                      <td className="py-4 text-red-600">10/08/25</td>
                      <td className="py-4">
                        <div className="flex items-center justify-end space-x-4 text-gray-700">
                          <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">Partial</span>
                          <span className="px-3 py-1 rounded-full text-xs bg-green-600 text-white">Returned</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {view === 'verifyReturn' && (
          <>
            <h3 className="mt-10 text-3xl font-semibold text-gray-700">Verify return</h3>
            <div className="mt-4 bg-white rounded-xl shadow p-6">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b text-gray-600">
                    <th className="pb-2">Name</th>
                    <th className="pb-2">Position</th>
                    <th className="pb-2">Item</th>
                    <th className="pb-2">End Date</th>
                    <th className="pb-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {approved.map((row) => (
                    <tr key={row.id} className="border-b last:border-0">
                      <td className="py-4">{row.name}</td>
                      <td className="py-4">{row.position}</td>
                      <td className="py-4">{row.item}</td>
                      <td className="py-4 text-red-600">10/08/25</td>
                      <td className="py-4">
                        <div className="flex items-center justify-end space-x-3">
                          <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">Partial</span>
                          <span className="px-3 py-1 rounded-full text-xs bg-green-600 text-white">Returned</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        </div>
      </main>
      </div>
    </div>
  );
};

export default ViewApproved;


