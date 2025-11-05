/**
 * useAuthModal Hook
 * Wrapper hook for managing authentication modals from AppHeader
 * Following Single Responsibility Principle
 */

import { useModalManager } from './useModalManager';

export const useAuthModal = () => {
  const modalManager = useModalManager();

  return {
    openLoginModal: modalManager.openLoginModal,
    openRegisterModal: modalManager.openRegisterModal,
    isModalOpen: modalManager.isModalOpen,
    modalType: modalManager.modalType,
    closeModal: modalManager.closeModal,
  };
};

export default useAuthModal;
