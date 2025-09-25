import React, { useState } from "react";
import { Plus, Edit, Trash2, MoreVertical, Save, ArrowRight } from "lucide-react";
import HomeSidebar from "./HomeSidebar";
import Taskbar from "./components/Taskbar.jsx";

const RoleManagementPage = () => {
  const [admins, setAdmins] = useState([
    {
      id: 1,
      name: "France Magdalaro",
      position: "HR Lead",
      profileImage: "/images/profile1.jpg",
      accessTools: {
        dashboard: true,
        viewRequest: true,
        viewApprove: true,
        equipment: true,
        reports: true,
        controlPanel: true
      }
    },
    {
      id: 2,
      name: "Arvin Managaytay",
      position: "IT ADMIN",
      profileImage: "/images/profile2.jpg",
      accessTools: {
        dashboard: true,
        viewRequest: true,
        viewApprove: true,
        equipment: true,
        reports: true,
        controlPanel: true
      }
    },
    {
      id: 3,
      name: "Earl Dela Cruz",
      position: "NOC Lead",
      profileImage: "/images/profile3.jpg",
      accessTools: {
        dashboard: true,
        viewRequest: true,
        viewApprove: true,
        equipment: true,
        reports: true,
        controlPanel: true
      }
    },
    {
      id: 4,
      name: "John Paul Francisco",
      position: "IT ADMIN",
      profileImage: "/images/profile4.jpg",
      accessTools: {
        dashboard: true,
        viewRequest: true,
        viewApprove: true,
        equipment: true,
        reports: true,
        controlPanel: true
      }
    },
    {
      id: 5,
      name: "Berly Basiosa",
      position: "IT ADMIN",
      profileImage: "/images/profile5.jpg",
      accessTools: {
        dashboard: true,
        viewRequest: true,
        viewApprove: true,
        equipment: true,
        reports: true,
        controlPanel: true
      }
    }
  ]);

  const [selectedAdmin, setSelectedAdmin] = useState(admins[0]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [newRole, setNewRole] = useState({ name: "", description: "" });

  const handleAddRole = () => {
    if (newRole.name && newRole.description) {
      const admin = {
        id: admins.length + 1,
        name: newRole.name,
        position: newRole.description,
        profileImage: "/images/default-profile.jpg",
        accessTools: {
          dashboard: true,
          viewRequest: true,
          viewApprove: true,
          equipment: true,
          reports: true,
          controlPanel: true
        }
      };
      setAdmins([...admins, admin]);
      setNewRole({ name: "", description: "" });
      setShowAddModal(false);
    }
  };

  const handleEditRole = () => {
    if (selectedRole && newRole.name && newRole.description) {
      setAdmins(admins.map(admin => 
        admin.id === selectedRole.id 
          ? { ...admin, name: newRole.name, position: newRole.description }
          : admin
      ));
      setSelectedRole(null);
      setNewRole({ name: "", description: "" });
      setShowEditModal(false);
    }
  };

  const handleDeleteRole = () => {
    if (selectedRole) {
      setAdmins(admins.filter(admin => admin.id !== selectedRole.id));
      if (selectedAdmin.id === selectedRole.id) {
        setSelectedAdmin(admins[0]);
      }
      setSelectedRole(null);
      setShowDeleteModal(false);
    }
  };

  const openEditModal = (admin) => {
    setSelectedRole(admin);
    setNewRole({ name: admin.name, description: admin.position });
    setShowEditModal(true);
  };

  const openDeleteModal = (admin) => {
    setSelectedRole(admin);
    setShowDeleteModal(true);
  };

  const handleAccessToolChange = (tool) => {
    setSelectedAdmin({
      ...selectedAdmin,
      accessTools: {
        ...selectedAdmin.accessTools,
        [tool]: !selectedAdmin.accessTools[tool]
      }
    });
  };

  const handleSaveAccessTools = () => {
    setAdmins(admins.map(admin => 
      admin.id === selectedAdmin.id ? selectedAdmin : admin
    ));
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Sidebar */}
      <HomeSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Taskbar title="John F." />
        <main className="px-10 py-6 mb-10 flex flex-row gap-8 overflow-hidden">
        {/* Left Panel - Admin Lists */}
        <div className="flex-1 min-w-0">
          <div className="mb-6">
           <h1 className="text-3xl font-extrabold text-blue-600">Role Management</h1>
          <p className="text-2xl font-semibold text-gray-500 mt-4">Admin Lists</p>
          </div>
          
          {/* Table Headers */}
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm font-medium text-gray-800 uppercase tracking-wider">
            <div>Names</div>
            <div>Positions</div>
          </div>
          
          {/* Admin List */}
          <div className="space-y-3">
            {admins.map((admin) => (
              <div
                key={admin.id}
                onClick={() => setSelectedAdmin(admin)}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
                  selectedAdmin.id === admin.id
                    ? 'bg-blue-50 border-blue-200 shadow'
                    : 'bg-white border-gray-200 hover:shadow'
                }`}
              >
                <div className="grid grid-cols-2 items-center">
                  <div className="font-semibold text-gray-600 truncate">{admin.name}</div>
                  <div className="text-right text-gray-900 uppercase text-meduim tracking-wide">{admin.position}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Right Panel - Admin Details */}
        <div className="w-full max-w-xs">
          <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
            {/* Profile Section */}
            <div className="text-center mb-6">
              {selectedAdmin.profileImage ? (
                <img src={selectedAdmin.profileImage} alt={selectedAdmin.name} className="w-20 h-20 rounded-full mx-auto mb-3 object-cover" />
              ) : (
                <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-600">
                    {selectedAdmin.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              )}
              <h3 className="text-lg font-bold text-gray-900">{selectedAdmin.name}</h3>
              <p className="text-gray-500">{selectedAdmin.position}</p>
            </div>
            
            {/* Access Tools Section */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-4">Access tools</h4>
              <div className="space-y-3">
                {Object.entries(selectedAdmin.accessTools).map(([tool, enabled]) => (
                  <div key={tool} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 capitalize">
                      {tool.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={() => handleAccessToolChange(tool)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Save Button */}
            <button
              onClick={handleSaveAccessTools}
              className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          </div>
        </div>
        </main>
      </div>
      
      {/* Edit Admin Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Admin</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Admin Name</label>
                  <input
                    type="text"
                    value={newRole.name}
                    onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter admin name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Position</label>
                  <input
                    type="text"
                    value={newRole.description}
                    onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter position"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedRole(null);
                    setNewRole({ name: "", description: "" });
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditRole}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  Update Admin
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
              <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Admin</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete the admin "{selectedRole?.name}"? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedRole(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteRole}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleManagementPage;
