import api, { setTokens, clearTokens } from './client';
import type { LoginCredentials, RegisterData, TokenPair, User } from '../types/auth';

export const login = async (credentials: LoginCredentials): Promise<TokenPair> => {
  const response = await api.post<TokenPair>('/api/token/', credentials);
  setTokens(response.data);
  return response.data;
};

export const register = async (data: RegisterData): Promise<User> => {
  const response = await api.post<User>('/api/users/register/', data);
  return response.data;
};

export const logout = (): void => {
  clearTokens();
};

export const getProfile = async (): Promise<User> => {
  const response = await api.get<User>('/api/users/profile/');
  return response.data;
};

export const updateProfile = async (data: Partial<User>): Promise<User> => {
  const response = await api.patch<User>('/api/users/profile/', data);
  return response.data;
};

export const changePassword = async (oldPassword: string, newPassword: string): Promise<void> => {
  await api.post('/api/users/change-password/', {
    old_password: oldPassword,
    new_password: newPassword,
  });
};
