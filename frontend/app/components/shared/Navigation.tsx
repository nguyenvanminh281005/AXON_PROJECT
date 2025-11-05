'use client';

import React from 'react';
import { INavigationConfig } from '../../types/component.types';
import ButtonComponent from './Button';
import { useAuth } from '../../shared/contexts/AuthContext';
import { useRouter } from 'next/navigation';

/**
 * Navigation Component - Following OOP Principles
 * 
 * Single Responsibility: Handles navigation rendering and interaction
 * Encapsulation: Internal state and methods are private
 * Composition: Uses ButtonComponent for auth buttons
 * Enhanced with Authentication support
 */
interface INavigationProps {
  config: INavigationConfig;
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

interface INavigationState {
  isMobileMenuOpen: boolean;
}

export class NavigationComponent extends React.Component<INavigationProps, INavigationState> {
  
  constructor(props: INavigationProps) {
    super(props);
    this.state = {
      isMobileMenuOpen: false
    };
  }

  /**
   * Encapsulated method to toggle mobile menu
   */
  private toggleMobileMenu = (): void => {
    this.setState(prevState => ({
      isMobileMenuOpen: !prevState.isMobileMenuOpen
    }));
  }

  /**
   * Encapsulated method to render brand section
   */
  private renderBrand(): React.ReactNode {
    const { config } = this.props;
    
    return (
      <div className="flex items-center space-x-2">
        {config.brand.logo}
        <span className="text-xl font-bold text-gray-900 dark:text-white">
          {config.brand.name}
        </span>
      </div>
    );
  }

  /**
   * Encapsulated method to render navigation menu items
   */
  private renderMenuItems(): React.ReactNode {
    const { config } = this.props;
    
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
      </div>
    );
  }

  /**
   * Encapsulated method to render authentication buttons
   */
  private renderAuthButtons(): React.ReactNode {
    const { onLoginClick, onRegisterClick } = this.props;
    
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
  }

  /**
   * Encapsulated method to render mobile menu toggle
   */
  private renderMobileMenuToggle(): React.ReactNode {
    return (
      <button
        onClick={this.toggleMobileMenu}
        className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    );
  }

  /**
   * Main render method
   */
  render() {
    const { isMobileMenuOpen } = this.state;
    
    return (
      <header className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <nav className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Brand */}
            {this.renderBrand()}
            
            {/* Desktop Menu */}
            {this.renderMenuItems()}
            
            {/* Auth Buttons - Top Right Corner */}
            <div className="hidden md:flex">
              {this.renderAuthButtons()}
            </div>
            
            {/* Mobile Menu Toggle */}
            {this.renderMobileMenuToggle()}
          </div>
          
          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col space-y-4">
                {this.props.config.menuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={item.onClick}
                    className="text-left text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                  >
                    {item.label}
                  </button>
                ))}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  {this.renderAuthButtons()}
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>
    );
  }
}

export default NavigationComponent;