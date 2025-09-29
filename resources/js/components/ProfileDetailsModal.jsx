import React, { useState, useEffect } from 'react';
import { X, Edit, Mail, Phone, MapPin, User, Building } from 'lucide-react';
import '../../css/profile-modal.css';

const ProfileDetailsModal = ({ isOpen, onClose, user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [editData, setEditData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || user?.department || 'IT Department',
    role: user?.role || 'IT Admin'
  });

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          name: `${editData.firstName} ${editData.lastName}`.trim(),
          email: editData.email,
          phone: editData.phone,
          position: editData.role,
          department: editData.location,
          location: editData.location,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        // Update the user data in the parent component
        if (user && typeof user === 'object') {
          Object.assign(user, result.data);
        }
        setIsEditing(false);
        alert('Profile updated successfully!');
        // Optionally reload the page to reflect changes
        window.location.reload();
      } else {
        alert(result.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    setEditData({
      firstName: user?.name?.split(' ')[0] || '',
      lastName: user?.name?.split(' ').slice(1).join(' ') || '',
      email: user?.email || '',
      phone: user?.phone || '',
      location: user?.location || user?.department || 'IT Department',
      role: user?.role || 'IT Admin'
    });
    setIsEditing(false);
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }

    try {
      const response = await fetch('/api/profile/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify(passwordData),
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Password changed successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setShowPasswordModal(false);
      } else {
        alert(result.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to change password. Please try again.');
    }
  };

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div className={`fixed inset-0 z-50 flex justify-end profile-backdrop-enter`}>
      <div className={`bg-white w-full max-w-2xl h-full shadow-2xl shadow-blue-500/50 profile-modal-enter ${isAnimating ? 'profile-modal-enter' : 'profile-modal-exit'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Profile Details</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Profile Header Card */}
        <div className="p-6 bg-gradient-to-r from-[#2262C6] to-[#0064FF] text-white rounded-2xl mx-6 mt-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-xl bg-white/20 flex items-center justify-center text-2xl font-bold overflow-hidden">
              {user?.image ? (
                <img src={user.image} alt={user.name} className="w-full h-full object-cover rounded-xl" />
              ) : (
                user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'U'
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold">{user?.name || 'Loading...'}</h3>
              <p className="text-blue-100 text-lg">{user?.role || 'IT Admin'}</p>
              <p className="text-blue-100 text-sm">{user?.location || user?.department || 'IT Department'}</p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span>{isEditing ? 'Cancel' : 'Edit'}</span>
            </button>
          </div>
        </div>

        {/* Personal Information */}
        <div className="px-6 pb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 text-[#2262C6] hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* First Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">First Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.firstName}
                  onChange={(e) => setEditData({...editData, firstName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2262C6] focus:border-[#2262C6] transition-colors"
                />
              ) : (
                <p className="text-gray-900 text-lg font-medium">{editData.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Last Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.lastName}
                  onChange={(e) => setEditData({...editData, lastName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2262C6] focus:border-[#2262C6] transition-colors"
                />
              ) : (
                <p className="text-gray-900 text-lg font-medium">{editData.lastName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Email Address</label>
              {isEditing ? (
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({...editData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2262C6] focus:border-[#2262C6] transition-colors"
                />
              ) : (
                <p className="text-gray-900 text-lg font-medium">{editData.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editData.phone}
                  onChange={(e) => setEditData({...editData, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2262C6] focus:border-[#2262C6] transition-colors"
                />
              ) : (
                <p className="text-gray-900 text-lg font-medium">{editData.phone}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Location</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.location}
                  onChange={(e) => setEditData({...editData, location: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2262C6] focus:border-[#2262C6] transition-colors"
                />
              ) : (
                <p className="text-gray-900 text-lg font-medium">{editData.location}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Account Type</label>
              {isEditing ? (
                <select
                  value={editData.role}
                  onChange={(e) => setEditData({...editData, role: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2262C6] focus:border-[#2262C6] transition-colors"
                >
                  <option value="IT Admin">IT Admin</option>
                  <option value="Super Administrator">Super Administrator</option>
                  <option value="Employee">Employee</option>
                  <option value="Manager">Manager</option>
                </select>
              ) : (
                <p className="text-gray-900 text-lg font-medium">{editData.role}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="px-6 py-3 text-[#2262C6] bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors font-medium"
              >
                Change Password
              </button>
              <div className="flex space-x-4">
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-[#2262C6] text-white hover:bg-[#1a4a9c] rounded-xl transition-colors font-medium"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Password Change Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Change Password</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2262C6] focus:border-[#2262C6] transition-colors"
                    placeholder="Enter current password"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2262C6] focus:border-[#2262C6] transition-colors"
                    placeholder="Enter new password"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2262C6] focus:border-[#2262C6] transition-colors"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                  }}
                  className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleChangePassword}
                  className="px-6 py-3 bg-[#2262C6] text-white hover:bg-[#1a4a9c] rounded-xl transition-colors font-medium"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileDetailsModal;
