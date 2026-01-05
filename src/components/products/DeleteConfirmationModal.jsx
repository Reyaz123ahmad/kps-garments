import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from '../ui/Button';

const DeleteConfirmationModal = ({ productName, onConfirm, onCancel, loading = false }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <h3 className="text-lg font-semibold">Delete Product</h3>
          </div>
          
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete <strong>"{productName}"</strong>? 
            This action cannot be undone.
          </p>

          <div className="flex space-x-3">
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              variant="danger"
              className="flex-1"
              loading={loading}
            >
              Yes, Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
