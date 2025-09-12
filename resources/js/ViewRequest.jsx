import React, { useState } from 'react';
import { Search, Printer, Check, X, ChevronDown, Eye, Pencil } from 'lucide-react';
import HomeSidebar from './HomeSidebar';

const ViewRequest = () => {
  const requests = [
    { id: 1, name: 'John Paul Francisco', position: 'NOC tier 1', item: 'Laptop, Monitor, etc' },
    { id: 2, name: 'Kyle Dela Cruz', position: 'NOC tier 1', item: 'Laptop, Monitor, etc' },
    { id: 3, name: 'Rica Alorro', position: 'NOC tier 1', item: 'Laptop, Monitor, etc' },
    { id: 4, name: 'Carlo Divino', position: 'NOC tier 1', item: 'Laptop, Monitor, etc' },
  ];

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [view, setView] = useState('viewRequest');

  const handleSelect = (next) => {
    setView(next);
    setIsMenuOpen(false);
  };

  return (
    <div className="h-screen overflow-hidden bg-white flex">
      <HomeSidebar />
      <div className="flex-1 flex flex-col">
      <header className="flex items-center justify-between px-10 py-6 bg-white">
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
               placeholder="Search"
            className="w-full pl-10 pr-4 py-3 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <span className="text-gray-700 font-medium">John F.</span>
          <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-white">J</div>
        </div>
      </header>

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
                {view === 'viewRequest' ? 'View Request' : view === 'currentHolder' ? 'Current holder' : 'Verify return'}
              </span>
              <ChevronDown className="h-4 w-4" />
            </button>
            {isMenuOpen && (
              <div className="absolute z-10 mt-2 w-44 bg-white rounded-md shadow border border-gray-200">
                <button onClick={() => handleSelect('currentHolder')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">Current holder</button>
                <button onClick={() => handleSelect('verifyReturn')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">Verify return</button>
                <button onClick={() => handleSelect('viewRequest')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">View Request</button>
              </div>
            )}
          </div>
        </div>

        {view === 'viewRequest' && (
          <>
            <h3 className="mt-10 text-3xl font-semibold text-gray-700">View Request</h3>
            <div className="mt-4 bg-white rounded-xl shadow p-6">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b text-gray-600">
                    <th className="pb-2">Name</th>
                    <th className="pb-2">Item</th>
                    <th className="pb-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req.id} className="border-b last:border-0">
                      <td className="py-4">
                        <div className="font-medium text-gray-900">{req.name}</div>
                        <div className="text-gray-500 text-xs">{req.position}</div>
                      </td>
                      <td className="py-4 text-gray-700">{req.item}</td>
                      <td className="py-4">
                        <div className="flex items-center justify-end space-x-3">
                          <button className="h-8 w-8 flex items-center justify-center rounded-md bg-green-500/10 text-green-600 hover:bg-green-500/20">
                            <Check className="h-4 w-4" />
                          </button>
                          <button className="h-8 w-8 flex items-center justify-center rounded-md bg-red-500/10 text-red-600 hover:bg-red-500/20">
                            <X className="h-4 w-4" />
                          </button>
                          <Printer className="h-5 w-5 text-gray-500" />
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
                  {requests.map((req) => (
                    <tr key={req.id} className="border-b last:border-0">
                      <td className="py-4">{req.name}</td>
                      <td className="py-4">{req.position}</td>
                      <td className="py-4">{req.item}</td>
                      <td className="py-4">{req.id % 2 ? 'W.F.H' : 'Onsite'}</td>
                      <td className="py-4 text-red-600">10/08/25</td>
                      <td className="py-4">
                        <div className="flex items-center justify-end space-x-4 text-gray-700">
                          <Eye className="h-5 w-5" />
                          <Pencil className="h-5 w-5" />
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
                  {requests.map((req) => (
                    <tr key={req.id} className="border-b last:border-0">
                      <td className="py-4">{req.name}</td>
                      <td className="py-4">{req.position}</td>
                      <td className="py-4">{req.item}</td>
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

export default ViewRequest;


