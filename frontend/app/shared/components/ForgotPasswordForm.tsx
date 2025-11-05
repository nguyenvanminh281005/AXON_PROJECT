import React, { useState } from 'react';
import { IAuthFormProps } from '../types/modal';
import Button from '../../components/shared/Button';

/**
 * Forgot Password Form Component - Handles password reset
 * Follows Single Responsibility Principle
 */
export const ForgotPasswordForm: React.FC<IAuthFormProps> = ({
  onSwitchToLogin,
  onClose
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Implement actual password reset logic
    console.log('Password reset request for:', email);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Reset Link Sent!
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          We've sent a password reset link to <strong>{email}</strong>. 
          Please check your email and follow the instructions to reset your password.
        </p>
        <Button
          variant="secondary"
          size="lg"
          className="w-full"
          onClick={onSwitchToLogin}
        >
          Back to Login
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-6">
        <p className="text-gray-600 dark:text-gray-400">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <div>
        <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email Address
        </label>
        <input
          type="email"
          id="resetEmail"
          name="resetEmail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="Enter your email address"
        />
      </div>

      <Button
        variant="primary"
        size="lg"
        className="w-full"
        type="submit"
      >
        Send Reset Link
      </Button>

      <div className="text-center">
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
        >
          ← Back to Login
        </button>
      </div>
    </form>
  );
};