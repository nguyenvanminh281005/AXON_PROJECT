/**
 * User Layout
 * Shared layout for all user/employee pages
 * Following DRY principle - consistent header
 */

'use client';

import React from 'react';
import AppHeader from '../components/shared/AppHeader';
import themeConfig from '../config/theme.config';

interface UserLayoutProps {
  children: React.ReactNode;
}

/**
 * UserLayout Component
 * Wrapper layout for user section with consistent header
 */
export default function UserLayout({ children }: UserLayoutProps) {
  return (
    <div className={`min-h-screen ${themeConfig.layout.pageBackground}`}>
      {/* Shared Header */}
      <AppHeader title="Quản lý Chi phí" />
      
      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}
