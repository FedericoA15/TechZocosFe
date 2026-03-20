import { describe, it, expect, vi, beforeEach } from 'vitest';
import { userService } from './user.service';

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

const mockUser = {
  id: 'user-1',
  firstName: 'Federico',
  lastName: 'Admin',
  email: 'fed@test.com',
  role: 'Admin' as const,
};

const mockPaginatedResponse = {
  items: [mockUser],
  pageNumber: 1,
  pageSize: 5,
  totalPages: 1,
  totalItems: 1,
  hasPreviousPage: false,
  hasNextPage: false,
};

describe('userService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should call GET /users with default pagination params', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: mockPaginatedResponse });

      const result = await userService.getAllUsers();

      expect(mockedApi.get).toHaveBeenCalledWith('/users', {
        params: { page: 1, pageSize: 10, includeInactive: false },
      });
      expect(result.items).toHaveLength(1);
      expect(result.items[0].firstName).toBe('Federico');
    });

    it('should pass custom pagination and filter params', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: mockPaginatedResponse });

      await userService.getAllUsers(2, 5, true);

      expect(mockedApi.get).toHaveBeenCalledWith('/users', {
        params: { page: 2, pageSize: 5, includeInactive: true },
      });
    });
  });

  describe('getUserById', () => {
    it('should call GET /users/:id', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: mockUser });

      const result = await userService.getUserById('user-1');

      expect(mockedApi.get).toHaveBeenCalledWith('/users/user-1');
      expect(result.email).toBe('fed@test.com');
    });
  });

  describe('createUser', () => {
    it('should call POST /users with payload', async () => {
      const payload = { firstName: 'New', lastName: 'User', email: 'new@test.com', role: 'User' as const, password: '123456' };
      mockedApi.post.mockResolvedValueOnce({ data: { ...payload, id: 'new-id' } });

      const result = await userService.createUser(payload);

      expect(mockedApi.post).toHaveBeenCalledWith('/users', payload);
      expect(result.id).toBe('new-id');
    });
  });

  describe('updateUser', () => {
    it('should call PUT /users/:id with partial data', async () => {
      const update = { firstName: 'Updated' };
      mockedApi.put.mockResolvedValueOnce({ data: { ...mockUser, ...update } });

      const result = await userService.updateUser('user-1', update);

      expect(mockedApi.put).toHaveBeenCalledWith('/users/user-1', update);
      expect(result.firstName).toBe('Updated');
    });
  });

  describe('deleteUser', () => {
    it('should call DELETE /users/:id', async () => {
      mockedApi.delete.mockResolvedValueOnce({ data: null });

      await userService.deleteUser('user-1');

      expect(mockedApi.delete).toHaveBeenCalledWith('/users/user-1');
    });
  });
});
