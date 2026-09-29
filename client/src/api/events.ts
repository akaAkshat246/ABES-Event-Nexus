import api from './client';
import { IEvent, EventsResponse } from '../types';

export interface EventFilterParams {
  q?: string;
  category?: string;
  club?: string;
  featured?: boolean;
  timeframe?: 'upcoming' | 'past' | 'all';
  page?: number;
  limit?: number;
  sortBy?: 'date' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export const fetchEvents = async (params?: EventFilterParams): Promise<EventsResponse> => {
  const response = await api.get<EventsResponse>('/events', { params });
  return response.data;
};

export const fetchEventById = async (id: string): Promise<{ success: boolean; data: IEvent }> => {
  const response = await api.get<{ success: boolean; data: IEvent }>(`/events/${id}`);
  return response.data;
};

export const createEventApi = async (eventData: Partial<IEvent>): Promise<{ success: boolean; message: string; data: IEvent }> => {
  const response = await api.post<{ success: boolean; message: string; data: IEvent }>('/events', eventData);
  return response.data;
};

export const updateEventApi = async (id: string, eventData: Partial<IEvent>): Promise<{ success: boolean; message: string; data: IEvent }> => {
  const response = await api.put<{ success: boolean; message: string; data: IEvent }>(`/events/${id}`, eventData);
  return response.data;
};

export const deleteEventApi = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete<{ success: boolean; message: string }>(`/events/${id}`);
  return response.data;
};
