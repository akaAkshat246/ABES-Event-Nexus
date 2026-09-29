import api from './client';
import { IRegistration, RegistrationInput, RegistrationConfirmation, DashboardStats } from '../types';

export const registerEventApi = async (
  eventId: string,
  data: RegistrationInput
): Promise<{ success: boolean; message: string; data: RegistrationConfirmation }> => {
  const response = await api.post<{ success: boolean; message: string; data: RegistrationConfirmation }>(
    `/events/${eventId}/register`,
    data
  );
  return response.data;
};

export const fetchAllRegistrations = async (params?: {
  q?: string;
  event?: string;
  year?: string;
  page?: number;
  limit?: number;
}): Promise<{
  success: boolean;
  data: IRegistration[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}> => {
  const response = await api.get('/registrations', { params });
  return response.data;
};

export const fetchEventRegistrations = async (
  eventId: string
): Promise<{ success: boolean; data: IRegistration[]; count: number }> => {
  const response = await api.get(`/events/${eventId}/registrations`);
  return response.data;
};

export const deleteRegistrationApi = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete(`/registrations/${id}`);
  return response.data;
};

export const fetchDashboardStats = async (): Promise<{
  success: boolean;
  data: DashboardStats;
}> => {
  const response = await api.get('/registrations/stats');
  return response.data;
};

export const downloadRegistrationsCsv = async (params?: {
  event?: string;
  year?: string;
  q?: string;
}): Promise<void> => {
  const response = await api.get('/registrations', {
    params: { ...params, format: 'csv' },
    responseType: 'blob',
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `abes_registrations_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
