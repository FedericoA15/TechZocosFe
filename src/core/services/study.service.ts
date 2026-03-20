import api from "../api/axios.instance";
import type { Study } from "../types/user";
import type { PaginatedResponse } from "../types/api";

export const studyService = {
  /**
   * List all studies of a specific user
   */
  async getStudiesByUserId(userId: string): Promise<Study[]> {
    const { data } = await api.get<Study[]>(`/users/${userId}/studies`);
    return data;
  },

  /**
   * List all studies (Admin - Global)
   */
  async getAllStudies(pageNumber = 1, pageSize = 10, includeInactive = false): Promise<PaginatedResponse<Study>> {
    const { data } = await api.get<PaginatedResponse<Study>>("/studies", {
      params: { page: pageNumber, pageSize, includeInactive }
    });
    return data;
  },

  /**
   * Create a new study (Add to profile)
   */
  async createStudy(payload: Omit<Study, "id">): Promise<Study> {
    const { data } = await api.post<Study>(`/users/${payload.userId}/studies`, payload);
    return data;
  },

  /**
   * Update an existing study
   */
  async updateStudy(userId: string, id: string, payload: Partial<Study>): Promise<Study> {
    const { data } = await api.put<Study>(`/users/${userId}/studies/${id}`, payload);
    return data;
  },

  /**
   * Delete a study permanently
   */
  async deleteStudy(userId: string, id: string): Promise<void> {
    await api.delete(`/users/${userId}/studies/${id}`);
  },
};
