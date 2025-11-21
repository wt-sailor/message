import { api } from './api';
import { App, AppWithStats, ApiResponse } from '../types';

export const getApps = async (): Promise<App[]> => {
  const response = await api.get<ApiResponse<App[]>>('/apps');
  return response.data.data!;
};

export const getAppById = async (id: number): Promise<AppWithStats> => {
  const response = await api.get<ApiResponse<AppWithStats>>(`/apps/${id}`);
  return response.data.data!;
};

export const createApp = async (data: {
  name: string;
  description?: string;
}): Promise<App> => {
  const response = await api.post<ApiResponse<App>>('/apps', data);
  return response.data.data!;
};

export const updateApp = async (
  id: number,
  data: { name?: string; description?: string }
): Promise<App> => {
  const response = await api.patch<ApiResponse<App>>(`/apps/${id}`, data);
  return response.data.data!;
};

export const rotateAppSecret = async (id: number): Promise<App> => {
  const response = await api.post<ApiResponse<App>>(`/apps/${id}/rotate-secret`);
  return response.data.data!;
};

export const deleteApp = async (id: number): Promise<void> => {
  await api.delete(`/apps/${id}`);
};

export const getUserWarnings = async (): Promise<any[]> => {
  const response = await api.get<ApiResponse<any[]>>('/apps/user/warnings');
  return response.data.data!;
};
