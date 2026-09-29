import { Router } from 'express';
import {
  getRegistrations,
  deleteRegistration,
  getDashboardStats,
} from '../controllers/registrationController';
import { protectAdmin } from '../middleware/auth';

const router = Router();

// All routes here are admin-only
router.use(protectAdmin);

// GET /api/registrations (supports ?q=&event=&year=&format=csv)
router.get('/', getRegistrations);

// GET /api/registrations/stats (dashboard overview)
router.get('/stats', getDashboardStats);

// DELETE /api/registrations/:id
router.delete('/:id', deleteRegistration);

export default router;
