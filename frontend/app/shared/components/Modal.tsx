import React from 'react';
import { IModalProps } from '../types/modal';

/**
 * Base Modal Component - Reusable modal foundation
 * Follows Single Responsibility Principle: Only handles modal display logic
 */
export class BaseModal extends React.Component<IModalProps> {
  constructor(props: IModalProps) {
    super(props);
    this.handleBackdropClick = this.handleBackdropClick.bind(this);
    this.handleEscapeKey = this.handleEscapeKey.bind(this);
  }

  componentDidMount(): void {
    if (this.props.isOpen) {
      document.addEventListener('keydown', this.handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }
  }

  componentDidUpdate(prevProps: IModalProps): void {
    if (this.props.isOpen !== prevProps.isOpen) {
      if (this.props.isOpen) {
        document.addEventListener('keydown', this.handleEscapeKey);
        document.body.style.overflow = 'hidden';
      } else {
        document.removeEventListener('keydown', this.handleEscapeKey);
        document.body.style.overflow = 'unset';
      }
    }
  }

  componentWillUnmount(): void {
    document.removeEventListener('keydown', this.handleEscapeKey);
    document.body.style.overflow = 'unset';
  }

  private handleBackdropClick(e: React.MouseEvent): void {
    if (e.target === e.currentTarget) {
      this.props.onClose();
    }
  }

  private handleEscapeKey(e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      this.props.onClose();
    }
  }

  private getMaxWidthClass(): string {
    const { maxWidth = 'md' } = this.props;
    const widthClasses = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg'
    };
    return widthClasses[maxWidth];
  }

  render(): React.ReactNode {
    if (!this.props.isOpen) return null;

    const { title, children, onClose } = this.props;

    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 py-10 bg-black/30 backdrop-blur-sm"
        onClick={this.handleBackdropClick}
      >
        <div
          className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-xl w-full sm:w-auto ${this.getMaxWidthClass()} transform transition-all flex flex-col`}
          style={{ width: '100%', maxWidth: '36rem', maxHeight: '90vh' }}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Modal Content chỉ nội dung này cuộn */}
          <div className="flex-1 overflow-y-auto p-6">
            {children}
          </div>
        </div>
      </div>
    );
  }
}

// Functional component wrapper for easier usage
export const Modal: React.FC<IModalProps> = (props) => {
  return <BaseModal {...props} />;
};