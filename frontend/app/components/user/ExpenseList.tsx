/**
 * ExpenseList Component
 * Display list of expense requests with filtering and actions
 * Following OOP principles with reusability
 */

'use client';

import React, { useState } from 'react';
import { ApprovalRequest, RequestStatus } from '@/app/shared/types/approval.types';
import themeConfig from '@/app/config/theme.config';

interface ExpenseListProps {
  requests: ApprovalRequest[];
  onViewDetail: (request: ApprovalRequest) => void;
  onEdit?: (request: ApprovalRequest) => void;
  onDelete?: (request: ApprovalRequest) => void;
  loading?: boolean;
  showActions?: boolean;
}

/**
 * ExpenseList Component
 */
export const ExpenseList: React.FC<ExpenseListProps> = ({
  requests,
  onViewDetail,
  onEdit,
  onDelete,
  loading = false,
  showActions = true,
}) => {
  const [filterStatus, setFilterStatus] = useState<RequestStatus | 'ALL'>('ALL');

  /**
   * Filter requests by status
   */
  const filteredRequests = filterStatus === 'ALL'
    ? requests
    : requests.filter(r => r.status === filterStatus);

  /**
   * Get status badge classes
   */
  const getStatusBadge = (status: RequestStatus): string => {
    switch (status) {
      case RequestStatus.DRAFT:
        return themeConfig.components.badge.draft;
      case RequestStatus.PENDING:
        return themeConfig.components.badge.pending;
      case RequestStatus.APPROVED:
      case RequestStatus.FORWARDED:
        return themeConfig.components.badge.approved;
      case RequestStatus.REJECTED:
        return themeConfig.components.badge.rejected;
      default:
        return themeConfig.components.badge.draft;
    }
  };

  /**
   * Get status label
   */
  const getStatusLabel = (status: RequestStatus): string => {
    switch (status) {
      case RequestStatus.DRAFT:
        return 'Nháp';
      case RequestStatus.PENDING:
        return 'Chờ duyệt';
      case RequestStatus.APPROVED:
        return 'Đã duyệt';
      case RequestStatus.REJECTED:
        return 'Từ chối';
      case RequestStatus.FORWARDED:
        return 'Đã chuyển tiếp';
      default:
        return status;
    }
  };

  /**
   * Format date
   */
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  /**
   * Render loading state
   */
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  /**
   * Render empty state
   */
  if (filteredRequests.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có yêu cầu</h3>
        <p className="mt-1 text-sm text-gray-500">
          {filterStatus === 'ALL' ? 'Bạn chưa có yêu cầu nào.' : `Không có yêu cầu ở trạng thái "${getStatusLabel(filterStatus as RequestStatus)}".`}
        </p>
      </div>
    );
  }

  return (
    <div className={themeConfig.spacing.normal}>
      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-gray-200 mb-4">
        <button
          onClick={() => setFilterStatus('ALL')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            filterStatus === 'ALL'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Tất cả ({requests.length})
        </button>
        <button
          onClick={() => setFilterStatus(RequestStatus.DRAFT)}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            filterStatus === RequestStatus.DRAFT
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Nháp ({requests.filter(r => r.isDraft()).length})
        </button>
        <button
          onClick={() => setFilterStatus(RequestStatus.PENDING)}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            filterStatus === RequestStatus.PENDING
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Chờ duyệt ({requests.filter(r => r.isPending()).length})
        </button>
        <button
          onClick={() => setFilterStatus(RequestStatus.APPROVED)}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            filterStatus === RequestStatus.APPROVED
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Đã duyệt ({requests.filter(r => r.isApproved()).length})
        </button>
        <button
          onClick={() => setFilterStatus(RequestStatus.REJECTED)}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            filterStatus === RequestStatus.REJECTED
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Từ chối ({requests.filter(r => r.isRejected()).length})
        </button>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <div
            key={request.id}
            className={`${themeConfig.layout.card} hover:shadow-md transition-shadow`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                {/* Title and Status */}
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {request.title}
                  </h3>
                  <span className={getStatusBadge(request.status)}>
                    {getStatusLabel(request.status)}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {request.description}
                </p>

                {/* Meta Info */}
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>📅 {formatDate(request.createdAt)}</span>
                  {request.amount && (
                    <span>💰 {request.getFormattedAmount()}</span>
                  )}
                  {request.attachedFiles.length > 0 && (
                    <span>📎 {request.attachedFiles.length} file</span>
                  )}
                </div>

                {/* Rejection Reason */}
                {request.isRejected() && request.rejectionReason && (
                  <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm">
                    <p className="text-red-800">
                      <strong>Lý do từ chối:</strong> {request.rejectionReason}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              {showActions && (
                <div className="ml-4 flex items-center space-x-2">
                  <button
                    onClick={() => onViewDetail(request)}
                    className={`${themeConfig.components.button.ghost} py-2 px-3 text-sm`}
                    title="Xem chi tiết"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>

                  {request.canEdit() && onEdit && (
                    <button
                      onClick={() => onEdit(request)}
                      className={`${themeConfig.components.button.ghost} py-2 px-3 text-sm text-blue-600`}
                      title="Chỉnh sửa"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  )}

                  {request.canDelete() && onDelete && (
                    <button
                      onClick={() => onDelete(request)}
                      className={`${themeConfig.components.button.ghost} py-2 px-3 text-sm text-red-600`}
                      title="Xóa"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseList;
