/**
 * User Page (Employee Dashboard)
 * Trang quản lý yêu cầu chi phí cho nhân viên
 * Protected route - chỉ cho phép user đã đăng nhập
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../shared/contexts/AuthContext';
import {
  ApprovalRequest,
  CreateRequestDTO,
  UpdateRequestDTO,
  SubmitRequestDTO,
  RequestType,
} from '../shared/types/approval.types';
import { expenseService } from '../shared/services/expense.service';
import { ExpenseForm } from '../components/user/ExpenseForm';
import { ExpenseList } from '../components/user/ExpenseList';
import themeConfig from '../config/theme.config';
import { Modal } from '../shared/components/Modal';

type ModalMode = 'none' | 'create' | 'edit' | 'view' | 'delete';

/**
 * UserPage Component
 * Employee dashboard for managing expense requests
 */
export default function UserPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // State management
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  
  // Modal state
  const [modalMode, setModalMode] = useState<ModalMode>('none');
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  // Load requests
  useEffect(() => {
    if (user) {
      loadRequests();
    }
  }, [user]);

  /**
   * Load all requests for current user
   */
  const loadRequests = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError('');
      const data = await expenseService.getMyRequests(user.id);
      setRequests(data);
    } catch (err) {
      setError('Không thể tải danh sách yêu cầu');
      console.error('Error loading requests:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle create new draft
   */
  const handleCreateDraft = async (data: CreateRequestDTO) => {
    try {
      setIsSubmitting(true);
      setError('');
      await expenseService.createDraft(data);
      setSuccess('Đã tạo nháp thành công!');
      setModalMode('none');
      await loadRequests();
    } catch (err: any) {
      setError(err.message || 'Không thể tạo nháp');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle save draft
   */
  const handleSaveDraft = async (data: UpdateRequestDTO) => {
    try {
      setIsSubmitting(true);
      setError('');
      await expenseService.saveDraft(data);
      setSuccess('Đã lưu nháp thành công!');
      setModalMode('none');
      await loadRequests();
    } catch (err: any) {
      setError(err.message || 'Không thể lưu nháp');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle submit request
   */
  const handleSubmitRequest = async (request: ApprovalRequest) => {
    if (!user) return;

    try {
      setIsSubmitting(true);
      setError('');
      const dto: SubmitRequestDTO = {
        id: request.id,
        requesterId: user.id,
      };
      await expenseService.submitRequest(dto);
      setSuccess('Đã gửi yêu cầu thành công!');
      setModalMode('none');
      await loadRequests();
    } catch (err: any) {
      setError(err.message || 'Không thể gửi yêu cầu');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle delete request
   */
  const handleDeleteRequest = async (request: ApprovalRequest) => {
    try {
      setIsSubmitting(true);
      setError('');
      await expenseService.deleteRequest(request.id);
      setSuccess('Đã xóa yêu cầu thành công!');
      setModalMode('none');
      await loadRequests();
    } catch (err: any) {
      setError(err.message || 'Không thể xóa yêu cầu');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle view detail
   */
  const handleViewDetail = (request: ApprovalRequest) => {
    setSelectedRequest(request);
    setModalMode('view');
  };

  /**
   * Handle edit request
   */
  const handleEditRequest = (request: ApprovalRequest) => {
    setSelectedRequest(request);
    setModalMode('edit');
  };

  /**
   * Handle delete confirmation
   */
  const handleDeleteConfirm = (request: ApprovalRequest) => {
    setSelectedRequest(request);
    setModalMode('delete');
  };

  /**
   * Close modal
   */
  const handleCloseModal = () => {
    setModalMode('none');
    setSelectedRequest(null);
    setError('');
  };

  /**
   * Clear messages
   */
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Show nothing if not authenticated (will redirect)
  if (!isAuthenticated || !user) {
    return null;
  }

  /**
   * Render Stats Cards
   */
  const renderStats = () => {
    const stats = [
      {
        label: 'Nháp',
        value: requests.filter(r => r.isDraft()).length,
        icon: '📝',
        color: 'bg-gray-100 text-gray-800',
      },
      {
        label: 'Chờ duyệt',
        value: requests.filter(r => r.isPending()).length,
        icon: '⏳',
        color: 'bg-yellow-100 text-yellow-800',
      },
      {
        label: 'Đã duyệt',
        value: requests.filter(r => r.isApproved()).length,
        icon: '✅',
        color: 'bg-green-100 text-green-800',
      },
      {
        label: 'Từ chối',
        value: requests.filter(r => r.isRejected()).length,
        icon: '❌',
        color: 'bg-red-100 text-red-800',
      },
    ];

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className={themeConfig.layout.card}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`text-4xl ${stat.color} p-3 rounded-lg`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  /**
   * Render View Detail Modal
   */
  const renderViewModal = () => {
    if (!selectedRequest) return null;

    return (
      <Modal
        isOpen={modalMode === 'view'}
        onClose={handleCloseModal}
        title="Chi tiết yêu cầu"
      >
        <div className={themeConfig.spacing.normal}>
          {/* Status Badge */}
          <div className="mb-4">
            <span className={
              selectedRequest.isDraft() ? themeConfig.components.badge.draft :
              selectedRequest.isPending() ? themeConfig.components.badge.pending :
              selectedRequest.isApproved() ? themeConfig.components.badge.approved :
              themeConfig.components.badge.rejected
            }>
              {selectedRequest.isDraft() ? 'Nháp' :
               selectedRequest.isPending() ? 'Chờ duyệt' :
               selectedRequest.isApproved() ? 'Đã duyệt' :
               'Từ chối'}
            </span>
          </div>

          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
            <p className="text-gray-900">{selectedRequest.title}</p>
          </div>

          {/* Amount */}
          {selectedRequest.amount && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền</label>
              <p className="text-gray-900 font-semibold">{selectedRequest.getFormattedAmount()}</p>
            </div>
          )}

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
            <p className="text-gray-900 whitespace-pre-wrap">{selectedRequest.description}</p>
          </div>

          {/* Attachments */}
          {selectedRequest.attachedFiles.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">File đính kèm</label>
              <div className="space-y-2">
                {selectedRequest.attachedFiles.map((file) => (
                  <div key={file.id} className="flex items-center space-x-2 text-sm">
                    <span>📎</span>
                    <span>{file.name}</span>
                    <span className="text-gray-500">({file.getFormattedSize()})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rejection Reason */}
          {selectedRequest.isRejected() && selectedRequest.rejectionReason && (
            <div className={themeConfig.components.alert.error}>
              <strong>Lý do từ chối:</strong> {selectedRequest.rejectionReason}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t">
            {selectedRequest.canSubmit() && (
              <button
                onClick={() => handleSubmitRequest(selectedRequest)}
                className={themeConfig.components.button.success}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
              </button>
            )}
            {selectedRequest.canEdit() && (
              <button
                onClick={() => handleEditRequest(selectedRequest)}
                className={themeConfig.components.button.primary}
              >
                Chỉnh sửa
              </button>
            )}
            <button
              onClick={handleCloseModal}
              className={themeConfig.components.button.secondary}
            >
              Đóng
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  /**
   * Render Delete Confirmation Modal
   */
  const renderDeleteModal = () => {
    if (!selectedRequest) return null;

    return (
      <Modal
        isOpen={modalMode === 'delete'}
        onClose={handleCloseModal}
        title="Xác nhận xóa"
      >
        <div className={themeConfig.spacing.normal}>
          <p className="text-gray-700">
            Bạn có chắc chắn muốn xóa yêu cầu <strong>"{selectedRequest.title}"</strong>?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Hành động này không thể hoàn tác.
          </p>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t mt-4">
            <button
              onClick={handleCloseModal}
              className={themeConfig.components.button.secondary}
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              onClick={() => handleDeleteRequest(selectedRequest)}
              className={themeConfig.components.button.danger}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang xóa...' : 'Xóa'}
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  return (
    <>
      <div className={themeConfig.layout.container}>
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={themeConfig.typography.h3}>Yêu cầu Chi phí</h1>
            <p className={themeConfig.typography.bodySecondary}>
              Quản lý và theo dõi các yêu cầu chi phí của bạn
            </p>
          </div>
          <button
            onClick={() => setModalMode('create')}
            className={themeConfig.components.button.primary}
          >
            <svg className="h-5 w-5 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tạo yêu cầu mới
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className={`mb-6 ${themeConfig.components.alert.error}`}>
            {error}
          </div>
        )}
        {success && (
          <div className={`mb-6 ${themeConfig.components.alert.success}`}>
            {success}
          </div>
        )}

        {/* Stats */}
        {renderStats()}

        {/* Requests List */}
        <div className={themeConfig.layout.card}>
          <h2 className={`${themeConfig.typography.h5} mb-4`}>Danh sách yêu cầu</h2>
          <ExpenseList
            requests={requests}
            onViewDetail={handleViewDetail}
            onEdit={handleEditRequest}
            onDelete={handleDeleteConfirm}
            loading={loading}
            showActions={true}
          />
        </div>
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={modalMode === 'create'}
        onClose={handleCloseModal}
        title="Tạo yêu cầu mới"
      >
        <ExpenseForm
          mode="create"
          onSubmit={handleCreateDraft}
          onCancel={handleCloseModal}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={modalMode === 'edit'}
        onClose={handleCloseModal}
        title="Chỉnh sửa yêu cầu"
      >
        {selectedRequest && (
          <ExpenseForm
            mode="edit"
            initialData={selectedRequest}
            onSubmit={handleSaveDraft}
            onCancel={handleCloseModal}
            isSubmitting={isSubmitting}
          />
        )}
      </Modal>

      {/* View Detail Modal */}
      {renderViewModal()}

      {/* Delete Confirmation Modal */}
      {renderDeleteModal()}
    </>
  );
}
