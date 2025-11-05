/**
 * RequestDetailModal Component
 * Modal hiển thị chi tiết yêu cầu và file đính kèm
 */

'use client';

import React from 'react';
import { ApprovalRequest } from '@/app/shared/types/approval.types';
import { FileService } from '@/app/shared/services/approval.services';

interface RequestDetailModalProps {
  request: ApprovalRequest | null;
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export const RequestDetailModal: React.FC<RequestDetailModalProps> = ({
  request,
  isOpen,
  onClose,
  children,
}) => {
  const fileService = new FileService();

  if (!isOpen || !request) return null;

  const handleDownloadFile = (file: any) => {
    fileService.downloadFile(file);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Chi tiết yêu cầu
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            {/* Title */}
            <div className="mb-6">
              <h4 className="text-xl font-bold text-gray-900">
                {request.title}
              </h4>
              <div className="mt-2 flex items-center gap-3">
                <StatusBadge status={request.status} />
                <span className="text-sm text-gray-500">
                  #{request.id}
                </span>
              </div>
            </div>

            {/* Requester Info */}
            <div className="mb-6 bg-gray-50 rounded-lg p-4">
              <h5 className="text-sm font-semibold text-gray-700 mb-3">
                Thông tin người yêu cầu
              </h5>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Họ tên</p>
                  <p className="text-sm font-medium text-gray-900">
                    {request.requester.name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">
                    {request.requester.email}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phòng ban</p>
                  <p className="text-sm font-medium text-gray-900">
                    {request.requester.department || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Ngày tạo</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(request.createdAt).toLocaleString('vi-VN')}
                  </p>
                </div>
              </div>
            </div>

            {/* Request Details */}
            <div className="mb-6">
              <h5 className="text-sm font-semibold text-gray-700 mb-3">
                Chi tiết yêu cầu
              </h5>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Mô tả</p>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                    {request.description}
                  </p>
                </div>
                {request.amount && (
                  <div>
                    <p className="text-xs text-gray-500">Số tiền</p>
                    <p className="text-lg font-bold text-blue-600">
                      {request.getFormattedAmount()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Attached Files */}
            {request.attachedFiles && request.attachedFiles.length > 0 && (
              <div className="mb-6">
                <h5 className="text-sm font-semibold text-gray-700 mb-3">
                  File đính kèm ({request.attachedFiles.length})
                </h5>
                <div className="space-y-2">
                  {request.attachedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <svg
                          className="h-8 w-8 text-gray-400 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {file.getFormattedSize()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownloadFile(file)}
                        className="ml-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Tải xuống
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rejection Reason (if rejected) */}
            {request.isRejected() && request.rejectionReason && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <h5 className="text-sm font-semibold text-red-700 mb-2">
                  Lý do từ chối
                </h5>
                <p className="text-sm text-red-900">{request.rejectionReason}</p>
                <p className="text-xs text-red-600 mt-2">
                  Từ chối bởi: {request.rejectedBy?.name} -{' '}
                  {request.rejectedAt &&
                    new Date(request.rejectedAt).toLocaleString('vi-VN')}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            {children && (
              <div className="border-t border-gray-200 pt-4">{children}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * StatusBadge Component
 */
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'FORWARDED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'PENDING':
        return 'Chờ duyệt';
      case 'APPROVED':
        return 'Đã duyệt';
      case 'REJECTED':
        return 'Từ chối';
      case 'FORWARDED':
        return 'Đã chuyển';
      default:
        return status;
    }
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor()}`}
    >
      {getStatusText()}
    </span>
  );
};
