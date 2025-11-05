import { useState, useCallback } from 'react';
import { ModalType } from '../types/modal';

/**
 * ModalManager Hook - Manages modal state and interactions
 * Follows Single Responsibility Principle: Only handles modal state management
 * Implements Observer Pattern through React state management
 */
export const useModalManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(null);

  // Public methods following encapsulation principle
  const openModal = useCallback((type: ModalType) => {
    setModalType(type);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setModalType(null);
  }, []);

  const openLoginModal = useCallback(() => {
    openModal('login');
  }, [openModal]);

  const openRegisterModal = useCallback(() => {
    openModal('register');
  }, [openModal]);

  const openForgotPasswordModal = useCallback(() => {
    openModal('forgot-password');
  }, [openModal]);

  return {
    // State properties (read-only)
    isModalOpen,
    modalType,
    
    // Action methods
    openModal,
    closeModal,
    openLoginModal,
    openRegisterModal,
    openForgotPasswordModal
  };
};