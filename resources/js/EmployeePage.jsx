import React from 'react';
import HomeSidebar from './HomeSidebar';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import Taskbar from './components/Taskbar.jsx';

import { useEffect, useState } from 'react';

const getBadgeColor = (name) => {
  // Simple color assignment based on first letter
  const colors = {
    J: 'bg-blue-500',
    K: 'bg-pink-500',
    R: 'bg-yellow-500',
    C: 'bg-blue-500',
  };
  const first = name?.[0]?.toUpperCase() || 'B';
  return colors[first] || 'bg-gray-400';
};



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
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetch('/api/employees')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setEmployees(data.data.map(e => ({
            id: e.id,
            name: `${e.first_name} ${e.last_name}`,
            position: e.position,
            department: e.department || '',
            badge: (e.first_name?.[0] || '').toUpperCase(),
            color: getBadgeColor(e.first_name)
          })));
        }
      });
  }, []);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const resetAll = () => setForm({ name: '', email: '', contact: '', address: '', position: '', client: '' });
  const closeModal = () => setIsAddOpen(false);

  const saveEmployee = () => {
    // You may need to adjust the payload keys to match your backend
    fetch('/api/employees', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        first_name: form.name.split(' ')[0] || '',
        last_name: form.name.split(' ').slice(1).join(' ') || '',
        email: form.email,
        contact_number: form.contact,
        address: form.address,
        position: form.position,
        client: form.client,
        status: 'active',
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          closeModal();
          resetAll();
          // Refresh employee list
          fetch('/api/employees')
            .then(res => res.json())
            .then(data => {
              if (data.success && Array.isArray(data.data)) {
                setEmployees(data.data.map(e => ({
                  id: e.id,
                  name: `${e.first_name} ${e.last_name}`,
                  position: e.position,
                  department: e.department || '',
                  badge: (e.first_name?.[0] || '').toUpperCase(),
                  color: getBadgeColor(e.first_name)
                })));
              }
            });
        } else {
          alert(data.message || 'Failed to save employee');
        }
      })
      .catch(() => alert('Failed to save employee'));
  };

  return (
    <div className="h-screen overflow-hidden bg-white flex">
      <HomeSidebar />
      <div className="flex-1 flex flex-col">
        <Taskbar title="Employees" />
        <div className="px-10 pt-4 flex justify-end">
          <button onClick={() => setIsAddOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Add New</button>
        </div>

        {/* Table */}
        <main className="px-10 pb-10 flex-1 min-h-0 overflow-y-auto">
          <div className="grid grid-cols-12 items-center text-gray-600 text-sm border-b border-gray-200 pb-2">
            <div className="col-span-6 pl-2">Name</div>
            <div className="col-span-2">Position</div>
            <div className="col-span-2">Department</div>
            <div className="col-span-2 text-right pr-4">Actions</div>
          </div>

          <div className="divide-y">
            {employees.length === 0 ? (
              <div className="py-6 text-center text-gray-400">No employees found.</div>
            ) : (
              employees.map((e) => (
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
              ))
            )}
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
                <button onClick={saveEmployee} className="px-5 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700">Save →</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeePage;


