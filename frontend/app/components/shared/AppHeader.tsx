/**
 * AppHeader Component
 * Reusable header component cho toàn bộ application
 * Áp dụng OOP principles: Single Responsibility, Reusability
 */

'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/app/shared/contexts/AuthContext';

/**
 * Props cho AppHeader
 * Open/Closed Principle - có thể extend mà không modify
 */
interface AppHeaderProps {
  title?: string;
  showBackButton?: boolean;
  customBackUrl?: string;
  className?: string;
  children?: React.ReactNode;
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
}

/**
 * AppHeader Component
 * Centralized header với authentication, navigation, và user management
 */
export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  showBackButton = false,
  customBackUrl,
  className = '',
  children,
  onLoginClick,
  onRegisterClick,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  /**
   * Handle back navigation
   */
  const handleBack = () => {
    if (customBackUrl) {
      router.push(customBackUrl);
    } else {
      router.back();
    }
  };

  /**
   * Handle navigation to home
   */
  const handleGoHome = () => {
    router.push('/');
  };

  /**
   * Handle navigation to admin
   */
  const handleGoAdmin = () => {
    router.push('/admin');
  };

  /**
   * Handle navigation to user/employee page
   */
  const handleGoUser = () => {
    router.push('/user');
  };

  /**
   * Handle logout
   */
  const handleLogout = () => {
    logout();
    router.push('/');
  };

  /**
   * Check if current path is admin
   */
  const isAdminPage = pathname?.startsWith('/admin');
  const isUserPage = pathname?.startsWith('/user');

  /**
   * Render brand logo và name
   */
  const renderBrand = () => {
    return (
      <button
        onClick={handleGoHome}
        className="flex items-center space-x-2 group"
      >
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-700 transition-colors">
          <span className="text-white font-bold text-lg">A</span>
        </div>
        <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
          AXON
        </span>
      </button>
    );
  };

  /**
   * Render navigation links
   */
  const renderNavigationLinks = () => {
    return (
      <div className="hidden md:flex items-center space-x-4">
        {/* Home Link */}
        <button
          onClick={handleGoHome}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            !isAdminPage && !isUserPage
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Home
          </div>
        </button>

        {/* User/Employee Link - For authenticated employees */}
        {isAuthenticated && user && !user.canApprove() && (
          <button
            onClick={handleGoUser}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isUserPage
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              My requests
            </div>
          </button>
        )}

        {/* Admin Link - Only for authorized users */}
        {isAuthenticated && user?.canApprove() && (
          <button
            onClick={handleGoAdmin}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isAdminPage
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
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
              Quản lý
            </div>
          </button>
        )}
      </div>
    );
  };

  /**
   * Render user info với dropdown (simplified)
   */
  const renderUserInfo = () => {
    if (!isAuthenticated || !user) {
      // Show Login/Register buttons when not authenticated
      if (onLoginClick && onRegisterClick) {
        return (
          <div className="flex items-center gap-3">
            <button
              onClick={onLoginClick}
              className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Login
            </button>
            <button
              onClick={onRegisterClick}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow"
            >
              Register
            </button>
          </div>
        );
      }
      return null;
    }

    return (
      <div className="flex items-center gap-3">
        {/* User Avatar & Info */}
        <div className="hidden md:flex items-center gap-3 px-3 py-2 bg-gray-100 rounded-lg">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.role}</p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-sm hover:shadow flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    );
  };

  /**
   * Render mobile user info
   */
  const renderMobileUserInfo = () => {
    if (!isAuthenticated || !user) {
      // Show Login/Register buttons on mobile when not authenticated
      if (onLoginClick && onRegisterClick) {
        return (
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={onLoginClick}
              className="flex-1 px-3 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors"
            >
              Login
            </button>
            <button
              onClick={onRegisterClick}
              className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors"
            >
              Register
            </button>
          </div>
        );
      }
      return null;
    }

    return (
      <div className="md:hidden flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-semibold text-gray-900">{user.name}</p>
          <p className="text-xs text-gray-500">{user.role}</p>
        </div>
      </div>
    );
  };

  return (
    <header className={`w-full bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            {/* Back Button */}
            {showBackButton && (
              <button
                onClick={handleBack}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Quay lại"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </button>
            )}

            {/* Brand */}
            {renderBrand()}

            {/* Page Title */}
            {title && (
              <div className="hidden sm:block border-l border-gray-300 pl-4">
                <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
              </div>
            )}
          </div>

          {/* Center Section - Navigation Links */}
          {renderNavigationLinks()}

          {/* Right Section - User Info & Actions */}
          <div className="flex items-center gap-3">
            {/* Custom children (if provided) */}
            {children}

            {/* User Info */}
            {renderUserInfo()}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-3 space-y-2">
          {renderMobileUserInfo()}
          {isAuthenticated && (
            <div className="flex gap-2">
              <button
                onClick={handleGoHome}
                className={`flex-1 px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                  !isAdminPage && !isUserPage
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Home
              </button>
              {!user?.canApprove() && (
                <button
                  onClick={handleGoUser}
                  className={`flex-1 px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                    isUserPage
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Yêu cầu
                </button>
              )}
              {user?.canApprove() && (
                <button
                  onClick={handleGoAdmin}
                  className={`flex-1 px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                    isAdminPage
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Quản lý
                </button>
              )}
            </div>
          )}
        </div>

        {/* Mobile Page Title */}
        {title && (
          <div className="sm:hidden pb-3">
            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
          </div>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
