/**
 * Admin Page
 * Trang quản lý phê duyệt yêu cầu cho Admin/Manager
 * Protected route - chỉ cho phép user có quyền truy cập
 */

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminDashboardContent } from '../components/admin/AdminDashboardContent';
import { useAuth } from '../shared/contexts/AuthContext';

export default function AdminPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to home if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#48B7D6] mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Show nothing if not authenticated (will redirect)
  if (!isAuthenticated || !user) {
    return null;
  }

  // Check if user has permission
  if (!user.canApprove()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-[#48B7D6] text-white rounded-lg hover:bg-[#3797b2]"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return <AdminDashboardContent currentUser={user} showHeader={false} />;
}
