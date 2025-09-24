import React, { useState, useEffect } from 'react';
import HomeSidebar from './HomeSidebar';
import { Eye, Pencil, Trash2, Search } from 'lucide-react';
import Taskbar from './components/Taskbar.jsx';

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
  const [searchQuery, setSearchQuery] = useState('');

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

         <main className="px-10 py-6 mb-10 flex flex-col overflow-hidden">
          <h2 className="text-4xl font-bold text-blue-600">Employees</h2>

        {/* Toolbar: Search + Add New */}
        <div className="mt-4 mb-6 flex items-center gap-6">
          {/* Search area in light container with gray block */}
          <div className="flex items-center bg-gray-100 rounded-2xl px-4 py-3 w-full max-w-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center bg-white rounded-xl pl-3 pr-2 py-2 w-full max-w-xl border border-gray-200">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="bg-transparent outline-none px-3 text-sm w-full"
              />
            </div>
            <div className="ml-4 w-28 h-10 bg-gray-300 rounded-md" />
          </div>

          {/* Add New inside subtle card, outlined button */}
          <div className="bg-gray-100 rounded-2xl px-4 py-3 border border-gray-200 shadow-sm">
            <button onClick={() => setIsAddOpen(true)} className="px-5 py-2 rounded-xl border border-blue-400 text-blue-600 bg-white hover:bg-blue-50">Add New</button>
          </div>
        </div>

        {/* Section subtitle above table */}
        <h3 className="text-xl font-semibold text-gray-700 mb-3">Employees</h3>

      {/* Table */}
<main className="px-10 pb-10 flex-1 min-h-0 overflow-y-auto">
  <div className="overflow-x-auto rounded-lg">
    <table className="min-w-full text-sm text-left text-gray-700">
      <thead className="text-gray-600 text-sm font-semibold">
        <tr>
          <th className="px-4 py-3">Name</th>
          <th className="px-4 py-3">Position</th>
          <th className="px-4 py-3">Department</th>
          <th className="px-4 py-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="border-t border-gray-300">
        {employees.length === 0 ? (
          <tr>
            <td colSpan="4" className="px-4 py-6 text-center text-gray-400">
              No employees found.
            </td>
          </tr>
        ) : (
          employees
            .filter((e) => {
              const q = searchQuery.trim().toLowerCase();
              if (!q) return true;
              return (
                e.name?.toLowerCase().includes(q) ||
                e.position?.toLowerCase().includes(q) ||
                e.department?.toLowerCase().includes(q)
              );
            })
            .map((e) => (
            <tr key={e.id} className="hover:bg-blue-50">
              <td className="px-4 py-3 flex items-center space-x-3">
                <div className={`w-8 h-8 ${e.color} rounded-full text-white text-sm flex items-center justify-center`}>
                  {e.badge}
                </div>
                <span className="text-gray-800">{e.name}</span>
              </td>
              <td className="px-4 py-3 text-gray-700">{e.position}</td>
              <td className="px-4 py-3 text-gray-700">{e.department}</td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end space-x-4 text-gray-500">
                  <Eye className="h-4 w-4 cursor-pointer hover:text-blue-600" />
                  <Pencil className="h-4 w-4 cursor-pointer hover:text-yellow-600" />
                  <Trash2 className="h-4 w-4 cursor-pointer hover:text-red-600" />
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
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
        </main>
      </div>
    </div>
  );
};

export default EmployeePage;


