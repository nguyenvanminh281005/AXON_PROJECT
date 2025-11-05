/**
 * Authentication Service
 * Xử lý authentication logic với Strategy Pattern
 */

import { User, UserRole } from '../types/approval.types';
import { ValidationResult } from '../validators/approval.validators';

/**
 * DTO: LoginCredentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * DTO: AuthResponse
 */
export interface AuthResponse {
  user: User;
  token: string;
}

/**
 * Interface: IAuthStrategy
 * Strategy pattern cho các phương thức authentication khác nhau
 */
export interface IAuthStrategy {
  authenticate(credentials: LoginCredentials): Promise<AuthResponse>;
  validateCredentials(credentials: LoginCredentials): ValidationResult;
}

/**
 * MockAuthStrategy
 * Strategy sử dụng mock data để testing
 */
export class MockAuthStrategy implements IAuthStrategy {
  // Mock users database
  private mockUsers: Array<{
    email: string;
    password: string;
    user: User;
  }> = [
    {
      email: 'admin@example.com',
      password: 'admin123',
      user: new User(
        'admin-1',
        'Admin Nguyễn',
        'admin@example.com',
        UserRole.ADMIN,
        'Quản lý',
        undefined
      ),
    },
    {
      email: 'manager@example.com',
      password: 'manager123',
      user: new User(
        'manager-1',
        'Manager Trần',
        'manager@example.com',
        UserRole.MANAGER,
        'IT Department',
        undefined
      ),
    },
    {
      email: 'user@example.com',
      password: 'user123',
      user: new User(
        'user-1',
        'User Lê',
        'user@example.com',
        UserRole.EMPLOYEE,
        'Marketing',
        undefined
      ),
    },
  ];

  validateCredentials(credentials: LoginCredentials): ValidationResult {
    if (!credentials.email || credentials.email.trim().length === 0) {
      return ValidationResult.failure('Email là bắt buộc');
    }

    if (!credentials.password || credentials.password.trim().length === 0) {
      return ValidationResult.failure('Mật khẩu là bắt buộc');
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      return ValidationResult.failure('Email không đúng định dạng');
    }

    return ValidationResult.success();
  }

  async authenticate(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Validate credentials format
    const validationResult = this.validateCredentials(credentials);
    if (!validationResult.isValid) {
      throw new Error(validationResult.errorMessage);
    }

    // Find user
    const userRecord = this.mockUsers.find(
      (u) =>
        u.email === credentials.email && u.password === credentials.password
    );

    if (!userRecord) {
      throw new Error('Email hoặc mật khẩu không đúng');
    }

    // Generate mock token
    const token = `mock_token_${userRecord.user.id}_${Date.now()}`;

    return {
      user: userRecord.user,
      token,
    };
  }
}

/**
 * AuthService
 * Main service sử dụng Strategy Pattern để xử lý authentication
 */
export class AuthService {
  private strategy: IAuthStrategy;

  constructor(strategy: IAuthStrategy = new MockAuthStrategy()) {
    this.strategy = strategy;
  }

  /**
   * Thay đổi authentication strategy
   */
  setStrategy(strategy: IAuthStrategy): void {
    this.strategy = strategy;
  }

  /**
   * Login
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.strategy.authenticate(credentials);
  }

  /**
   * Logout
   */
  logout(): void {
    // Clear stored authentication data
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
  }

  /**
   * Store authentication data
   */
  storeAuth(authResponse: AuthResponse): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', authResponse.token);
      localStorage.setItem('auth_user', JSON.stringify(authResponse.user));
    }
  }

  /**
   * Get stored user
   */
  getStoredUser(): User | null {
    if (typeof window === 'undefined') return null;

    try {
      const userStr = localStorage.getItem('auth_user');
      if (!userStr) return null;

      const userData = JSON.parse(userStr);
      return new User(
        userData.id,
        userData.name,
        userData.email,
        userData.role,
        userData.department,
        userData.avatar
      );
    } catch {
      return null;
    }
  }

  /**
   * Get stored token
   */
  getStoredToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.getStoredToken() !== null && this.getStoredUser() !== null;
  }
}
