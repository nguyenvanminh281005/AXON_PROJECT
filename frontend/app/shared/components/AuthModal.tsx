import React, { useState } from 'react';
import { Modal } from './Modal';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { ModalType, IModalState } from '../types/modal';

interface IAuthModalProps {
  isOpen: boolean;
  initialType: ModalType;
  onClose: () => void;
}

/**
 * AuthModal Component - Manages authentication modal with multiple forms
 * Implements Strategy Pattern for different authentication types
 * Follows Single Responsibility Principle: Only handles auth modal logic
 */
export const AuthModal: React.FC<IAuthModalProps> = ({
  isOpen,
  initialType,
  onClose
}) => {
  const [currentType, setCurrentType] = useState<ModalType>(initialType);

  // Strategy Pattern: Different handlers for different auth types
  const authHandlers = {
    onSwitchToLogin: () => setCurrentType('login'),
    onSwitchToRegister: () => setCurrentType('register'),
    onSwitchToForgotPassword: () => setCurrentType('forgot-password'),
    onClose
  };

  // Strategy Pattern: Form configuration based on type
  const getModalConfig = () => {
    switch (currentType) {
      case 'login':
        return {
          title: 'Welcome Back',
          component: <LoginForm {...authHandlers} />
        };
      case 'register':
        return {
          title: 'Create Account',
          component: <RegisterForm {...authHandlers} />
        };
      case 'forgot-password':
        return {
          title: 'Reset Password',
          component: <ForgotPasswordForm {...authHandlers} />
        };
      default:
        return {
          title: 'Authentication',
          component: <LoginForm {...authHandlers} />
        };
    }
  };

  const config = getModalConfig();

  // Update current type when initialType changes
  React.useEffect(() => {
    if (isOpen && initialType !== currentType) {
      setCurrentType(initialType);
    }
  }, [isOpen, initialType, currentType]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={config.title}
      maxWidth="md"
    >
      {config.component}
    </Modal>
  );
};