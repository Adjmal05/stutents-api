import { apiClient } from "./client";
import type { Student, StudentInput } from "../types/student";

export const studentsApi = {
  async getAll(): Promise<Student[]> {
    const res = await apiClient.get<Student[]>("/students");
    return res.data;
  },

  async create(data: StudentInput): Promise<Student> {
    const res = await apiClient.post<Student>("/students", data);
    return res.data;
  },

  async update(id: string, data: StudentInput): Promise<Student> {
    const res = await apiClient.put<Student>(`/students/${id}`, data);
    return res.data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/students/${id}`);
  },
};
