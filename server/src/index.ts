import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/db';
import apiRoutes from './routes';
import authRoutes from './routes/authRoutes';
import { googleCallback, googleRedirect } from './controllers/authController';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  process.env.CLIENT_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Allow all in dev for seamless integration
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Root route
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Welcome to ABES Club Connect API',
    docs: '/api/health',
    status: 'online',
  });
});

// Direct OAuth callback and redirect route aliases for any external/Google callback URL formats
app.use('/auth', authRoutes);
app.get('/google', googleRedirect);
app.get('/google/callback', googleCallback);
app.get('/auth/google', googleRedirect);
app.get('/auth/google/callback', googleCallback);
app.get('/auth/callback', googleCallback);
app.get('/callback', googleCallback);
app.get('/api/google/callback', googleCallback);
app.get('/api/google', googleRedirect);

// API Routes
app.use('/api', apiRoutes);

// 404 Route Handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route not found: Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Global Centralized Error Handler
app.use(errorHandler);

// Start Server
const server = app.listen(PORT, () => {
  console.log(`🚀 ABES Club Connect Server running on http://localhost:${PORT}`);
  console.log(`📡 API Health Check: http://localhost:${PORT}/api/health`);
});

export default app;
