import api from "../api/axios.instance";
import type { User } from "../types/user";
import type { PaginatedResponse } from "../types/api";

export const userService = {
  /**
   * List all users (Admin only)
   */
  async getAllUsers(pageNumber = 1, pageSize = 10, includeInactive = false): Promise<PaginatedResponse<User>> {
    const { data } = await api.get<PaginatedResponse<User>>("/users", {
      params: { page: pageNumber, pageSize, includeInactive }
    });
    return data;
  },

  /**
   * Create a new user (Admin only)
   */
  async createUser(payload: Omit<User, "id"> & { password?: string }): Promise<User> {
    const { data } = await api.post<User>("/users", payload);
    return data;
  },

  /**
   * Get a specific user profile
   */
  async getUserById(id: string): Promise<User> {
    const { data } = await api.get<User>(`/users/${id}`);
    return data;
  },

  /**
   * Update user profile (Self or Admin)
   */
  async updateUser(id: string, payload: Partial<User>): Promise<User> {
    const { data } = await api.put<User>(`/users/${id}`, payload);
    return data;
  },

  /**
   * Delete a user (Admin only)
   */
  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },
};
