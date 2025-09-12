import React from 'react';
import HomeSidebar from './HomeSidebar';
import { Search, Eye, Pencil, Trash2 } from 'lucide-react';

const employees = [
  { id: 1, name: 'John Paul Francisco', position: 'NOC tier 1', department: 'VOIP', badge: 'J', color: 'bg-blue-500' },
  { id: 2, name: 'Kyle Dela cruz', position: 'NOC tier 1', department: 'SIPPIO', badge: 'K', color: 'bg-pink-500' },
  { id: 3, name: 'Rica Alorro', position: 'NOC tier 1', department: 'SIPPIO', badge: 'R', color: 'bg-yellow-500' },
  { id: 4, name: 'Carlo Divino', position: 'NOC tier 1', department: 'VOIP', badge: 'C', color: 'bg-blue-500' },
];

const EmployeePage = () => {
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    name: '',
    email: '',
    contact: '',
    address: '',
    position: '',
    client: ''
  });

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const resetAll = () => setForm({ name: '', email: '', contact: '', address: '', position: '', client: '' });
  const closeModal = () => setIsAddOpen(false);

  return (
    <div className="h-screen overflow-hidden bg-white flex">
      <HomeSidebar />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-10 py-6 bg-white">
          <h1 className="text-2xl font-bold text-blue-600">Employees</h1>
          <div className="flex items-center space-x-6">
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-96">
              <Search className="h-5 w-5 text-gray-400" />
              <input className="flex-1 bg-transparent pl-2 outline-none" placeholder="Search" />
              <div className="w-24 h-8 bg-gray-300 rounded-md" />
            </div>
            <button onClick={() => setIsAddOpen(true)} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-600 hover:text-white">Add New</button>
          </div>
        </header>

        {/* Table */}
        <main className="px-10 pb-10 flex-1 min-h-0 overflow-y-auto">
          <div className="grid grid-cols-12 items-center text-gray-600 text-sm border-b border-gray-200 pb-2">
            <div className="col-span-6 pl-2">Name</div>
            <div className="col-span-2">Position</div>
            <div className="col-span-2">Department</div>
            <div className="col-span-2 text-right pr-4">Actions</div>
          </div>

          <div className="divide-y">
            {employees.map((e) => (
              <div key={e.id} className="grid grid-cols-12 items-center py-3">
                <div className="col-span-6 flex items-center space-x-3">
                  <div className={`w-6 h-6 ${e.color} rounded-full text-white text-xs flex items-center justify-center`}>{e.badge}</div>
                  <div className="text-gray-800">{e.name}</div>
                </div>
                <div className="col-span-2 text-gray-700">{e.position}</div>
                <div className="col-span-2 text-gray-700">{e.department}</div>
                <div className="col-span-2 flex justify-end space-x-4 text-gray-500 pr-2">
                  <Eye className="h-4 w-4 cursor-pointer" />
                  <Pencil className="h-4 w-4 cursor-pointer" />
                  <Trash2 className="h-4 w-4 cursor-pointer" />
                </div>
              </div>
            ))}
          </div>
        </main>
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/30" onClick={closeModal} />
            <div className="relative bg-white rounded-2xl shadow-xl w-[900px] max-w-[95vw] p-8">
              <button onClick={closeModal} className="absolute right-4 top-4 text-gray-500 hover:text-blue-600">✕</button>
              <h3 className="text-xl font-bold text-blue-600 text-center">Add employee</h3>

              <div className="mt-6 grid grid-cols-2 gap-8">
                <div>
                  <label className="text-sm text-gray-600">Name*</label>
                  <input value={form.name} onChange={update('name')} className="mt-2 w-full px-3 py-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Laptop" />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Email*</label>
                  <input value={form.email} onChange={update('email')} className="mt-2 w-full px-3 py-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="4354354" />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Contact no.</label>
                  <input value={form.contact} onChange={update('contact')} className="mt-2 w-full px-3 py-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Lenovo" />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Address*</label>
                  <input value={form.address} onChange={update('address')} className="mt-2 w-full px-3 py-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Brgy, City, etc" />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Position*</label>
                  <input value={form.position} onChange={update('position')} className="mt-2 w-full px-3 py-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Item details" />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Client</label>
                  <input value={form.client} onChange={update('client')} className="mt-2 w-full px-3 py-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="₱ 0.00" />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button onClick={resetAll} className="text-blue-600 hover:underline">Reset all</button>
                <button className="px-5 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700">Save →</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeePage;


