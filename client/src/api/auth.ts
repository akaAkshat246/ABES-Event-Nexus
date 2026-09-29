import api from './client';
import { AuthResponse, IAdmin } from '../types';

export const loginAdminApi = async (credentials: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', credentials);
  return response.data;
};

export const registerAdminApi = async (payload: {
  name: string;
  email: string;
  password: string;
  department?: string;
}): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', payload);
  return response.data;
};

export const loginWithGoogleApi = async (payload?: {
  email?: string;
  name?: string;
  credential?: string;
  access_token?: string;
}): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/google', payload || {
    email: 'coordinator@abes.ac.in',
    name: 'ABES Event Coordinator',
  });
  return response.data;
};

export const getAdminProfileApi = async (): Promise<{ success: boolean; admin: IAdmin }> => {
  const response = await api.get<{ success: boolean; admin: IAdmin }>('/auth/me');
  return response.data;
};
