/**
 * ExpenseForm Component
 * Form for creating/editing expense requests
 * Following OOP principles with encapsulation and reusability
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  ApprovalRequest,
  CreateRequestDTO,
  UpdateRequestDTO,
  RequestType,
  AttachedFile,
} from '@/app/shared/types/approval.types';
import themeConfig from '@/app/config/theme.config';
import { FileUploader } from '@/app/components/user/FileUploader';

interface ExpenseFormProps {
  initialData?: ApprovalRequest;
  onSubmit: (data: any) => Promise<void>; // Accept both CreateRequestDTO and UpdateRequestDTO
  onCancel: () => void;
  isSubmitting?: boolean;
  mode: 'create' | 'edit';
}

/**
 * ExpenseForm Component
 */
export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  mode,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<RequestType>(RequestType.EXPENSE);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with existing data if editing
  useEffect(() => {
    if (initialData && mode === 'edit') {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setAmount(initialData.amount?.toString() || '');
      setType(initialData.type);
      setAttachedFiles(initialData.attachedFiles);
    }
  }, [initialData, mode]);

  /**
   * Validate form data
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Vui lòng nhập tiêu đề';
    }

    if (!description.trim()) {
      newErrors.description = 'Vui lòng nhập mô tả';
    }

    if (amount && isNaN(parseFloat(amount))) {
      newErrors.amount = 'Số tiền không hợp lệ';
    }

    if (amount && parseFloat(amount) <= 0) {
      newErrors.amount = 'Số tiền phải lớn hơn 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = mode === 'create'
      ? {
          title: title.trim(),
          description: description.trim(),
          type,
          requesterId: 'current-user-id', // TODO: Get from auth context
          amount: amount ? parseFloat(amount) : undefined,
          currency: 'VND',
        }
      : {
          id: initialData!.id,
          title: title.trim(),
          description: description.trim(),
          amount: amount ? parseFloat(amount) : undefined,
          currency: 'VND',
        };

    await onSubmit(formData);
  };

  /**
   * Handle file upload
   */
  const handleFileUpload = (files: File[]) => {
    // TODO: Upload files and get AttachedFile objects
    console.log('Files to upload:', files);
  };

  /**
   * Handle file delete
   */
  const handleFileDelete = (fileId: string) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  return (
    <form onSubmit={handleSubmit} className={themeConfig.spacing.normal}>
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Tiêu đề <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`${themeConfig.components.input.base} ${errors.title ? themeConfig.components.input.error : ''}`}
          placeholder="Nhập tiêu đề yêu cầu"
          disabled={isSubmitting}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      {/* Type */}
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
          Loại yêu cầu <span className="text-red-500">*</span>
        </label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value as RequestType)}
          className={themeConfig.components.input.base}
          disabled={isSubmitting}
        >
          <option value={RequestType.EXPENSE}>Chi phí</option>
          <option value={RequestType.LEAVE}>Nghỉ phép</option>
          <option value={RequestType.PURCHASE}>Mua sắm</option>
          <option value={RequestType.OTHER}>Khác</option>
        </select>
      </div>

      {/* Amount */}
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
          Số tiền (VND)
        </label>
        <input
          id="amount"
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={`${themeConfig.components.input.base} ${errors.amount ? themeConfig.components.input.error : ''}`}
          placeholder="Nhập số tiền"
          disabled={isSubmitting}
        />
        {errors.amount && (
          <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Mô tả <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className={`${themeConfig.components.input.base} ${errors.description ? themeConfig.components.input.error : ''}`}
          placeholder="Nhập mô tả chi tiết"
          disabled={isSubmitting}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      {/* File Uploader */}
      <FileUploader
        onFilesSelected={handleFileUpload}
        existingFiles={attachedFiles}
        onFileDelete={handleFileDelete}
        disabled={isSubmitting}
      />

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className={themeConfig.components.button.secondary}
          disabled={isSubmitting}
        >
          Hủy
        </button>
        <button
          type="submit"
          className={themeConfig.components.button.primary}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang lưu...
            </>
          ) : (
            mode === 'create' ? 'Tạo yêu cầu' : 'Cập nhật'
          )}
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;
