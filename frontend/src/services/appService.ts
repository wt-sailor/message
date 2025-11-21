import { api } from './api';
import { App, AppWithStats } from '../types';

export const getApps = async (): Promise<App[]> => {
  const response = await api.get('/apps');
  return response.data.data;
};

export const getAppById = async (id: number): Promise<AppWithStats> => {
  const response = await api.get(`/apps/${id}`);
  return response.data.data;
};

export const createApp = async (data: {
  name: string;
  description?: string;
}): Promise<App> => {
  const response = await api.post('/apps', data);
  return response.data.data;
};

export const updateApp = async (
  id: number,
  data: { name?: string; description?: string }
): Promise<App> => {
  const response = await api.patch(`/apps/${id}`, data);
  return response.data.data;
};

export const rotateAppSecret = async (id: number): Promise<App> => {
  const response = await api.post(`/apps/${id}/rotate-secret`);
  return response.data.data;
};

export const deleteApp = async (id: number): Promise<void> => {
  await api.delete(`/apps/${id}`);
};
