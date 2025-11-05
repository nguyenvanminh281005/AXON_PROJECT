/**
 * FileUploader Component
 * Reusable file upload component with drag & drop
 * Following OOP principles with encapsulation
 */

'use client';

import React, { useRef, useState } from 'react';
import { AttachedFile } from '@/app/shared/types/approval.types';
import themeConfig from '@/app/config/theme.config';

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  existingFiles?: AttachedFile[];
  onFileDelete?: (fileId: string) => void;
  disabled?: boolean;
  maxFiles?: number;
  maxSizeMB?: number;
  acceptedTypes?: string[];
}

/**
 * FileUploader Component
 */
export const FileUploader: React.FC<FileUploaderProps> = ({
  onFilesSelected,
  existingFiles = [],
  onFileDelete,
  disabled = false,
  maxFiles = 5,
  maxSizeMB = 10,
  acceptedTypes = ['image/*', 'application/pdf', '.doc', '.docx', '.xls', '.xlsx'],
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>('');

  /**
   * Validate files
   */
  const validateFiles = (files: File[]): { valid: File[]; error?: string } => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    // Check total files
    if (existingFiles.length + files.length > maxFiles) {
      return {
        valid: [],
        error: `Tối đa ${maxFiles} file`,
      };
    }

    // Check file sizes
    const oversizedFiles = files.filter(f => f.size > maxSizeBytes);
    if (oversizedFiles.length > 0) {
      return {
        valid: [],
        error: `Kích thước file không được vượt quá ${maxSizeMB}MB`,
      };
    }

    return { valid: files };
  };

  /**
   * Handle file selection
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
  };

  /**
   * Process selected files
   */
  const processFiles = (files: File[]) => {
    setError('');
    
    const { valid, error: validationError } = validateFiles(files);
    
    if (validationError) {
      setError(validationError);
      return;
    }

    if (valid.length > 0) {
      onFilesSelected(valid);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Handle drag events
   */
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  /**
   * Handle click to browse
   */
  const handleBrowseClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  /**
   * Get file icon based on type
   */
  const getFileIcon = (file: AttachedFile): string => {
    if (file.type.startsWith('image/')) return '🖼️';
    if (file.type === 'application/pdf') return '📄';
    if (file.type.includes('word')) return '📝';
    if (file.type.includes('excel') || file.type.includes('spreadsheet')) return '📊';
    return '📎';
  };

  return (
    <div className={themeConfig.spacing.normal}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        File đính kèm
      </label>

      {/* Upload Area */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-blue-400'}
        `}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />

        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <p className="mt-2 text-sm text-gray-600">
          <span className="font-semibold text-blue-600">Chọn file</span> hoặc kéo thả vào đây
        </p>
        <p className="mt-1 text-xs text-gray-500">
          PDF, Word, Excel, Hình ảnh (Tối đa {maxSizeMB}MB)
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className={`mt-2 ${themeConfig.components.alert.error}`}>
          {error}
        </div>
      )}

      {/* Existing Files List */}
      {existingFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Đã đính kèm ({existingFiles.length}/{maxFiles})
          </p>
          {existingFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <span className="text-2xl">{getFileIcon(file)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {file.getFormattedSize()}
                  </p>
                </div>
              </div>
              {onFileDelete && !disabled && (
                <button
                  type="button"
                  onClick={() => onFileDelete(file.id)}
                  className="ml-3 p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Xóa file"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
