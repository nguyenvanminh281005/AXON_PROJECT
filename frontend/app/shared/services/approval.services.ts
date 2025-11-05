/**
 * Services Layer - Business Logic
 * Xử lý tất cả business logic cho approval system
 */

import {
  ApprovalRequest,
  RequestStatus,
  User,
  ApprovalActionDTO,
  AttachedFile,
  UserRole,
  RequestType,
} from '../types/approval.types';
import {
  Validator,
  RequiredFieldsRule,
  RejectionReasonRequiredRule,
  UserPermissionRule,
  ValidationResult,
} from '../validators/approval.validators';

/**
 * Service: ApprovalService
 * Xử lý logic phê duyệt và từ chối yêu cầu
 * Áp dụng Single Responsibility Principle
 */
export class ApprovalService {
  private rejectionValidator: Validator<string | undefined>;
  private actionValidator: Validator<ApprovalActionDTO>;

  constructor() {
    // Khởi tạo validators
    this.rejectionValidator = new Validator<string | undefined>()
      .addRule(new RejectionReasonRequiredRule());

    this.actionValidator = new Validator<ApprovalActionDTO>()
      .addRule(new RequiredFieldsRule());
  }

  /**
   * Phê duyệt yêu cầu
   * @throws Error nếu validation fail
   */
  async approveRequest(
    request: ApprovalRequest,
    actionData: ApprovalActionDTO
  ): Promise<ApprovalRequest> {
    // Validate action data
    const validationResult = this.actionValidator.validate(actionData);
    if (!validationResult.isValid) {
      throw new Error(validationResult.errorMessage);
    }

    // Validate user permission
    const permissionResult = new UserPermissionRule().validate({
      canApprove: actionData.actionBy.canApprove(),
    });
    if (!permissionResult.isValid) {
      throw new Error(permissionResult.errorMessage);
    }

    // Validate request status
    if (!request.isPending()) {
      throw new Error('Chỉ có thể phê duyệt yêu cầu đang chờ duyệt');
    }

    // Create new request with updated status
    return new ApprovalRequest(
      request.id,
      request.title,
      request.description,
      request.type,
      RequestStatus.APPROVED,
      request.requester,
      request.amount,
      request.currency,
      request.attachedFiles,
      request.createdAt,
      new Date(),
      actionData.actionBy,
      new Date(),
      undefined,
      undefined,
      undefined
    );
  }

  /**
   * Từ chối yêu cầu
   * @throws Error nếu validation fail
   */
  async rejectRequest(
    request: ApprovalRequest,
    actionData: ApprovalActionDTO
  ): Promise<ApprovalRequest> {
    // Validate action data
    const validationResult = this.actionValidator.validate(actionData);
    if (!validationResult.isValid) {
      throw new Error(validationResult.errorMessage);
    }

    // Validate rejection reason
    const reasonResult = this.rejectionValidator.validate(actionData.reason);
    if (!reasonResult.isValid) {
      throw new Error(reasonResult.errorMessage);
    }

    // Validate user permission
    const permissionResult = new UserPermissionRule().validate({
      canApprove: actionData.actionBy.canApprove(),
    });
    if (!permissionResult.isValid) {
      throw new Error(permissionResult.errorMessage);
    }

    // Validate request status
    if (!request.isPending()) {
      throw new Error('Chỉ có thể từ chối yêu cầu đang chờ duyệt');
    }

    // Create new request with rejected status
    return new ApprovalRequest(
      request.id,
      request.title,
      request.description,
      request.type,
      RequestStatus.REJECTED,
      request.requester,
      request.amount,
      request.currency,
      request.attachedFiles,
      request.createdAt,
      new Date(),
      undefined,
      undefined,
      actionData.actionBy,
      new Date(),
      actionData.reason
    );
  }

  /**
   * Chuyển tiếp yêu cầu cho bộ phận Tài chính
   * @throws Error nếu validation fail
   */
  async forwardToFinance(
    request: ApprovalRequest,
    actionData: ApprovalActionDTO
  ): Promise<ApprovalRequest> {
    // Validate action data
    const validationResult = this.actionValidator.validate(actionData);
    if (!validationResult.isValid) {
      throw new Error(validationResult.errorMessage);
    }

    // Validate user permission
    const permissionResult = new UserPermissionRule().validate({
      canApprove: actionData.actionBy.canApprove(),
    });
    if (!permissionResult.isValid) {
      throw new Error(permissionResult.errorMessage);
    }

    // Validate request status
    if (!request.isPending()) {
      throw new Error('Chỉ có thể chuyển tiếp yêu cầu đang chờ duyệt');
    }

    // Create new request with forwarded status
    return new ApprovalRequest(
      request.id,
      request.title,
      request.description,
      request.type,
      RequestStatus.FORWARDED,
      request.requester,
      request.amount,
      request.currency,
      request.attachedFiles,
      request.createdAt,
      new Date(),
      actionData.actionBy,
      new Date(),
      undefined,
      undefined,
      undefined
    );
  }
}

/**
 * Service: RequestService
 * Xử lý CRUD operations cho requests
 */
export class RequestService {
  /**
   * Lấy tất cả yêu cầu đang chờ phê duyệt
   * TODO: Integrate với backend API
   */
  async getPendingRequests(): Promise<ApprovalRequest[]> {
    // Mock data - sẽ thay bằng API call thực tế
    return this.getMockRequests().filter(r => r.isPending());
  }

  /**
   * Lấy yêu cầu theo ID
   */
  async getRequestById(id: string): Promise<ApprovalRequest | null> {
    // Mock data - sẽ thay bằng API call thực tế
    const requests = this.getMockRequests();
    return requests.find(r => r.id === id) || null;
  }

  /**
   * Lấy tất cả yêu cầu
   */
  async getAllRequests(): Promise<ApprovalRequest[]> {
    // Mock data - sẽ thay bằng API call thực tế
    return this.getMockRequests();
  }

  /**
   * Mock data để test
   * TODO: Xóa khi integrate với backend
   */
  private getMockRequests(): ApprovalRequest[] {
    const user1 = new User('1', 'Nguyễn Văn A', 'nguyenvana@example.com', UserRole.EMPLOYEE, 'IT');
    const user2 = new User('2', 'Trần Thị B', 'tranthib@example.com', UserRole.EMPLOYEE, 'Marketing');
    
    const file1 = new AttachedFile(
      'f1',
      'invoice.pdf',
      '/files/invoice.pdf',
      1024000,
      'application/pdf',
      new Date('2025-11-01')
    );

    return [
      new ApprovalRequest(
        'req-1',
        'Yêu cầu chi phí đi công tác Hà Nội',
        'Chi phí vé máy bay và khách sạn 3 ngày tại Hà Nội để gặp khách hàng',
        RequestType.EXPENSE,
        RequestStatus.PENDING,
        user1,
        15000000,
        'VND',
        [file1],
        new Date('2025-11-03'),
        new Date('2025-11-03')
      ),
      new ApprovalRequest(
        'req-2',
        'Mua thiết bị văn phòng',
        'Mua 2 màn hình Dell 27 inch cho phòng thiết kế',
        RequestType.PURCHASE,
        RequestStatus.PENDING,
        user2,
        12000000,
        'VND',
        [],
        new Date('2025-11-02'),
        new Date('2025-11-02')
      ),
    ];
  }
}

/**
 * Service: FileService
 * Xử lý file đính kèm
 */
export class FileService {
  /**
   * Download file
   */
  async downloadFile(file: AttachedFile): Promise<void> {
    // TODO: Implement actual download logic
    window.open(file.url, '_blank');
  }

  /**
   * Validate file type và size
   */
  validateFile(file: File, maxSizeMB: number = 10): ValidationResult {
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    if (!allowedTypes.includes(file.type)) {
      return ValidationResult.failure(
        'File không đúng định dạng. Chỉ chấp nhận PDF, JPEG, PNG, Excel'
      );
    }

    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
      return ValidationResult.failure(`File vượt quá ${maxSizeMB}MB`);
    }

    return ValidationResult.success();
  }
}
