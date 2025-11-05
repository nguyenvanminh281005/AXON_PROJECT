/**
 * ExpenseService
 * Service layer for Employee Expense Management
 * Following OOP principles with Single Responsibility
 */

import {
  ApprovalRequest,
  AttachedFile,
  CreateRequestDTO,
  UpdateRequestDTO,
  SubmitRequestDTO,
  RequestStatus,
  RequestType,
  User,
  UserRole,
} from '../types/approval.types';

/**
 * IExpenseService Interface
 * Định nghĩa contract cho Expense Service
 * Áp dụng Interface Segregation Principle
 */
export interface IExpenseService {
  // Create & Save
  createDraft(dto: CreateRequestDTO): Promise<ApprovalRequest>;
  saveDraft(dto: UpdateRequestDTO): Promise<ApprovalRequest>;
  
  // Submit
  submitRequest(dto: SubmitRequestDTO): Promise<ApprovalRequest>;
  
  // Update & Delete
  updateRequest(dto: UpdateRequestDTO): Promise<ApprovalRequest>;
  deleteRequest(requestId: string): Promise<boolean>;
  
  // File Management
  uploadAttachment(requestId: string, file: File): Promise<AttachedFile>;
  deleteAttachment(requestId: string, fileId: string): Promise<boolean>;
  
  // Fetch
  getMyRequests(userId: string): Promise<ApprovalRequest[]>;
  getRequestById(requestId: string): Promise<ApprovalRequest | null>;
  getDrafts(userId: string): Promise<ApprovalRequest[]>;
}

/**
 * ExpenseService Implementation
 * Concrete implementation của IExpenseService
 */
export class ExpenseService implements IExpenseService {
  private readonly baseUrl: string;

  constructor(baseUrl: string = '/api/expenses') {
    this.baseUrl = baseUrl;
  }

  /**
   * Create a new draft expense request
   */
  async createDraft(dto: CreateRequestDTO): Promise<ApprovalRequest> {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`${this.baseUrl}/draft`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(dto),
      // });
      // const data = await response.json();
      // return this.mapToApprovalRequest(data);

      // Mock implementation
      const mockRequest = this.createMockRequest(dto, RequestStatus.DRAFT);
      console.log('Created draft:', mockRequest);
      
      // Simulate API delay
      await this.delay(500);
      
      // Store in localStorage for demo
      this.storeRequest(mockRequest);
      
      return mockRequest;
    } catch (error) {
      console.error('Error creating draft:', error);
      throw new Error('Không thể tạo nháp yêu cầu');
    }
  }

  /**
   * Save existing draft
   */
  async saveDraft(dto: UpdateRequestDTO): Promise<ApprovalRequest> {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`${this.baseUrl}/draft/${dto.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(dto),
      // });
      // const data = await response.json();
      // return this.mapToApprovalRequest(data);

      // Mock implementation
      const existingRequest = await this.getRequestById(dto.id);
      if (!existingRequest) {
        throw new Error('Không tìm thấy yêu cầu');
      }

      if (!existingRequest.canEdit()) {
        throw new Error('Không thể chỉnh sửa yêu cầu này');
      }

      const updatedRequest = this.updateMockRequest(existingRequest, dto);
      console.log('Saved draft:', updatedRequest);
      
      await this.delay(500);
      this.storeRequest(updatedRequest);
      
      return updatedRequest;
    } catch (error) {
      console.error('Error saving draft:', error);
      throw error;
    }
  }

  /**
   * Submit request (Draft -> Pending)
   */
  async submitRequest(dto: SubmitRequestDTO): Promise<ApprovalRequest> {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`${this.baseUrl}/${dto.id}/submit`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(dto),
      // });
      // const data = await response.json();
      // return this.mapToApprovalRequest(data);

      // Mock implementation
      const existingRequest = await this.getRequestById(dto.id);
      if (!existingRequest) {
        throw new Error('Không tìm thấy yêu cầu');
      }

      if (!existingRequest.canSubmit()) {
        throw new Error('Không thể gửi yêu cầu này');
      }

      const submittedRequest = new ApprovalRequest(
        existingRequest.id,
        existingRequest.title,
        existingRequest.description,
        existingRequest.type,
        RequestStatus.PENDING,
        existingRequest.requester,
        existingRequest.amount,
        existingRequest.currency,
        existingRequest.attachedFiles,
        existingRequest.createdAt,
        new Date()
      );

      console.log('Submitted request:', submittedRequest);
      
      await this.delay(500);
      this.storeRequest(submittedRequest);
      
      return submittedRequest;
    } catch (error) {
      console.error('Error submitting request:', error);
      throw error;
    }
  }

  /**
   * Update existing request
   */
  async updateRequest(dto: UpdateRequestDTO): Promise<ApprovalRequest> {
    return this.saveDraft(dto);
  }

  /**
   * Delete request (only Draft)
   */
  async deleteRequest(requestId: string): Promise<boolean> {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`${this.baseUrl}/${requestId}`, {
      //   method: 'DELETE',
      // });
      // return response.ok;

      // Mock implementation
      const existingRequest = await this.getRequestById(requestId);
      if (!existingRequest) {
        throw new Error('Không tìm thấy yêu cầu');
      }

      if (!existingRequest.canDelete()) {
        throw new Error('Chỉ có thể xóa yêu cầu ở trạng thái Nháp');
      }

      console.log('Deleted request:', requestId);
      
      await this.delay(500);
      this.removeRequest(requestId);
      
      return true;
    } catch (error) {
      console.error('Error deleting request:', error);
      throw error;
    }
  }

  /**
   * Upload attachment to request
   */
  async uploadAttachment(requestId: string, file: File): Promise<AttachedFile> {
    try {
      // TODO: Replace with actual API call
      // const formData = new FormData();
      // formData.append('file', file);
      // const response = await fetch(`${this.baseUrl}/${requestId}/attachments`, {
      //   method: 'POST',
      //   body: formData,
      // });
      // const data = await response.json();
      // return this.mapToAttachedFile(data);

      // Mock implementation
      const attachedFile = new AttachedFile(
        `file_${Date.now()}`,
        file.name,
        URL.createObjectURL(file),
        file.size,
        file.type,
        new Date()
      );

      console.log('Uploaded attachment:', attachedFile);
      
      await this.delay(1000);
      
      return attachedFile;
    } catch (error) {
      console.error('Error uploading attachment:', error);
      throw new Error('Không thể tải lên file đính kèm');
    }
  }

  /**
   * Delete attachment from request
   */
  async deleteAttachment(requestId: string, fileId: string): Promise<boolean> {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`${this.baseUrl}/${requestId}/attachments/${fileId}`, {
      //   method: 'DELETE',
      // });
      // return response.ok;

      // Mock implementation
      console.log('Deleted attachment:', fileId);
      await this.delay(500);
      return true;
    } catch (error) {
      console.error('Error deleting attachment:', error);
      throw new Error('Không thể xóa file đính kèm');
    }
  }

  /**
   * Get all requests by user
   */
  async getMyRequests(userId: string): Promise<ApprovalRequest[]> {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`${this.baseUrl}/my-requests?userId=${userId}`);
      // const data = await response.json();
      // return data.map(this.mapToApprovalRequest);

      // Mock implementation
      await this.delay(500);
      const requests = this.getStoredRequests();
      return requests.filter(r => r.requester.id === userId);
    } catch (error) {
      console.error('Error fetching my requests:', error);
      throw new Error('Không thể tải danh sách yêu cầu');
    }
  }

  /**
   * Get request by ID
   */
  async getRequestById(requestId: string): Promise<ApprovalRequest | null> {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`${this.baseUrl}/${requestId}`);
      // const data = await response.json();
      // return this.mapToApprovalRequest(data);

      // Mock implementation
      await this.delay(300);
      const requests = this.getStoredRequests();
      return requests.find(r => r.id === requestId) || null;
    } catch (error) {
      console.error('Error fetching request:', error);
      return null;
    }
  }

  /**
   * Get draft requests
   */
  async getDrafts(userId: string): Promise<ApprovalRequest[]> {
    try {
      const requests = await this.getMyRequests(userId);
      return requests.filter(r => r.isDraft());
    } catch (error) {
      console.error('Error fetching drafts:', error);
      throw new Error('Không thể tải danh sách nháp');
    }
  }

  // ========== Private Helper Methods ==========

  /**
   * Create mock request for demo purposes
   */
  private createMockRequest(dto: CreateRequestDTO, status: RequestStatus): ApprovalRequest {
    const requester = new User(
      dto.requesterId,
      'Current User',
      'user@example.com',
      UserRole.EMPLOYEE
    );

    return new ApprovalRequest(
      `req_${Date.now()}`,
      dto.title,
      dto.description,
      dto.type,
      status,
      requester,
      dto.amount,
      dto.currency || 'VND',
      [],
      new Date(),
      new Date()
    );
  }

  /**
   * Update mock request
   */
  private updateMockRequest(existing: ApprovalRequest, dto: UpdateRequestDTO): ApprovalRequest {
    return new ApprovalRequest(
      existing.id,
      dto.title || existing.title,
      dto.description || existing.description,
      existing.type,
      existing.status,
      existing.requester,
      dto.amount !== undefined ? dto.amount : existing.amount,
      dto.currency || existing.currency,
      existing.attachedFiles,
      existing.createdAt,
      new Date()
    );
  }

  /**
   * Store request in localStorage
   */
  private storeRequest(request: ApprovalRequest): void {
    const requests = this.getStoredRequests();
    const index = requests.findIndex(r => r.id === request.id);
    
    if (index >= 0) {
      requests[index] = request;
    } else {
      requests.push(request);
    }
    
    localStorage.setItem('expense_requests', JSON.stringify(requests));
  }

  /**
   * Remove request from localStorage
   */
  private removeRequest(requestId: string): void {
    const requests = this.getStoredRequests();
    const filtered = requests.filter(r => r.id !== requestId);
    localStorage.setItem('expense_requests', JSON.stringify(filtered));
  }

  /**
   * Get stored requests from localStorage
   */
  private getStoredRequests(): ApprovalRequest[] {
    try {
      const stored = localStorage.getItem('expense_requests');
      if (!stored) return [];
      
      const data = JSON.parse(stored);
      return data.map((item: any) => new ApprovalRequest(
        item.id,
        item.title,
        item.description,
        item.type,
        item.status,
        new User(item.requester.id, item.requester.name, item.requester.email, item.requester.role),
        item.amount,
        item.currency,
        item.attachedFiles || [],
        new Date(item.createdAt),
        new Date(item.updatedAt),
        item.approvedBy ? new User(item.approvedBy.id, item.approvedBy.name, item.approvedBy.email, item.approvedBy.role) : undefined,
        item.approvedAt ? new Date(item.approvedAt) : undefined,
        item.rejectedBy ? new User(item.rejectedBy.id, item.rejectedBy.name, item.rejectedBy.email, item.rejectedBy.role) : undefined,
        item.rejectedAt ? new Date(item.rejectedAt) : undefined,
        item.rejectionReason
      ));
    } catch (error) {
      console.error('Error parsing stored requests:', error);
      return [];
    }
  }

  /**
   * Simulate async delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Singleton instance
 * Factory Pattern - single instance throughout the app
 */
export const expenseService = new ExpenseService();

export default ExpenseService;
