import { api } from './api';
import { User, UserStatus } from '../types';

export const getAllUsers = async (status?: UserStatus): Promise<User[]> => {
  const params = status ? { status } : {};
  const response = await api.get('/admin/users', { params });
  return response.data.data;
};

export const updateUserStatus = async (
  userId: number,
  status: UserStatus
): Promise<User> => {
  const response = await api.patch(
    `/admin/users/${userId}/status`,
    { status }
  );
  return response.data.data;
};

export const updateUserAppLimit = async (
  userId: number,
  appLimit: number | null
): Promise<User> => {
  const response = await api.patch(
    `/admin/users/${userId}/app-limit`,
    { appLimit }
  );
  return response.data.data;
};

export const createWarning = async (userId: number, message: string): Promise<void> => {
  await api.post(`/admin/users/${userId}/warn`, { message });
};

export const deleteUser = async (userId: number): Promise<{ deletedAppsCount: number }> => {
  const response = await api.delete(`/admin/users/${userId}`);
  return response.data.data;
};
