/**
 * Validation Layer - Strategy Pattern
 * Interface và implementation cho các validation rules
 */

import { ApprovalActionDTO } from '../types/approval.types';

/**
 * Interface: IValidationRule
 * Contract cho tất cả validation rules
 * Áp dụng Strategy Pattern để dễ dàng thêm/bớt rules
 */
export interface IValidationRule<T = any> {
  validate(data: T): ValidationResult;
  getRuleName(): string;
}

/**
 * Validation Result
 */
export class ValidationResult {
  constructor(
    public readonly isValid: boolean,
    public readonly errorMessage?: string
  ) {}

  static success(): ValidationResult {
    return new ValidationResult(true);
  }

  static failure(message: string): ValidationResult {
    return new ValidationResult(false, message);
  }
}

/**
 * Rule: Rejection Reason Required
 * Validate rằng lý do từ chối là bắt buộc
 */
export class RejectionReasonRequiredRule implements IValidationRule<string | undefined> {
  validate(reason: string | undefined): ValidationResult {
    if (!reason || reason.trim().length === 0) {
      return ValidationResult.failure('Lý do từ chối là bắt buộc');
    }

    if (reason.trim().length < 10) {
      return ValidationResult.failure('Lý do từ chối phải có ít nhất 10 ký tự');
    }

    return ValidationResult.success();
  }

  getRuleName(): string {
    return 'RejectionReasonRequiredRule';
  }
}

/**
 * Rule: Required Fields
 * Validate các field bắt buộc
 */
export class RequiredFieldsRule implements IValidationRule<ApprovalActionDTO> {
  validate(data: ApprovalActionDTO): ValidationResult {
    if (!data.requestId) {
      return ValidationResult.failure('Request ID là bắt buộc');
    }

    if (!data.actionBy) {
      return ValidationResult.failure('Thông tin người thực hiện là bắt buộc');
    }

    return ValidationResult.success();
  }

  getRuleName(): string {
    return 'RequiredFieldsRule';
  }
}

/**
 * Rule: User Permission
 * Validate quyền của user
 */
export class UserPermissionRule implements IValidationRule<{ canApprove: boolean }> {
  validate(data: { canApprove: boolean }): ValidationResult {
    if (!data.canApprove) {
      return ValidationResult.failure('Bạn không có quyền phê duyệt yêu cầu này');
    }

    return ValidationResult.success();
  }

  getRuleName(): string {
    return 'UserPermissionRule';
  }
}

/**
 * Validator Class - Chain of Responsibility Pattern
 * Thực thi một chuỗi các validation rules
 */
export class Validator<T = any> {
  private rules: IValidationRule<T>[] = [];

  /**
   * Thêm một rule vào validator
   */
  addRule(rule: IValidationRule<T>): Validator<T> {
    this.rules.push(rule);
    return this; // Method chaining
  }

  /**
   * Thêm nhiều rules cùng lúc
   */
  addRules(rules: IValidationRule<T>[]): Validator<T> {
    this.rules.push(...rules);
    return this;
  }

  /**
   * Thực thi tất cả các rules
   * Dừng ngay khi gặp rule đầu tiên fail
   */
  validate(data: T): ValidationResult {
    for (const rule of this.rules) {
      const result = rule.validate(data);
      if (!result.isValid) {
        return result;
      }
    }
    return ValidationResult.success();
  }

  /**
   * Thực thi tất cả các rules và trả về tất cả errors
   */
  validateAll(data: T): ValidationResult[] {
    return this.rules.map(rule => rule.validate(data));
  }

  /**
   * Clear tất cả rules
   */
  clear(): void {
    this.rules = [];
  }
}
