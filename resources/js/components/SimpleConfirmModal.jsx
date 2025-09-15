import React from 'react';

const SimpleConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm',
  message = 'Are you sure you want to continue?',
  confirmText = 'Confirm',
  confirmTone = 'primary' // 'primary' | 'danger'
}) => {
  if (!isOpen) return null;

  const confirmClasses = confirmTone === 'danger'
    ? 'bg-red-600 hover:bg-red-700'
    : 'bg-green-600 hover:bg-green-700';

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-md shadow-lg max-w-sm w-full mx-4 overflow-hidden border border-gray-300">
        <div className="px-4 py-3">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="border-t" />
        <div className="px-4 py-4">
          <p className="text-sm font-medium text-gray-800">{message}</p>
        </div>
        <div className="border-t" />
        <div className="px-4 py-3 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md ${confirmClasses}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleConfirmModal;


