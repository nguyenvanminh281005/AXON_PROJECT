// Modal-related interfaces and types
export interface IModalState {
  isOpen: boolean;
  modalType: ModalType;
  onClose: () => void;
}

export type ModalType = 'login' | 'register' | 'forgot-password' | null;

export interface IAuthFormProps {
  onSwitchToLogin: () => void;
  onSwitchToRegister: () => void;
  onSwitchToForgotPassword: () => void;
  onClose: () => void;
}

export interface IAuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
}

export interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg';
}