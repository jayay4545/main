import React, { useState, useEffect } from 'react';
import HomeSidebar from './HomeSidebar';
import { Eye, Pencil, Trash2, Search } from 'lucide-react';

const getBadgeColor = (name) => {
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
  const [viewing, setViewing] = React.useState(null);
  const [editing, setEditing] = React.useState(null);
  const [deleting, setDeleting] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState('');
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

  const refreshEmployees = () => {
    fetch('/api/employees')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setEmployees(data.data.map(e => ({
            id: e.id,
            name: `${e.first_name} ${e.last_name}`,
            position: e.position,
            department: e.department || '',
            email: e.email,
            phone: e.phone || '',
            badge: (e.first_name?.[0] || '').toUpperCase(),
            color: getBadgeColor(e.first_name)
          })));
        }
      });
  };

  const saveEmployee = () => {
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
        phone: form.contact,
        position: form.position,
        department: form.client || null,
        status: 'active',
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          closeModal();
          resetAll();
          refreshEmployees();
        } else {
          alert(data.message || 'Failed to save employee');
        }
      })
      .catch(() => alert('Failed to save employee'));
  };

  const openView = (emp) => setViewing(emp);
  const closeView = () => setViewing(null);

  const openEdit = (emp) => {
    setEditing(emp);
    setForm({
      name: emp.name,
      email: emp.email || '',
      contact: emp.phone || '',
      address: '',
      position: emp.position || '',
      client: emp.department || ''
    });
    setIsAddOpen(false);
  };
  const closeEdit = () => { setEditing(null); resetAll(); };

  const updateEmployee = () => {
    if (!editing) return;
    const firstName = form.name.split(' ')[0] || '';
    const lastName = form.name.split(' ').slice(1).join(' ') || '';
    fetch(`/api/employees/${editing.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email: form.email,
        phone: form.contact,
        position: form.position,
        department: form.client || null,
        status: 'active'
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          closeEdit();
          refreshEmployees();
        } else {
          alert(data.message || 'Failed to update employee');
        }
      })
      .catch(() => alert('Failed to update employee'));
  };

  const openDelete = (emp) => setDeleting(emp);
  const closeDelete = () => setDeleting(null);

  const confirmDelete = () => {
    if (!deleting) return;
    fetch(`/api/employees/${deleting.id}`, { method: 'DELETE', headers: { 'Accept': 'application/json' } })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          closeDelete();
          refreshEmployees();
        } else {
          alert(data.message || 'Failed to delete employee');
        }
      })
      .catch(() => alert('Failed to delete employee'));
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen overflow-hidden bg-gray-50 flex">
      <HomeSidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white px-8 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-blue-600">Employees</h1>
            <div className="flex items-center space-x-4">
              <button className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-gray-400 rounded"></div>
              </button>
              <button className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-gray-400 rounded"></div>
              </button>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">John F.</span>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  J
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar and Add Button */}
        <div className="bg-white px-8 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
                />
              </div>
              <button className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg">
                Filter
              </button>
            </div>
            <button 
              onClick={() => setIsAddOpen(true)} 
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add New
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white px-8 py-6 overflow-y-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Employees</h2>
          
          {/* Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600">
                <div className="col-span-4">Name</div>
                <div className="col-span-3">Position</div>
                <div className="col-span-3">Department</div>
                <div className="col-span-2 text-center">Actions</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {filteredEmployees.length === 0 ? (
                <div className="py-8 text-center text-gray-500">No employees found.</div>
              ) : (
                filteredEmployees.map((e) => (
                  <div key={e.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-4 flex items-center space-x-3">
                        <div className={`w-8 h-8 ${e.color} rounded-full text-white text-sm flex items-center justify-center font-medium`}>
                          {e.badge}
                        </div>
                        <span className="text-gray-900 font-medium">{e.name}</span>
                      </div>
                      <div className="col-span-3 text-gray-600">{e.position}</div>
                      <div className="col-span-3 text-gray-600">{e.department}</div>
                      <div className="col-span-2 flex items-center justify-center space-x-3">
                        <button
                          onClick={() => openEdit(e)}
                          className="text-gray-400 hover:text-blue-500 transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openDelete(e)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Modals remain the same as in your original code */}
        {viewing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={closeView} />
            <div className="relative bg-gray-800 rounded-2xl shadow-2xl w-[600px] max-w-[95vw] p-6 border border-gray-700">
              <button onClick={closeView} className="absolute right-4 top-4 text-gray-400 hover:text-blue-400 text-xl">✕</button>
              <h3 className="text-xl font-bold text-blue-400 mb-6">Employee details</h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-700">
                  <span className="text-gray-400 font-medium">Name:</span>
                  <span className="text-white">{viewing.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-700">
                  <span className="text-gray-400 font-medium">Email:</span>
                  <span className="text-white">{viewing.email || '—'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-700">
                  <span className="text-gray-400 font-medium">Contact:</span>
                  <span className="text-white">{viewing.phone || '—'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-700">
                  <span className="text-gray-400 font-medium">Position:</span>
                  <span className="text-white">{viewing.position || '—'}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-400 font-medium">Department:</span>
                  <span className="text-white">{viewing.department || '—'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
            <div className="relative bg-gray-800 rounded-2xl shadow-2xl w-[900px] max-w-[95vw] p-8 border border-gray-700">
              <button onClick={closeModal} className="absolute right-4 top-4 text-gray-400 hover:text-blue-400 text-xl">✕</button>
              <h3 className="text-xl font-bold text-blue-400 text-center mb-6">Add employee</h3>

              <div className="mt-6 grid grid-cols-2 gap-8">
                <div>
                  <label className="text-sm text-gray-300 font-medium">Name*</label>
                  <input value={form.name} onChange={update('name')} className="mt-2 w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter full name" />
                </div>
                <div>
                  <label className="text-sm text-gray-300 font-medium">Email*</label>
                  <input value={form.email} onChange={update('email')} className="mt-2 w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter email address" />
                </div>

                <div>
                  <label className="text-sm text-gray-300 font-medium">Contact no.</label>
                  <input value={form.contact} onChange={update('contact')} className="mt-2 w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter phone number" />
                </div>
                <div>
                  <label className="text-sm text-gray-300 font-medium">Address</label>
                  <input value={form.address} onChange={update('address')} className="mt-2 w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter address" />
                </div>

                <div>
                  <label className="text-sm text-gray-300 font-medium">Position*</label>
                  <input value={form.position} onChange={update('position')} className="mt-2 w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter job position" />
                </div>
                <div>
                  <label className="text-sm text-gray-300 font-medium">Department</label>
                  <input value={form.client} onChange={update('client')} className="mt-2 w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter department" />
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <button onClick={resetAll} className="text-blue-400 hover:text-blue-300 font-medium">Reset all</button>
                <button onClick={saveEmployee} className="px-6 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors">Save →</button>
              </div>
            </div>
          </div>
        )}

        {editing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={closeEdit} />
            <div className="relative bg-gray-800 rounded-2xl shadow-2xl w-[900px] max-w-[95vw] p-8 border border-gray-700">
              <button onClick={closeEdit} className="absolute right-4 top-4 text-gray-400 hover:text-blue-400 text-xl">✕</button>
              <h3 className="text-xl font-bold text-blue-400 text-center mb-6">Edit employee</h3>
              <div className="mt-6 grid grid-cols-2 gap-8">
                <div>
                  <label className="text-sm text-gray-300 font-medium">Name*</label>
                  <input value={form.name} onChange={update('name')} className="mt-2 w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="text-sm text-gray-300 font-medium">Email*</label>
                  <input value={form.email} onChange={update('email')} className="mt-2 w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="text-sm text-gray-300 font-medium">Contact no.</label>
                  <input value={form.contact} onChange={update('contact')} className="mt-2 w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="text-sm text-gray-300 font-medium">Position*</label>
                  <input value={form.position} onChange={update('position')} className="mt-2 w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="text-sm text-gray-300 font-medium">Department</label>
                  <input value={form.client} onChange={update('client')} className="mt-2 w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </div>
              <div className="mt-8 flex items-center justify-between">
                <button onClick={resetAll} className="text-blue-400 hover:text-blue-300 font-medium">Reset</button>
                <button onClick={updateEmployee} className="px-6 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors">Update →</button>
              </div>
            </div>
          </div>
        )}

        {deleting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={closeDelete} />
            <div className="relative bg-gray-800 rounded-2xl shadow-2xl w-[400px] max-w-[95vw] p-6 border border-gray-700">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-900/20 mb-4">
                  <Trash2 className="h-6 w-6 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Delete Employee</h3>
                <p className="text-gray-300 mb-6">
                  Are you sure you want to delete <span className="font-medium text-white">{deleting.name}</span>? 
                  This action cannot be undone.
                </p>
                <div className="flex space-x-3 justify-center">
                  <button 
                    onClick={closeDelete}
                    className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={confirmDelete}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeePage;