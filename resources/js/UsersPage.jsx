import React, { useEffect, useState } from "react";
import { Search, Eye, Edit, Trash2, Plus, Bell, Settings, ArrowRight, X } from "lucide-react";
import HomeSidebar from "./HomeSidebar";

const UsersPage = () => {
  console.log('UsersPage component is rendering');
  
  const [admins, setAdmins] = useState([
    {
      id: 1,
      name: "France Magdalaro",
      username: "France30",
      email: "Superadmin@hris.com",
      accountType: "IT admin"
    },
    {
      id: 2,
      name: "France Magdalaro",
      username: "France30",
      email: "Superadmin@hris.com",
      accountType: "IT admin"
    },
    {
      id: 3,
      name: "France Magdalaro",
      username: "France30",
      email: "Superadmin@hris.com",
      accountType: "IT admin"
    },
    {
      id: 4,
      name: "France Magdalaro",
      username: "France30",
      email: "Superadmin@hris.com",
      accountType: "IT admin"
    }
  ]);

  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [employeesError, setEmployeesError] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({ 
    name: "", 
    username: "", 
    email: "", 
    password: "",
    confirmPassword: "",
    accountType: "Employee" 
  });

  // Load employees from API
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoadingEmployees(true);
        setEmployeesError("");
        const res = await fetch('/api/employees');
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const mapped = json.data.map(e => ({
            id: e.id,
            name: `${e.first_name} ${e.last_name}`.trim(),
            username: e.employee_id || (e.email ? e.email.split('@')[0] : ''),
            email: e.email,
            accountType: 'Employee',
            // Keep raw fields for update
            firstName: e.first_name,
            lastName: e.last_name,
            position: e.position,
            department: e.department,
            phone: e.phone,
            status: e.status,
            hireDate: e.hire_date
          }));
          setEmployees(mapped);
        } else {
          setEmployeesError(json.message || 'Failed to load employees');
        }
      } catch (err) {
        setEmployeesError(err?.message || 'Failed to load employees');
      } finally {
        setLoadingEmployees(false);
      }
    };
    fetchEmployees();
  }, []);

  const handleAddUser = () => {
    if (newUser.name && newUser.username && newUser.email && newUser.password && newUser.confirmPassword) {
      if (newUser.password !== newUser.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      
      const user = {
        id: Math.max(...admins.map(a => a.id), ...employees.map(e => e.id)) + 1,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        accountType: newUser.accountType
      };
      
      if (newUser.accountType === "IT admin") {
        setAdmins([...admins, user]);
      } else {
        setEmployees([...employees, user]);
      }
      
      setNewUser({ name: "", username: "", email: "", password: "", confirmPassword: "", accountType: "Employee" });
      setShowAddModal(false);
    }
  };

  const handleEditUser = async () => {
    if (selectedUser && newUser.name && newUser.username && newUser.email) {
      const updatedUser = {
        ...selectedUser,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        accountType: newUser.accountType
      };
      if (selectedUser.accountType === "IT admin") {
        setAdmins(admins.map(admin => 
          admin.id === selectedUser.id ? updatedUser : admin
        ));
      } else {
        // Persist to backend
        try {
          const [firstName, ...rest] = newUser.name.split(' ');
          const lastName = rest.join(' ') || selectedUser.lastName || '';
          const payload = {
            first_name: firstName || selectedUser.firstName || '',
            last_name: lastName || selectedUser.lastName || '',
            email: newUser.email,
            position: selectedUser.position || 'Employee',
            department: selectedUser.department || null,
            phone: selectedUser.phone || null,
            status: selectedUser.status || 'active',
            hire_date: selectedUser.hireDate || null
          };
          await fetch(`/api/employees/${selectedUser.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(payload)
          });
        } catch (e) {
          console.error('Failed to update employee', e);
        }
        setEmployees(employees.map(employee => 
          employee.id === selectedUser.id ? updatedUser : employee
        ));
      }
      
      setSelectedUser(null);
      setNewUser({ name: "", username: "", email: "", password: "", confirmPassword: "", accountType: "Employee" });
      setShowEditModal(false);
    }
  };

  const handleDeleteUser = async () => {
    if (selectedUser) {
      if (selectedUser.accountType === "IT admin") {
        setAdmins(admins.filter(admin => admin.id !== selectedUser.id));
      } else {
        try {
          await fetch(`/api/employees/${selectedUser.id}`, { method: 'DELETE', headers: { 'Accept': 'application/json' } });
        } catch (e) {
          console.error('Failed to delete employee', e);
        }
        setEmployees(employees.filter(employee => employee.id !== selectedUser.id));
      }
      setSelectedUser(null);
      setShowDeleteModal(false);
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setNewUser({
      name: user.name,
      username: user.username,
      email: user.email,
      password: "",
      confirmPassword: "",
      accountType: user.accountType
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const openViewModal = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  return (
    <div className="h-screen overflow-hidden bg-white flex">
      {/* Sidebar */}
      <HomeSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            
            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* User Profile */}
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                  <Bell className="h-4 w-4 text-gray-500" />
                </div>
                <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                  <Settings className="h-4 w-4 text-gray-500" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">John F.</span>
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">J</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 min-h-0 overflow-y-auto p-6">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-blue-600">Users</h1>
          </div>

          {/* Add New Users Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Add New Users</h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 bg-white rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </button>
            </div>
          </div>

          {/* Admin Section */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Admin</h2>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {admins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {admin.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {admin.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {admin.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {admin.accountType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button onClick={() => openViewModal(admin)} className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-100" title="View">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(admin)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50" 
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(admin)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50" 
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Employees Section */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Employees</h2>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loadingEmployees && (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-sm text-gray-500">Loading...</td>
                    </tr>
                  )}
                  {employeesError && !loadingEmployees && (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-sm text-red-600">{employeesError}</td>
                    </tr>
                  )}
                  {employees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {employee.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {employee.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {employee.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {employee.accountType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button onClick={() => openViewModal(employee)} className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-100" title="View">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button onClick={() => openEditModal(employee)} className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50" title="Edit">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button onClick={() => openDeleteModal(employee)} className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50" title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-8 py-6 rounded-t-xl border-b border-blue-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-blue-700">Add User</h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewUser({ name: "", username: "", email: "", password: "", confirmPassword: "", accountType: "Employee" });
                  }}
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-white hover:shadow-md transition-all duration-200"
                  title="Close"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            {/* Form Content */}
            <div className="p-8 bg-white">
              <div className="grid grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Rica Alorro*"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="NOC tier 1*"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="VOIP*"
                    />
                  </div>
                </div>
                
                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newUser.username}
                      onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Rica Alorro*"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account type
                    </label>
                    <input
                      type="text"
                      value={newUser.accountType}
                      onChange={(e) => setNewUser({ ...newUser, accountType: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="NOC tier 1*"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={newUser.confirmPassword}
                      onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="VOIP*"
                    />
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewUser({ name: "", username: "", email: "", password: "", confirmPassword: "", accountType: "Employee" });
                  }}
                  className="inline-flex items-center px-6 py-3 border-2 border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                  <X className="h-4 w-4 mr-2" />
                  Back
                </button>
                <button
                  onClick={handleAddUser}
                  className="inline-flex items-center px-8 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Submit
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-50 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="p-6">
              {/* Header with title and close button */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-blue-600">Edit User</h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedUser(null);
                    setNewUser({ name: "", username: "", email: "", password: "", confirmPassword: "", accountType: "Employee" });
                  }}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                  title="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Rica Alorro*"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="NOC tier 1*"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="VOIP*"
                    />
                  </div>
                </div>
                
                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newUser.username}
                      onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Rica Alorro*"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account type
                    </label>
                    <input
                      type="text"
                      value={newUser.accountType}
                      onChange={(e) => setNewUser({ ...newUser, accountType: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="NOC tier 1*"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={newUser.confirmPassword}
                      onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="VOIP*"
                    />
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedUser(null);
                    setNewUser({ name: "", username: "", email: "", password: "", confirmPassword: "", accountType: "Employee" });
                  }}
                  className="inline-flex items-center px-6 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <X className="h-4 w-4 mr-2" />
                  Back
                </button>
                <button
                  onClick={handleEditUser}
                  className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Update User
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Delete User</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete the user "{selectedUser?.name}"? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedUser(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {showViewModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-blue-600">User Details</h3>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedUser(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                  title="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-3 text-sm">
                <div><span className="text-gray-500">Name:</span> <span className="text-gray-900">{selectedUser?.name}</span></div>
                <div><span className="text-gray-500">Username:</span> <span className="text-gray-900">{selectedUser?.username}</span></div>
                <div><span className="text-gray-500">Email:</span> <span className="text-gray-900">{selectedUser?.email}</span></div>
                <div><span className="text-gray-500">Account type:</span> <span className="text-gray-900">{selectedUser?.accountType}</span></div>
              </div>
              <div className="mt-6 text-right">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedUser(null);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
