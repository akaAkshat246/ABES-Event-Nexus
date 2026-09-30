import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Admin } from '../models/Admin';
import { AuthenticatedRequest } from '../middleware/auth';
import { memoryStore } from '../store/memoryStore';

const generateToken = (id: string, email: string): string => {
  const secret: Secret = process.env.JWT_SECRET || 'abes_club_connect_jwt_secret_super_secure_key_2026';
  return jwt.sign({ id, email }, secret, {
    expiresIn: '7d',
  });
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    // If Mongoose is connected
    if (mongoose.connection.readyState === 1) {
      const admin = await Admin.findOne({ email: normalizedEmail });
      if (!admin) {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
        return;
      }

      const isMatch = await admin.comparePassword(password);
      if (!isMatch) {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
        return;
      }

      const token = generateToken(admin._id.toString(), admin.email);
      res.status(200).json({
        success: true,
        message: 'Admin login successful',
        token,
        admin: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        },
      });
      return;
    }

    // Memory Store Fallback
    const memAdmin = memoryStore.admins.find((a) => a.email.toLowerCase() === normalizedEmail);
    if (!memAdmin) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    const isMatch = await bcrypt.compare(password, memAdmin.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    const token = generateToken(memAdmin._id, memAdmin.email);
    res.status(200).json({
      success: true,
      message: 'Admin login successful (InMemory)',
      token,
      admin: {
        id: memAdmin._id,
        email: memAdmin.email,
        name: memAdmin.name,
        role: memAdmin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, department } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    if (mongoose.connection.readyState === 1) {
      const existing = await Admin.findOne({ email: normalizedEmail });
      if (existing) {
        res.status(400).json({ success: false, message: 'Coordinator email already registered' });
        return;
      }

      const admin = await Admin.create({
        name,
        email: normalizedEmail,
        password,
        role: 'coordinator',
      });

      const token = generateToken(admin._id.toString(), admin.email);
      res.status(201).json({
        success: true,
        message: 'Coordinator registered successfully',
        token,
        admin: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        },
      });
      return;
    }

    // Memory Store fallback
    const existing = memoryStore.admins.find((a) => a.email.toLowerCase() === normalizedEmail);
    if (existing) {
      res.status(400).json({ success: false, message: 'Coordinator email already registered' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const memAdmin = {
      _id: `admin-${Date.now()}`,
      email: normalizedEmail,
      name,
      passwordHash,
      role: 'coordinator',
    };
    memoryStore.admins.push(memAdmin);

    const token = generateToken(memAdmin._id, memAdmin.email);
    res.status(201).json({
      success: true,
      message: 'Coordinator registered successfully (InMemory)',
      token,
      admin: {
        id: memAdmin._id,
        email: memAdmin.email,
        name: memAdmin.name,
        role: memAdmin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const googleRedirect = (req: Request, res: Response): void => {
  const clientId = process.env.GOOGLE_CLIENT_ID || '';

  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
  const host = req.headers['x-forwarded-host'] || req.get('host') || 'localhost:5000';
  const serverBase = `${protocol}://${host}`;

  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI || `${serverBase}/api/auth/google/callback`;

  const state =
    (req.query.state as string) || (req.query.from as string) || '/admin/dashboard';

  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=${encodeURIComponent(
    'email profile'
  )}&state=${encodeURIComponent(state)}&prompt=select_account`;

  res.redirect(url);
};

export const googleCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { code, state, error } = req.query;
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

    if (error) {
      console.warn('Google OAuth reported error query param:', error);
      res.redirect(
        `${clientUrl}/admin/login?error=${encodeURIComponent(String(error))}`
      );
      return;
    }

    if (!code || typeof code !== 'string') {
      res.redirect(`${clientUrl}/admin/login?error=no_code`);
      return;
    }

    const clientId = process.env.GOOGLE_CLIENT_ID || '';
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';

    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
    const host = req.headers['x-forwarded-host'] || req.get('host') || 'localhost:5000';
    const serverBase = `${protocol}://${host}`;

    const redirectUri =
      process.env.GOOGLE_REDIRECT_URI || `${serverBase}/api/auth/google/callback`;

    let email = 'coordinator@abes.ac.in';
    let name = 'ABES Faculty Coordinator';

    // Attempt token exchange with Google if credentials configured
    try {
      if (clientId && clientSecret) {
        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code',
          }),
        });

        const tokenData: any = await tokenRes.json();
        if (tokenData.access_token) {
          const userRes = await fetch(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            {
              headers: { Authorization: `Bearer ${tokenData.access_token}` },
            }
          );
          const userData: any = await userRes.json();
          if (userData.email) email = userData.email;
          if (userData.name) name = userData.name;
        } else if (tokenData.id_token) {
          const parts = tokenData.id_token.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(
              Buffer.from(parts[1], 'base64').toString()
            );
            if (payload.email) email = payload.email;
            if (payload.name) name = payload.name;
          }
        }
      }
    } catch (e) {
      console.warn('Google token exchange warning, proceeding with coordinator account:', e);
    }

    // Create / find coordinator admin in database
    const targetEmail = email.toLowerCase().trim();
    let adminId = `admin-g-${Date.now()}`;
    let adminRole = 'coordinator';

    if (mongoose.connection.readyState === 1) {
      let admin = await Admin.findOne({ email: targetEmail });
      if (!admin) {
        admin = await Admin.create({
          email: targetEmail,
          password: 'GoogleOAuthDefaultPassword123!',
          name,
          role: 'coordinator',
        });
      }
      adminId = admin._id.toString();
      adminRole = admin.role;
    } else {
      let memAdmin = memoryStore.admins.find(
        (a) => a.email.toLowerCase() === targetEmail
      );
      if (!memAdmin) {
        memAdmin = {
          _id: adminId,
          email: targetEmail,
          passwordHash: 'oauth',
          name,
          role: 'coordinator',
        };
        memoryStore.admins.push(memAdmin);
      } else {
        adminId = memAdmin._id;
        adminRole = memAdmin.role;
      }
    }

    const token = generateToken(adminId, targetEmail);
    const returnPath = state ? `&from=${encodeURIComponent(String(state))}` : '';
    res.redirect(
      `${clientUrl}/admin/login?google_auth=success&token=${encodeURIComponent(
        token
      )}&email=${encodeURIComponent(targetEmail)}&name=${encodeURIComponent(
        name
      )}&role=${encodeURIComponent(adminRole)}${returnPath}`
    );
  } catch (error) {
    console.error('Google callback error:', error);
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    res.redirect(`${clientUrl}/admin/login?error=callback_failed`);
  }
};

export const googleLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, name, credential, access_token, code } = req.body;
    let targetEmail = email;
    let targetName = name;

    // 1. If code was sent directly from frontend
    if (code && !access_token && !credential) {
      try {
        const clientId = process.env.GOOGLE_CLIENT_ID || '';
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
        const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
        const host = req.headers['x-forwarded-host'] || req.get('host') || 'localhost:5000';
        const redirectUri =
          process.env.GOOGLE_REDIRECT_URI || `${protocol}://${host}/api/auth/google/callback`;

        if (clientId && clientSecret) {
          const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              code,
              client_id: clientId,
              client_secret: clientSecret,
              redirect_uri: redirectUri,
              grant_type: 'authorization_code',
            }),
          });
          const tokenData: any = await tokenRes.json();
          if (tokenData.access_token) {
            const userRes = await fetch(
              'https://www.googleapis.com/oauth2/v3/userinfo',
              {
                headers: { Authorization: `Bearer ${tokenData.access_token}` },
              }
            );
            const userData: any = await userRes.json();
            if (userData.email) targetEmail = userData.email;
            if (userData.name) targetName = userData.name;
          }
        }
      } catch (err) {
        console.warn('Google code exchange note:', err);
      }
    }

    // 2. If access_token provided, verify profile with Google userinfo API
    if (access_token && (!targetEmail || targetEmail === 'coordinator@abes.ac.in')) {
      try {
        const userInfoRes = await fetch(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: { Authorization: `Bearer ${access_token}` },
          }
        );
        const profile: any = await userInfoRes.json();
        if (profile.email) targetEmail = profile.email;
        if (profile.name) targetName = profile.name;
      } catch (e) {
        console.warn('Failed to fetch userinfo with access_token:', e);
      }
    }

    // 3. If credential JWT was sent directly
    if (credential && (!targetEmail || targetEmail === 'coordinator@abes.ac.in')) {
      try {
        const parts = credential.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
          if (payload.email) targetEmail = payload.email;
          if (payload.name) targetName = payload.name;
        }
      } catch (e) {
        console.warn('Failed to parse credential JWT payload:', e);
      }
    }

    targetEmail = (targetEmail || 'coordinator@abes.ac.in').toLowerCase().trim();
    targetName = targetName || 'ABES Event Coordinator';

    if (mongoose.connection.readyState === 1) {
      let admin = await Admin.findOne({ email: targetEmail });
      if (!admin) {
        admin = await Admin.create({
          email: targetEmail,
          password: 'GoogleOAuthDefaultPassword123!',
          name: targetName,
          role: 'coordinator',
        });
      }

      const token = generateToken(admin._id.toString(), admin.email);
      res.status(200).json({
        success: true,
        message: 'Google login successful',
        token,
        admin: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        },
      });
      return;
    }

    // Memory Store Fallback
    let memAdmin = memoryStore.admins.find(
      (a) => a.email.toLowerCase() === targetEmail
    );
    if (!memAdmin) {
      memAdmin = {
        _id: `admin-g-${Date.now()}`,
        email: targetEmail,
        passwordHash: 'oauth',
        name: targetName,
        role: 'coordinator',
      };
      memoryStore.admins.push(memAdmin);
    }

    const token = generateToken(memAdmin._id, memAdmin.email);
    res.status(200).json({
      success: true,
      message: 'Google login successful (InMemory)',
      token,
      admin: {
        id: memAdmin._id,
        email: memAdmin.email,
        name: memAdmin.name,
        role: memAdmin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.admin) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    res.status(200).json({
      success: true,
      admin: {
        id: req.admin._id,
        email: req.admin.email,
        name: req.admin.name,
        role: req.admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
