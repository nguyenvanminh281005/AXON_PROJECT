/**
 * ApprovalActions Component
 * Component xử lý các action phê duyệt/từ chối
 */

'use client';

import React, { useState } from 'react';
import { ApprovalRequest, User } from '@/app/shared/types/approval.types';

interface ApprovalActionsProps {
  request: ApprovalRequest;
  currentUser: User;
  onApprove: (request: ApprovalRequest) => Promise<void>;
  onReject: (request: ApprovalRequest, reason: string) => Promise<void>;
  onForward: (request: ApprovalRequest) => Promise<void>;
  processing?: boolean;
}

export const ApprovalActions: React.FC<ApprovalActionsProps> = ({
  request,
  currentUser,
  onApprove,
  onReject,
  onForward,
  processing = false,
}) => {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [reasonError, setReasonError] = useState('');

  // Kiểm tra quyền
  if (!currentUser.canApprove() || !request.isPending()) {
    return null;
  }

  const handleApprove = async () => {
    if (window.confirm('Bạn có chắc chắn muốn phê duyệt yêu cầu này?')) {
      await onApprove(request);
    }
  };

  const handleForward = async () => {
    if (
      window.confirm(
        'Bạn có chắc chắn muốn chuyển tiếp yêu cầu này cho bộ phận Tài chính?'
      )
    ) {
      await onForward(request);
    }
  };

  const handleRejectClick = () => {
    setShowRejectForm(true);
    setReasonError('');
    setRejectionReason('');
  };

  const handleRejectSubmit = async () => {
    // Validate reason
    if (!rejectionReason.trim()) {
      setReasonError('Vui lòng nhập lý do từ chối');
      return;
    }

    if (rejectionReason.trim().length < 10) {
      setReasonError('Lý do từ chối phải có ít nhất 10 ký tự');
      return;
    }

    await onReject(request, rejectionReason);
    setShowRejectForm(false);
    setRejectionReason('');
  };

  const handleCancelReject = () => {
    setShowRejectForm(false);
    setRejectionReason('');
    setReasonError('');
  };

  if (showRejectForm) {
    return (
      <div className="space-y-4">
        <div>
          <label
            htmlFor="rejection-reason"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Lý do từ chối <span className="text-red-500">*</span>
          </label>
          <textarea
            id="rejection-reason"
            rows={4}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              reasonError ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Nhập lý do từ chối yêu cầu này (tối thiểu 10 ký tự)"
            value={rejectionReason}
            onChange={(e) => {
              setRejectionReason(e.target.value);
              setReasonError('');
            }}
            disabled={processing}
          />
          {reasonError && (
            <p className="mt-1 text-sm text-red-600">{reasonError}</p>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={handleCancelReject}
            disabled={processing}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={handleRejectSubmit}
            disabled={processing}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {processing && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            Xác nhận từ chối
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        onClick={handleApprove}
        disabled={processing}
        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {processing ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        ) : (
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
        Phê duyệt
      </button>

      <button
        onClick={handleForward}
        disabled={processing}
        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {processing ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        ) : (
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        )}
        Chuyển Tài chính
      </button>

      <button
        onClick={handleRejectClick}
        disabled={processing}
        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {processing ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        ) : (
          <svg
            className="h-5 w-5"
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
        )}
        Từ chối
      </button>
    </div>
  );
};
