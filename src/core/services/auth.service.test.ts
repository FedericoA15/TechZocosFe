import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from './auth.service';

// Mock the axios instance
vi.mock('../api/axios.instance', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import type { Mocked } from 'vitest';
import type { AxiosInstance } from 'axios';
import api from '../api/axios.instance';
const mockedApi = api as Mocked<AxiosInstance>;

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should call POST /auth/login with email and password', async () => {
      const mockResponse = {
        data: {
          token: 'jwt-token-123',
          expiresAt: '2026-12-31T23:59:59Z',
          user: {
            id: 'user-1',
            firstName: 'Federico',
            lastName: 'Test',
            email: 'fede@test.com',
            role: 'Admin',
          },
        },
      };
      mockedApi.post.mockResolvedValueOnce(mockResponse);

      const result = await authService.login('fede@test.com', 'password123');

      expect(mockedApi.post).toHaveBeenCalledWith('/auth/login', {
        email: 'fede@test.com',
        password: 'password123',
      });
      expect(result.token).toBe('jwt-token-123');
      expect(result.user.firstName).toBe('Federico');
    });

    it('should throw on invalid credentials', async () => {
      mockedApi.post.mockRejectedValueOnce({
        response: { status: 401, data: 'Unauthorized' },
      });

      await expect(authService.login('bad@mail.com', 'wrong')).rejects.toEqual({
        response: { status: 401, data: 'Unauthorized' },
      });
    });
  });

  describe('logout', () => {
    it('should call POST /auth/logout', async () => {
      mockedApi.post.mockResolvedValueOnce({ data: null });

      await authService.logout();

      expect(mockedApi.post).toHaveBeenCalledWith('/auth/logout');
    });
  });
});
