import { apiClient } from "./client";
import type { AuthResponse, RegisterInput, LoginInput } from "../types/auth";

export const authApi = {
  async register(data: RegisterInput): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>("/auth/register", data);
    return res.data;
  },

  async login(data: LoginInput): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>("/auth/login", data);
    return res.data;
  },
};
