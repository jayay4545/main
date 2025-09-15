import React from 'react';
import { Check, X, AlertTriangle, User, Briefcase, Package } from 'lucide-react';

const VerificationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  type, 
  requestData, 
  title, 
  message, 
  confirmText, 
  cancelText,
  showReasonInput = false,
  reason = '',
  onReasonChange = () => {}
}) => {
  if (!isOpen) return null;

  const isApprove = type === 'approve';
  const isReject = type === 'reject';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden border border-gray-200">
        {/* Header */}
        <div className={`px-6 py-4 ${isApprove ? 'bg-green-50 border-b border-green-200' : 'bg-red-50 border-b border-red-200'}`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${isApprove ? 'bg-green-100' : 'bg-red-100'}`}>
              {isApprove ? (
                <Check className="h-6 w-6 text-green-600" />
              ) : (
                <X className="h-6 w-6 text-red-600" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-600">Please review the details below</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {/* Request Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Request Details</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <span className="text-sm text-gray-600">Employee:</span>
                  <span className="text-sm font-medium text-gray-900 ml-2">{requestData?.name}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Briefcase className="h-4 w-4 text-gray-500" />
                <div>
                  <span className="text-sm text-gray-600">Position:</span>
                  <span className="text-sm font-medium text-gray-900 ml-2">{requestData?.position}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Package className="h-4 w-4 text-gray-500" />
                <div>
                  <span className="text-sm text-gray-600">Item:</span>
                  <span className="text-sm font-medium text-gray-900 ml-2">{requestData?.item}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Warning for Reject */}
          {isReject && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">Warning</span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">This action cannot be undone!</p>
            </div>
          )}

          {/* Message */}
          <div className="mb-4">
            <p className="text-sm text-gray-700">{message}</p>
          </div>

          {/* Reason Input for Reject */}
          {showReasonInput && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for rejection:
              </label>
              <textarea
                value={reason}
                onChange={(e) => onReasonChange(e.target.value)}
                placeholder="Please provide a reason for rejecting this request..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows="3"
              />
              <p className="text-xs text-gray-500 mt-1">
                This will help the employee understand why their request was denied.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            {cancelText || 'Cancel'}
          </button>
          <button
            onClick={onConfirm}
            disabled={showReasonInput && !reason.trim()}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
              isApprove 
                ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' 
                : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
            } ${
              showReasonInput && !reason.trim() 
                ? 'opacity-50 cursor-not-allowed' 
                : ''
            }`}
          >
            {confirmText || (isApprove ? 'Approve Request' : 'Reject Request')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationModal;