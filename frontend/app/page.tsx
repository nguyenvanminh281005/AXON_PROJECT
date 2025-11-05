'use client';

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import AppHeader from './components/shared/AppHeader';
import { AuthModal } from './shared/components/AuthModal';
import { useModalManager } from './shared/hooks/useModalManager';
import { useAuth } from './shared/contexts/AuthContext';
import themeConfig from './config/theme.config';

/**
 * Home Page Component - Simplified Version
 * Following OOP Principles with Modal Management
 */
const HomePage: React.FC = () => {
  const modalManager = useModalManager();
  const { isAuthenticated } = useAuth();
  const searchParams = useSearchParams();

  // Check for auth parameter in URL and open appropriate modal
  useEffect(() => {
    const authParam = searchParams.get('auth');
    if (authParam === 'login') {
      modalManager.openLoginModal();
    } else if (authParam === 'register') {
      modalManager.openRegisterModal();
    }
  }, [searchParams, modalManager]);

  /**
   * Render simplified hero section
   */
  const renderHeroSection = (): React.ReactNode => {
    return (
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-4xl">A</span>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className={`${themeConfig.typography.h1} mb-6`}>
            AXON Employee Expense Management
          </h1>

          {/* Description */}
          <p className={`${themeConfig.typography.body} text-gray-600 mb-8 max-w-2xl mx-auto`}>
            Hệ thống quản lý chi phí thông minh cho doanh nghiệp. 
            Tối ưu hóa quy trình phê duyệt và theo dõi chi phí hiệu quả.
          </p>
        </div>
      </section>
    );
  };

  /**
   * Render feature highlights
   */
  const renderFeatures = (): React.ReactNode => {
    const features = [
      {
        icon: '📝',
        title: 'Quản lý yêu cầu',
        description: 'Tạo và theo dõi yêu cầu chi phí dễ dàng',
      },
      {
        icon: '✅',
        title: 'Phê duyệt nhanh',
        description: 'Quy trình phê duyệt đơn giản và hiệu quả',
      },
      {
        icon: '📊',
        title: 'Báo cáo chi tiết',
        description: 'Thống kê và phân tích chi phí trực quan',
      },
    ];

    return (
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className={themeConfig.layout.card}>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className={`${themeConfig.typography.h5} mb-2`}>
                  {feature.title}
                </h3>
                <p className={themeConfig.typography.bodySecondary}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  /**
   * Render simplified footer
   */
  const renderFooter = (): React.ReactNode => {
    return (
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-xl font-bold text-gray-900">AXON</span>
          </div>
          <p className="text-gray-600 text-sm">
            © 2025 AXON Employee Expense Management. All rights reserved.
          </p>
        </div>
      </footer>
    );
  };

  return (
    <div className={themeConfig.layout.pageBackground}>
      {/* Header with Navigation */}
      <AppHeader 
        title="" 
        onLoginClick={modalManager.openLoginModal}
        onRegisterClick={modalManager.openRegisterModal}
      />

      {/* Main Content */}
      <main>
        {renderHeroSection()}
        {renderFeatures()}
      </main>

      {/* Footer */}
      {renderFooter()}

      {/* Auth Modal */}
      <AuthModal
        isOpen={modalManager.isModalOpen}
        initialType={modalManager.modalType}
        onClose={modalManager.closeModal}
      />
    </div>
  );
};

export default HomePage;
