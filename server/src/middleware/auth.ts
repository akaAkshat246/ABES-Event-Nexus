import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { Admin, IAdmin } from '../models/Admin';
import { memoryStore } from '../store/memoryStore';

export interface AuthenticatedRequest extends Request {
  admin?: any;
}

export const protectAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access denied. No authorization token provided.',
      });
      return;
    }

    const secret = process.env.JWT_SECRET || 'abes_club_connect_jwt_secret_super_secure_key_2026';
    const decoded = jwt.verify(token, secret) as { id: string; email: string };

    if (mongoose.connection.readyState === 1) {
      const admin = await Admin.findById(decoded.id).select('-passwordHash');
      if (!admin) {
        res.status(401).json({
          success: false,
          message: 'Invalid token: Admin account not found.',
        });
        return;
      }
      req.admin = admin;
      next();
      return;
    }

    // Memory Store check
    const memAdmin = memoryStore.admins.find((a) => a._id === decoded.id || a.email === decoded.email);
    if (!memAdmin) {
      res.status(401).json({
        success: false,
        message: 'Invalid token: Admin account not found.',
      });
      return;
    }

    req.admin = {
      _id: memAdmin._id,
      email: memAdmin.email,
      name: memAdmin.name,
      role: memAdmin.role,
    };
    next();
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.',
      error: error.message,
    });
  }
};
