import api from "../api/axios.instance";
import type { User } from "../types/user";

export interface LoginResponse {
  token: string;
  expiresAt: string;
  user: User;
}

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>("/auth/login", {
      email,
      password,
    });
    return data;
  },
  
  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },
};
