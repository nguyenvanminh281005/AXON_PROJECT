import React from 'react';
import { Modal } from './Modal';

interface ManagerConfirmRejectModalProps {
  isOpen: boolean;
  title?: string;
  requestInfo?: any; // tuỳ trường hợp, có thể truyền object request
  onClose: () => void;
  onConfirm: () => void;
  onReject: () => void;
  confirmText?: string;
  rejectText?: string;
  loading?: boolean;
}

export const ManagerConfirmRejectModal: React.FC<ManagerConfirmRejectModalProps> = ({
  isOpen,
  title = 'Xác nhận yêu cầu',
  requestInfo,
  onClose,
  onConfirm,
  onReject,
  confirmText = 'Xác nhận',
  rejectText = 'Từ chối',
  loading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="mb-4">
        {/* Hiển thị chi tiết yêu cầu. Tuỳ ý custom */}
        {requestInfo ? (
          <pre className="bg-gray-100 text-sm p-4 rounded text-gray-800">
            {typeof requestInfo === 'string'
              ? requestInfo
              : JSON.stringify(requestInfo, null, 2)}
          </pre>
        ) : (
          <p>Không có thông tin yêu cầu.</p>
        )}
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <button
          className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors disabled:opacity-50"
          onClick={onReject}
          disabled={loading}
        >
          {rejectText}
        </button>
        <button
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
          onClick={onConfirm}
          disabled={loading}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};
