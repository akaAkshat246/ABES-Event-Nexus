import { Router } from 'express';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/eventController';
import {
  registerForEvent,
  getEventRegistrations,
} from '../controllers/registrationController';
import { protectAdmin } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { eventSchema, registrationSchema } from '../schemas/validationSchemas';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiter for registration endpoint: max 15 registrations per IP per 15 minutes
const registrationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  message: {
    success: false,
    message: 'Too many registration requests from this IP. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public Event Routes
router.get('/', getEvents);
router.get('/:id', getEventById);

// Public Registration for an Event
router.post('/:id/register', registrationLimiter, validate(registrationSchema), registerForEvent);

// Admin-only Event Management Routes
router.post('/', protectAdmin, validate(eventSchema), createEvent);
router.put('/:id', protectAdmin, validate(eventSchema), updateEvent);
router.delete('/:id', protectAdmin, deleteEvent);

// Admin-only: Get registrations for a specific event
router.get('/:id/registrations', protectAdmin, getEventRegistrations);

export default router;
