import api from "../api/axios.instance";
import type { Address } from "../types/user";
import type { PaginatedResponse } from "../types/api";

export const addressService = {
  /**
   * List all addresses of a specific user
   * (Assuming matching pattern from studies endpoint)
   */
  async getAddressesByUserId(userId: string): Promise<Address[]> {
    const { data } = await api.get<Address[]>(`/users/${userId}/addresses`);
    return data;
  },

  /**
   * List all addresses (Admin - Global)
   */
  async getAllAddresses(pageNumber = 1, pageSize = 10, includeInactive = false): Promise<PaginatedResponse<Address>> {
    const { data } = await api.get<PaginatedResponse<Address>>("/addresses", {
      params: { page: pageNumber, pageSize, includeInactive }
    });
    return data;
  },

  /**
   * Create a new address
   */
  async createAddress(payload: Omit<Address, "id">): Promise<Address> {
    const { data } = await api.post<Address>(`/users/${payload.userId}/addresses`, payload);
    return data;
  },

  /**
   * Update an existing address
   */
  async updateAddress(userId: string, id: string, payload: Partial<Address>): Promise<Address> {
    const { data } = await api.put<Address>(`/users/${userId}/addresses/${id}`, payload);
    return data;
  },

  /**
   * Delete an address
   */
  async deleteAddress(userId: string, id: string): Promise<void> {
    await api.delete(`/users/${userId}/addresses/${id}`);
  },
};
