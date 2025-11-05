/**
 * Custom Hooks for Approval System
 * Reusable logic cho việc quản lý approval requests
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { ApprovalRequest, User, ApprovalActionDTO } from '../types/approval.types';
import { ApprovalService, RequestService } from '../services/approval.services';

/**
 * Hook: useApprovalRequests
 * Quản lý việc fetch và state của approval requests
 */
export function useApprovalRequests() {
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const requestService = new RequestService();

  /**
   * Fetch tất cả yêu cầu đang chờ phê duyệt
   */
  const fetchPendingRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await requestService.getPendingRequests();
      setRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch tất cả yêu cầu
   */
  const fetchAllRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await requestService.getAllRequests();
      setRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refresh danh sách
   */
  const refresh = useCallback(() => {
    fetchPendingRequests();
  }, [fetchPendingRequests]);

  // Auto fetch on mount
  useEffect(() => {
    fetchPendingRequests();
  }, [fetchPendingRequests]);

  return {
    requests,
    loading,
    error,
    refresh,
    fetchAllRequests,
    fetchPendingRequests,
  };
}

/**
 * Hook: useApprovalActions
 * Xử lý các actions phê duyệt/từ chối
 */
export function useApprovalActions(currentUser: User) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const approvalService = new ApprovalService();

  /**
   * Phê duyệt yêu cầu
   */
  const approve = useCallback(
    async (request: ApprovalRequest): Promise<ApprovalRequest | null> => {
      try {
        setProcessing(true);
        setError(null);
        setSuccess(false);

        const actionData: ApprovalActionDTO = {
          requestId: request.id,
          actionBy: currentUser,
        };

        const updatedRequest = await approvalService.approveRequest(
          request,
          actionData
        );

        setSuccess(true);
        return updatedRequest;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
        setError(errorMessage);
        return null;
      } finally {
        setProcessing(false);
      }
    },
    [currentUser]
  );

  /**
   * Từ chối yêu cầu
   */
  const reject = useCallback(
    async (
      request: ApprovalRequest,
      reason: string
    ): Promise<ApprovalRequest | null> => {
      try {
        setProcessing(true);
        setError(null);
        setSuccess(false);

        const actionData: ApprovalActionDTO = {
          requestId: request.id,
          actionBy: currentUser,
          reason,
        };

        const updatedRequest = await approvalService.rejectRequest(
          request,
          actionData
        );

        setSuccess(true);
        return updatedRequest;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
        setError(errorMessage);
        return null;
      } finally {
        setProcessing(false);
      }
    },
    [currentUser]
  );

  /**
   * Chuyển tiếp cho bộ phận Tài chính
   */
  const forwardToFinance = useCallback(
    async (request: ApprovalRequest): Promise<ApprovalRequest | null> => {
      try {
        setProcessing(true);
        setError(null);
        setSuccess(false);

        const actionData: ApprovalActionDTO = {
          requestId: request.id,
          actionBy: currentUser,
        };

        const updatedRequest = await approvalService.forwardToFinance(
          request,
          actionData
        );

        setSuccess(true);
        return updatedRequest;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
        setError(errorMessage);
        return null;
      } finally {
        setProcessing(false);
      }
    },
    [currentUser]
  );

  /**
   * Clear error và success state
   */
  const clearStatus = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  return {
    approve,
    reject,
    forwardToFinance,
    processing,
    error,
    success,
    clearStatus,
  };
}

/**
 * Hook: useRequestDetail
 * Quản lý chi tiết một yêu cầu cụ thể
 */
export function useRequestDetail(requestId: string) {
  const [request, setRequest] = useState<ApprovalRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const requestService = new RequestService();

  const fetchRequest = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await requestService.getRequestById(requestId);
      setRequest(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  }, [requestId]);

  useEffect(() => {
    if (requestId) {
      fetchRequest();
    }
  }, [requestId, fetchRequest]);

  return {
    request,
    loading,
    error,
    refresh: fetchRequest,
  };
}
