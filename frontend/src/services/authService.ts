import { api } from './api';
import { AuthResponse, User, ApiResponse } from '../types';

export const signup = async (data: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const response = await api.post<ApiResponse<AuthResponse>>('/auth/signup', data);
  return response.data.data!;
};

export const login = async (data: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
  return response.data.data!;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<ApiResponse<User>>('/auth/me');
  return response.data.data!;
};
