export type EventCategory =
  | 'Technical'
  | 'Cultural'
  | 'Sports'
  | 'Workshop'
  | 'Seminar'
  | 'Hackathon'
  | 'Other';

export type AcademicYear = '1st' | '2nd' | '3rd' | '4th';

export interface IEvent {
  _id: string;
  name: string;
  description: string;
  date: string;
  venue: string;
  category: EventCategory;
  club: string;
  posterUrl?: string;
  capacity?: number | null;
  featured: boolean;
  registeredCount?: number;
  isSoldOut?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IRegistration {
  _id: string;
  event: IEvent | string;
  name: string;
  email: string;
  collegeName: string;
  year: AcademicYear;
  phone: string;
  ticketId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAdmin {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface IStudent {
  name: string;
  email: string;
  collegeName: string;
  rollNumber: string;
  branch: string;
  year: AcademicYear;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token: string;
  admin: IAdmin;
}

export interface RegistrationInput {
  name: string;
  email: string;
  collegeName: string;
  year: AcademicYear;
  phone: string;
}

export interface RegistrationConfirmation {
  registrationId: string;
  ticketId: string;
  name: string;
  email: string;
  collegeName: string;
  year: AcademicYear;
  phone: string;
  eventName: string;
  eventDate: string;
  eventVenue: string;
  eventClub: string;
  registeredAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore?: boolean;
}

export interface EventsResponse {
  success: boolean;
  data: IEvent[];
  pagination: PaginationMeta;
}

export interface DashboardStats {
  totalEvents: number;
  upcomingEvents: number;
  totalRegistrations: number;
  registrationsThisWeek: number;
  recentRegistrations: Array<{
    _id: string;
    name: string;
    email: string;
    year: string;
    ticketId: string;
    createdAt: string;
    event?: {
      _id: string;
      name: string;
      category: string;
      club: string;
    };
  }>;
  topEvents: Array<{
    _id: string;
    name: string;
    club: string;
    category: string;
    date: string;
    capacity?: number;
    registeredCount: number;
  }>;
  categoryStats: Array<{
    _id: string;
    count: number;
  }>;
  yearStats: Array<{
    _id: string;
    count: number;
  }>;
}
