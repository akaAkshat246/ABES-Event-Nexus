import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email address')
      .trim()
      .toLowerCase(),
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters'),
  }),
});

export const coordinatorSignupSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Coordinator name is required' })
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name cannot exceed 100 characters')
      .trim(),
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email address')
      .trim()
      .toLowerCase(),
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters'),
    department: z.string().optional(),
  }),
});

export const eventSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Event name is required' })
      .min(3, 'Event name must be at least 3 characters')
      .max(150, 'Event name cannot exceed 150 characters')
      .trim(),
    description: z
      .string({ required_error: 'Event description is required' })
      .min(10, 'Description must be at least 10 characters')
      .trim(),
    date: z.string({ required_error: 'Event date is required' }).refine(
      (val) => !isNaN(Date.parse(val)),
      { message: 'Invalid date format' }
    ),
    venue: z
      .string({ required_error: 'Venue is required' })
      .min(2, 'Venue must be at least 2 characters')
      .max(120, 'Venue cannot exceed 120 characters')
      .trim(),
    category: z.enum(
      ['Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Hackathon', 'Other'],
      { required_error: 'Category is required' }
    ),
    club: z
      .string({ required_error: 'Organizing club is required' })
      .min(2, 'Club name must be at least 2 characters')
      .max(100, 'Club name cannot exceed 100 characters')
      .trim(),
    posterUrl: z.string().optional().or(z.literal('')),
    capacity: z.coerce.number().int().positive().nullable().optional(),
    featured: z.boolean().optional().default(false),
  }),
});

export const registrationSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Event ID is required' }),
  }),
  body: z.object({
    name: z
      .string({ required_error: 'Full name is required' })
      .min(2, 'Full name must be at least 2 characters')
      .max(100, 'Full name cannot exceed 100 characters')
      .trim(),
    email: z
      .string({ required_error: 'Email is required' })
      .email('Please enter a valid email address')
      .trim()
      .toLowerCase(),
    collegeName: z
      .string()
      .min(2, 'College name must be at least 2 characters')
      .max(150, 'College name cannot exceed 150 characters')
      .trim()
      .default('ABES Engineering College'),
    year: z.enum(['1st', '2nd', '3rd', '4th'], {
      required_error: 'Academic year is required (1st, 2nd, 3rd, or 4th)',
    }),
    phone: z
      .string({ required_error: 'Phone number is required' })
      .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian phone number (e.g. 9876543210)'),
  }),
});
