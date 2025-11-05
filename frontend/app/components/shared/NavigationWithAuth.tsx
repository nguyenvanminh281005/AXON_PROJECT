/**
 * NavigationWrapper Component
 * Wrapper để inject authentication context vào Navigation class component
 */

'use client';

import React from 'react';
import { useAuth } from '../../shared/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { NavigationComponent } from './Navigation';
import { INavigationConfig } from '../../types/component.types';
import ButtonComponent from './Button';

interface NavigationWrapperProps {
  config: INavigationConfig;
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

/**
 * Functional wrapper component với authentication support
 */
export const NavigationWithAuth: React.FC<NavigationWrapperProps> = ({
  config,
  onLoginClick,
  onRegisterClick,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleAdminClick = () => {
    router.push('/admin');
  };

  const renderBrand = () => {
    return (
      <div className="flex items-center space-x-2">
        {config.brand.logo}
        <span className="text-xl font-bold text-gray-900 dark:text-white">
          {config.brand.name}
        </span>
      </div>
    );
  };

  const renderMenuItems = () => {
    return (
      <div className="hidden md:flex items-center space-x-6">
        {config.menuItems.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
          >
            {item.label}
          </button>
        ))}
        {/* Admin link if user has permission */}
        {isAuthenticated && user?.canApprove() && (
          <button
            onClick={handleAdminClick}
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
          >
            Admin
          </button>
        )}
      </div>
    );
  };

  const renderAuthButtons = () => {
    if (isAuthenticated && user) {
      return (
        <div className="flex items-center space-x-3">
          {/* User Info */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user.role}
              </p>
            </div>
          </div>
          
          {/* Logout Button */}
          <ButtonComponent
            variant="outline"
            size="sm"
            onClick={handleLogout}
          >
            Logout
          </ButtonComponent>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-3">
        <ButtonComponent
          variant="outline"
          size="sm"
          onClick={onLoginClick}
        >
          Login
        </ButtonComponent>
        <ButtonComponent
          variant="primary"
          size="sm"
          onClick={onRegisterClick}
        >
          Register
        </ButtonComponent>
      </div>
    );
  };

  const renderMobileMenuToggle = () => {
    return (
      <button
        onClick={toggleMobileMenu}
        className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    );
  };

  return (
    <header className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Brand */}
          {renderBrand()}
          
          {/* Desktop Menu */}
          {renderMenuItems()}
          
          {/* Auth Buttons - Top Right Corner */}
          <div className="hidden md:flex">
            {renderAuthButtons()}
          </div>
          
          {/* Mobile Menu Toggle */}
          {renderMobileMenuToggle()}
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-4">
              {config.menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.onClick}
                  className="text-left text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                >
                  {item.label}
                </button>
              ))}
              {isAuthenticated && user?.canApprove() && (
                <button
                  onClick={handleAdminClick}
                  className="text-left text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                >
                  Admin
                </button>
              )}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                {isAuthenticated && user && (
                  <div className="mb-3 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user.role}
                    </p>
                  </div>
                )}
                {renderAuthButtons()}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default NavigationWithAuth;
