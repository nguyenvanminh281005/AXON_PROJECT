import React from 'react';
import { IButtonProps } from '../../types/component.types';

/**
 * Reusable Button Component - Following OOP Principles
 * 
 * Single Responsibility: Handles button rendering and styling
 * Open/Closed: Can be extended with new variants without modification
 * Polymorphism: Different variants implement the same interface
 */
export class ButtonComponent extends React.Component<IButtonProps> {
  
  /**
   * Encapsulated method to generate variant-specific styles
   * This follows the Strategy Pattern for style selection
   */
  private getVariantStyles(): string {
    const { variant = 'primary' } = this.props;
    
    const styles = {
      primary: 'bg-[#42A7C3] hover:bg-[#328fa5] text-white shadow-lg hover:shadow-xl',
      secondary: 'bg-gray-600 hover:bg-gray-700 text-white shadow-lg hover:shadow-xl',
      outline: 'bg-[#B7E9F6] hover:bg-[#42A7C3] text-[#42A7C3] border-2 border-[#42A7C3] hover:text-white hover:border-[#328fa5]'
    };
    
    return styles[variant];
  }

  /**
   * Encapsulated method to generate size-specific styles
   */
  private getSizeStyles(): string {
    const { size = 'md' } = this.props;
    
    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg'
    };
    
    return sizes[size];
  }

  /**
   * Main render method - combines all styling logic
   */
  render() {
    const { 
      children, 
      onClick, 
      disabled = false, 
      className = '', 
      type = 'button' 
    } = this.props;

    const baseStyles = 'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#42A7C3] focus:ring-offset-2';
    const variantStyles = this.getVariantStyles();
    const sizeStyles = this.getSizeStyles();
    const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
    
    const combinedStyles = `${baseStyles} ${variantStyles} ${sizeStyles} ${disabledStyles} ${className}`.trim();

    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={combinedStyles}
      >
        {children}
      </button>
    );
  }
}

// Export as default for easier imports
export default ButtonComponent;