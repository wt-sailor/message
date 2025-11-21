import axios from 'axios';
import { User, AuthResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', { email, password });
  const { token, user } = response.data.data;
  localStorage.setItem('token', token);
  return { token, user };
};

export const signup = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post('/auth/signup', { name, email, password });
  const { token, user } = response.data.data;
  localStorage.setItem('token', token);
  return { token, user };
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get('/auth/me');
  return response.data.data;
};

export const updateProfile = async (name?: string, email?: string): Promise<User> => {
  const response = await api.patch('/auth/profile', { name, email });
  return response.data.data;
};

export const deleteAccount = async (): Promise<void> => {
  await api.delete('/auth/account');
  localStorage.removeItem('token');
};

export const changePassword = async (oldPassword: string, newPassword: string): Promise<void> => {
  await api.patch('/auth/change-password', { oldPassword, newPassword });
};

export const logout = () => {
  localStorage.removeItem('token');
};
