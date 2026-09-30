import { Router } from 'express';
import { login, register, googleLogin, googleRedirect, googleCallback, getMe } from '../controllers/authController';
import { protectAdmin } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { loginSchema, coordinatorSignupSchema } from '../schemas/validationSchemas';

const router = Router();

// POST /api/auth/login
router.post('/login', validate(loginSchema), login);

// POST /api/auth/register
router.post('/register', validate(coordinatorSignupSchema), register);

// Google OAuth Endpoints
router.get('/google', googleRedirect);
router.get('/google/login', googleRedirect);
router.get('/google/callback', googleCallback);
router.get('/callback', googleCallback);
router.post('/google', googleLogin);
router.post('/google/callback', googleCallback);

// GET /api/auth/me (Protected)
router.get('/me', protectAdmin, getMe);

export default router;
