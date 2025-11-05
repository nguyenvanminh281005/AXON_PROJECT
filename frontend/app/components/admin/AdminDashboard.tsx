/**
 * AdminDashboard Component
 * Container component tổng hợp tất cả các thành phần admin
 */

'use client';

import React, { useState } from 'react';
import { ApprovalRequest, User, UserRole } from '@/app/shared/types/approval.types';
import { useApprovalRequests, useApprovalActions } from '@/app/shared/hooks/useApproval';
import { RequestList } from './RequestList';
import { RequestDetailModal } from './RequestDetailModal';
import { ApprovalActions } from './ApprovalActions';
import AppHeader from '../shared/AppHeader';

interface AdminDashboardProps {
  currentUser: User;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser }) => {
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Custom hooks
  const { requests, loading, error, refresh } = useApprovalRequests();
  const {
    approve,
    reject,
    forwardToFinance,
    processing,
    error: actionError,
    success,
    clearStatus,
  } = useApprovalActions(currentUser);

  // Handlers
  const handleSelectRequest = (request: ApprovalRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
    clearStatus();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  const handleApprove = async (request: ApprovalRequest) => {
    const result = await approve(request);
    if (result) {
      handleCloseModal();
      refresh();
    }
  };

  const handleReject = async (request: ApprovalRequest, reason: string) => {
    const result = await reject(request, reason);
    if (result) {
      handleCloseModal();
      refresh();
    }
  };

  const handleForward = async (request: ApprovalRequest) => {
    const result = await forwardToFinance(request);
    if (result) {
      handleCloseModal();
      refresh();
    }
  };

  // Check permissions
  if (!currentUser.canApprove()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <svg
            className="mx-auto h-12 w-12 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            Không có quyền truy cập
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Bạn không có quyền truy cập vào trang quản trị này.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* App Header - Reusable component */}
      <AppHeader title="Admin Dashboard">
        {/* Refresh Button */}
        <button
          onClick={refresh}
          disabled={loading}
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-sm hover:shadow"
          title="Làm mới"
        >
          <svg
            className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </AppHeader>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
          <StatCard
            title="Chờ phê duyệt"
            value={requests.filter((r) => r.isPending()).length}
            icon="clock"
            color="yellow"
          />
          <StatCard
            title="Đã phê duyệt"
            value={requests.filter((r) => r.isApproved()).length}
            icon="check"
            color="green"
          />
          <StatCard
            title="Đã từ chối"
            value={requests.filter((r) => r.isRejected()).length}
            icon="x"
            color="red"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && !isModalOpen && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              Xử lý yêu cầu thành công!
            </p>
          </div>
        )}

        {/* Request List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Danh sách yêu cầu chờ phê duyệt
            </h3>
          </div>
          <RequestList
            requests={requests}
            onSelectRequest={handleSelectRequest}
            loading={loading}
          />
        </div>
      </main>

      {/* Request Detail Modal */}
      <RequestDetailModal
        request={selectedRequest}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      >
        {selectedRequest && (
          <>
            {actionError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">{actionError}</p>
              </div>
            )}
            {success && (
              <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800">
                  Xử lý thành công!
                </p>
              </div>
            )}
            <ApprovalActions
              request={selectedRequest}
              currentUser={currentUser}
              onApprove={handleApprove}
              onReject={handleReject}
              onForward={handleForward}
              processing={processing}
            />
          </>
        )}
      </RequestDetailModal>
    </div>
  );
};

/**
 * StatCard Component
 * Hiển thị thống kê
 */
interface StatCardProps {
  title: string;
  value: number;
  icon: 'clock' | 'check' | 'x';
  color: 'yellow' | 'green' | 'red';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'yellow':
        return 'bg-yellow-500 text-white';
      case 'green':
        return 'bg-green-500 text-white';
      case 'red':
        return 'bg-red-500 text-white';
    }
  };

  const getIcon = () => {
    switch (icon) {
      case 'clock':
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        );
      case 'check':
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        );
      case 'x':
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        );
    }
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md p-3 ${getColorClasses()}`}>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {getIcon()}
            </svg>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="text-3xl font-semibold text-gray-900">{value}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};
