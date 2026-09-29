import { Router } from 'express';
import authRoutes from './authRoutes';
import eventRoutes from './eventRoutes';
import registrationRoutes from './registrationRoutes';

const router = Router();

// Health check endpoint
router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'ABES Club Connect API is running smoothly',
    timestamp: new Date().toISOString(),
    service: 'abes-club-connect-api',
  });
});

// Mount modular sub-routes
router.use('/auth', authRoutes);
router.use('/events', eventRoutes);
router.use('/registrations', registrationRoutes);

export default router;
