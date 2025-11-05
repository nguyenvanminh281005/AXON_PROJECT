/**
 * Approval System Types
 * Định nghĩa các entity và type cho hệ thống phê duyệt
 */

/**
 * Enum trạng thái yêu cầu
 */
export enum RequestStatus {
  DRAFT = 'DRAFT', // Nháp - chưa gửi
  PENDING = 'PENDING', // Chờ phê duyệt
  APPROVED = 'APPROVED', // Đã phê duyệt
  REJECTED = 'REJECTED', // Bị từ chối
  FORWARDED = 'FORWARDED', // Chuyển tiếp cho tài chính
}

/**
 * Enum loại yêu cầu
 */
export enum RequestType {
  EXPENSE = 'EXPENSE',
  LEAVE = 'LEAVE',
  PURCHASE = 'PURCHASE',
  OTHER = 'OTHER',
}

/**
 * Enum vai trò người dùng
 */
export enum UserRole {
  EMPLOYEE = 'EMPLOYEE',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN',
  FINANCE = 'FINANCE',
}

/**
 * Entity: User
 * Đại diện cho người dùng trong hệ thống
 */
export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly role: UserRole,
    public readonly department?: string,
    public readonly avatar?: string
  ) {}

  /**
   * Kiểm tra user có quyền phê duyệt không
   */
  canApprove(): boolean {
    return this.role === UserRole.MANAGER || this.role === UserRole.ADMIN;
  }

  /**
   * Kiểm tra user có phải là Finance không
   */
  isFinance(): boolean {
    return this.role === UserRole.FINANCE;
  }
}

/**
 * Entity: AttachedFile
 * Đại diện cho file đính kèm
 */
export class AttachedFile {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly url: string,
    public readonly size: number,
    public readonly type: string,
    public readonly uploadedAt: Date
  ) {}

  /**
   * Format kích thước file
   */
  getFormattedSize(): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = this.size;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }
}

/**
 * Entity: ApprovalRequest
 * Đại diện cho một yêu cầu phê duyệt
 */
export class ApprovalRequest {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly type: RequestType,
    public readonly status: RequestStatus,
    public readonly requester: User,
    public readonly amount?: number,
    public readonly currency?: string,
    public readonly attachedFiles: AttachedFile[] = [],
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
    public readonly approvedBy?: User,
    public readonly approvedAt?: Date,
    public readonly rejectedBy?: User,
    public readonly rejectedAt?: Date,
    public readonly rejectionReason?: string
  ) {}

  /**
   * Kiểm tra yêu cầu có đang ở trạng thái nháp không
   */
  isDraft(): boolean {
    return this.status === RequestStatus.DRAFT;
  }

  /**
   * Kiểm tra yêu cầu có đang chờ phê duyệt không
   */
  isPending(): boolean {
    return this.status === RequestStatus.PENDING;
  }

  /**
   * Kiểm tra yêu cầu đã được phê duyệt chưa
   */
  isApproved(): boolean {
    return this.status === RequestStatus.APPROVED || this.status === RequestStatus.FORWARDED;
  }

  /**
   * Kiểm tra yêu cầu đã bị từ chối chưa
   */
  isRejected(): boolean {
    return this.status === RequestStatus.REJECTED;
  }

  /**
   * Kiểm tra có thể chỉnh sửa được không (Draft hoặc Rejected)
   */
  canEdit(): boolean {
    return this.isDraft() || this.isRejected();
  }

  /**
   * Kiểm tra có thể xóa được không (chỉ Draft)
   */
  canDelete(): boolean {
    return this.isDraft();
  }

  /**
   * Kiểm tra có thể gửi được không (Draft)
   */
  canSubmit(): boolean {
    return this.isDraft();
  }

  /**
   * Format số tiền
   */
  getFormattedAmount(): string {
    if (!this.amount) return 'N/A';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: this.currency || 'VND',
    }).format(this.amount);
  }

  /**
   * Lấy thông tin người xử lý cuối cùng
   */
  getLastProcessor(): User | undefined {
    return this.approvedBy || this.rejectedBy;
  }
}

/**
 * DTO: ApprovalActionDTO
 * Data Transfer Object cho action phê duyệt/từ chối
 */
export interface ApprovalActionDTO {
  requestId: string;
  actionBy: User;
  reason?: string; // Required for rejection
}

/**
 * DTO: CreateRequestDTO
 * Data Transfer Object cho việc Tạo yêu cầu mới
 */
export interface CreateRequestDTO {
  title: string;
  description: string;
  type: RequestType;
  requesterId: string;
  amount?: number;
  currency?: string;
  files?: File[];
}

/**
 * DTO: UpdateRequestDTO
 * Data Transfer Object cho việc cập nhật yêu cầu
 */
export interface UpdateRequestDTO {
  id: string;
  title?: string;
  description?: string;
  amount?: number;
  currency?: string;
  files?: File[];
}

/**
 * DTO: SubmitRequestDTO
 * Data Transfer Object cho việc gửi yêu cầu (từ Draft -> Pending)
 */
export interface SubmitRequestDTO {
  id: string;
  requesterId: string;
}
