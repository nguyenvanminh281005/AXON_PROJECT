/**
 * Admin Layout
 * Shared layout cho tất cả admin pages
 * Áp dụng DRY principle - không duplicate header code
 */

'use client';

import React from 'react';
import AppHeader from '../components/shared/AppHeader';
import themeConfig from '../config/theme.config';

interface AdminLayoutProps {
  children: React.ReactNode;
}

/**
 * AdminLayout Component
 * Wrapper layout cho admin section với consistent header
 */
export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className={`min-h-screen ${themeConfig.layout.pageBackground}`}>
      {/* Shared Header */}
      <AppHeader title="Admin Dashboard" />
      
      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}
