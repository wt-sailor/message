import { api } from './api';
import { User, UserStatus, Warning, ApiResponse } from '../types';

export const getAllUsers = async (status?: UserStatus): Promise<User[]> => {
  const params = status ? { status } : {};
  const response = await api.get<ApiResponse<User[]>>('/admin/users', { params });
  return response.data.data!;
};

export const updateUserStatus = async (
  userId: number,
  status: UserStatus
): Promise<User> => {
  const response = await api.patch<ApiResponse<User>>(
    `/admin/users/${userId}/status`,
    { status }
  );
  return response.data.data!;
};

export const updateUserAppLimit = async (
  userId: number,
  appLimit: number | null
): Promise<User> => {
  const response = await api.patch<ApiResponse<User>>(
    `/admin/users/${userId}/app-limit`,
    { appLimit }
  );
  return response.data.data!;
};

export const createWarning = async (
  userId: number,
  message: string
): Promise<Warning> => {
  const response = await api.post<ApiResponse<Warning>>(
    `/admin/users/${userId}/warn`,
    { message }
  );
  return response.data.data!;
};
