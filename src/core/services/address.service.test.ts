import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addressService } from './address.service';

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

const mockAddress = {
  id: 'address-1',
  userId: 'user-1',
  street: 'Av. Siempre Viva 123',
  city: 'Springfield',
  state: 'ST',
  zipCode: '1234',
  country: 'USA',
};

describe('addressService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAddressesByUserId', () => {
    it('should call GET /users/:userId/addresses', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: [mockAddress] });

      const result = await addressService.getAddressesByUserId('user-1');

      expect(mockedApi.get).toHaveBeenCalledWith('/users/user-1/addresses');
      expect(result).toHaveLength(1);
      expect(result[0].street).toBe('Av. Siempre Viva 123');
    });
  });

  describe('getAllAddresses', () => {
    it('should call GET /addresses with pagination params', async () => {
      const paginatedResponse = {
        items: [mockAddress],
        pageNumber: 1,
        pageSize: 5,
        totalPages: 1,
        totalItems: 1,
        hasPreviousPage: false,
        hasNextPage: false,
      };
      mockedApi.get.mockResolvedValueOnce({ data: paginatedResponse });

      const result = await addressService.getAllAddresses(1, 5, true);

      expect(mockedApi.get).toHaveBeenCalledWith('/addresses', {
        params: { page: 1, pageSize: 5, includeInactive: true },
      });
      expect(result.items[0].city).toBe('Springfield');
    });
  });

  describe('createAddress', () => {
    it('should call POST /users/:userId/addresses', async () => {
      const payload = { userId: 'user-1', street: 'New St', city: 'City', state: 'S', zipCode: '1', country: 'C' };
      mockedApi.post.mockResolvedValueOnce({ data: { ...payload, id: 'address-2' } });

      const result = await addressService.createAddress(payload);

      expect(mockedApi.post).toHaveBeenCalledWith('/users/user-1/addresses', payload);
      expect(result.id).toBe('address-2');
    });
  });

  describe('updateAddress', () => {
    it('should call PUT /users/:userId/addresses/:id', async () => {
      const update = { street: 'Updated St' };
      mockedApi.put.mockResolvedValueOnce({ data: { ...mockAddress, ...update } });

      const result = await addressService.updateAddress('user-1', 'address-1', update);

      expect(mockedApi.put).toHaveBeenCalledWith('/users/user-1/addresses/address-1', update);
      expect(result.street).toBe('Updated St');
    });
  });

  describe('deleteAddress', () => {
    it('should call DELETE /users/:userId/addresses/:id', async () => {
      mockedApi.delete.mockResolvedValueOnce({ data: null });

      await addressService.deleteAddress('user-1', 'address-1');

      expect(mockedApi.delete).toHaveBeenCalledWith('/users/user-1/addresses/address-1');
    });
  });
});
