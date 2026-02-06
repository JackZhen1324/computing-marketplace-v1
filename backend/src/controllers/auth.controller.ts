import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import { authConfig } from '../config/auth';
import { AuthRequest, TokenPayload } from '../middleware/auth.middleware';
import redisClient from '../config/redis';
import { AppError } from '../middleware/error.middleware';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, fullName, phone, companyName } = req.body;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new AppError('User with this email already exists', 409);
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, authConfig.bcrypt.saltRounds);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          fullName,
          phone,
          companyName,
          role: 'CUSTOMER',
        },
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          createdAt: true,
        },
      });

      // Generate tokens
      const { accessToken, refreshToken } = await this.generateTokens(user.id, user.email, user.role);

      // Store refresh token in Redis (with error handling)
      try {
        await redisClient.set(`refresh_token:${user.id}`, refreshToken, {
          EX: 7 * 24 * 60 * 60, // 7 days
        });
      } catch (redisError) {
        console.warn('Warning: Failed to store refresh token in Redis:', redisError);
      }

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user,
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new AppError('Invalid email or password', 401);
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);

      if (!isValidPassword) {
        throw new AppError('Invalid email or password', 401);
      }

      // Check if user is active
      if (!user.isActive) {
        throw new AppError('Account has been deactivated', 403);
      }

      // Generate tokens
      const { accessToken, refreshToken } = await this.generateTokens(user.id, user.email, user.role);

      // Store refresh token in Redis (with error handling)
      try {
        await redisClient.set(`refresh_token:${user.id}`, refreshToken, {
          EX: 7 * 24 * 60 * 60, // 7 days
        });
      } catch (redisError) {
        console.warn('Warning: Failed to store refresh token in Redis:', redisError);
        // Continue anyway - in development this is acceptable
      }

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
          },
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw new AppError('Refresh token is required', 400);
      }

      // Verify refresh token
      let decoded: TokenPayload;
      try {
        decoded = jwt.verify(refreshToken, authConfig.jwt.secret) as TokenPayload;
      } catch {
        throw new AppError('Invalid refresh token', 401);
      }

      // Check if refresh token exists in Redis (with error handling)
      try {
        const storedToken = await redisClient.get(`refresh_token:${decoded.userId}`);

        if (storedToken !== refreshToken) {
          throw new AppError('Invalid refresh token', 401);
        }
      } catch (redisError) {
        // If Redis is not available, skip this check in development
        if (process.env.NODE_ENV === 'production') {
          throw new AppError('Redis unavailable', 503);
        }
        console.warn('Warning: Redis not available, skipping token validation');
      }

      // Get user
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          isActive: true,
          role: true,
        },
      });

      if (!user || !user.isActive) {
        throw new AppError('User not found or inactive', 401);
      }

      // Generate new tokens
      const tokens = await this.generateTokens(user.id, user.email, user.role);

      // Update refresh token in Redis (with error handling)
      try {
        await redisClient.set(`refresh_token:${user.id}`, tokens.refreshToken, {
          EX: 7 * 24 * 60 * 60,
        });
      } catch (redisError) {
        console.warn('Warning: Failed to update refresh token in Redis:', redisError);
      }

      res.json({
        success: true,
        data: tokens,
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (req.user) {
        // Remove refresh token from Redis (with error handling)
        try {
          await redisClient.del(`refresh_token:${req.user.userId}`);
        } catch (redisError) {
          console.warn('Warning: Failed to delete refresh token from Redis:', redisError);
        }
      }

      res.json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error) {
      next(error);
    }
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload: TokenPayload = {
      userId,
      email,
      role,
    };

    const accessToken = jwt.sign(payload, authConfig.jwt.secret, {
      expiresIn: authConfig.jwt.accessTokenExpiry,
    });

    const refreshToken = jwt.sign(payload, authConfig.jwt.secret, {
      expiresIn: authConfig.jwt.refreshTokenExpiry,
    });

    return { accessToken, refreshToken };
  }
}
