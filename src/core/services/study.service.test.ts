import { describe, it, expect, vi, beforeEach } from 'vitest';
import { studyService } from './study.service';

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

const mockStudy = {
  id: 'study-1',
  userId: 'user-1',
  title: 'Ingeniería en Sistemas',
  institution: 'UTN',
  startDate: '2020-03-01',
  endDate: '2025-12-15',
  description: 'Carrera de grado',
};

describe('studyService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getStudiesByUserId', () => {
    it('should call GET /users/:userId/studies', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: [mockStudy] });

      const result = await studyService.getStudiesByUserId('user-1');

      expect(mockedApi.get).toHaveBeenCalledWith('/users/user-1/studies');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Ingeniería en Sistemas');
    });
  });

  describe('getAllStudies', () => {
    it('should call GET /studies with pagination params', async () => {
      const paginatedResponse = {
        items: [mockStudy],
        pageNumber: 1,
        pageSize: 5,
        totalPages: 1,
        totalItems: 1,
        hasPreviousPage: false,
        hasNextPage: false,
      };
      mockedApi.get.mockResolvedValueOnce({ data: paginatedResponse });

      const result = await studyService.getAllStudies(1, 5, false);

      expect(mockedApi.get).toHaveBeenCalledWith('/studies', {
        params: { page: 1, pageSize: 5, includeInactive: false },
      });
      expect(result.items[0].institution).toBe('UTN');
    });
  });

  describe('createStudy', () => {
    it('should call POST /users/:userId/studies', async () => {
      const payload = { userId: 'user-1', title: 'MBA', institution: 'Harvard', startDate: '2026-01-01' };
      mockedApi.post.mockResolvedValueOnce({ data: { ...payload, id: 'study-2' } });

      const result = await studyService.createStudy(payload);

      expect(mockedApi.post).toHaveBeenCalledWith('/users/user-1/studies', payload);
      expect(result.id).toBe('study-2');
    });
  });

  describe('updateStudy', () => {
    it('should call PUT /users/:userId/studies/:id', async () => {
      const update = { title: 'Updated Title' };
      mockedApi.put.mockResolvedValueOnce({ data: { ...mockStudy, ...update } });

      const result = await studyService.updateStudy('user-1', 'study-1', update);

      expect(mockedApi.put).toHaveBeenCalledWith('/users/user-1/studies/study-1', update);
      expect(result.title).toBe('Updated Title');
    });
  });

  describe('deleteStudy', () => {
    it('should call DELETE /users/:userId/studies/:id', async () => {
      mockedApi.delete.mockResolvedValueOnce({ data: null });

      await studyService.deleteStudy('user-1', 'study-1');

      expect(mockedApi.delete).toHaveBeenCalledWith('/users/user-1/studies/study-1');
    });
  });
});
