import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { authConfig } from './config/auth';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import solutionRoutes from './routes/solutions';
import newsRoutes from './routes/news';
import navigationRoutes from './routes/navigation';
import inquiryRoutes from './routes/inquiries';
import logger from './utils/logger';

const createApp = (): Application => {
  const app = express();

  // Trust proxy - needed when behind nginx reverse proxy
  app.set('trust proxy', 1);

  // Security middleware
  app.use(helmet());

  // CORS - Allow requests from same origin and configured origins
  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // In production, check if origin matches the allowed list
      const allowedOrigins = process.env.CORS_ORIGIN
        ? process.env.CORS_ORIGIN.split(',')
        : [
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:5177',
            'http://localhost:9210',
            // Allow access from any port on localhost in development
            /^http:\/\/localhost:\d+$/,
            // Allow access from same-origin (when proxied through nginx)
          ];

      // Additional regex patterns for dynamic origins
      const dynamicPatterns = [
        /^https?:\/\/[\d\.]+:\d+$/, // Allow any IP:port (http://1.2.3.4:9210)
        /^https?:\/\/[\w\.-]+\.synology\.me(:\d+)?$/, // Allow any synology.me subdomain
      ];

      // Check if origin is allowed
      const isAllowed = allowedOrigins.some(allowedOrigin => {
        if (allowedOrigin instanceof RegExp) {
          return allowedOrigin.test(origin);
        }
        return allowedOrigin === origin;
      });

      // Check dynamic patterns
      const isDynamicAllowed = dynamicPatterns.some(pattern => pattern.test(origin));

      if (isAllowed || isDynamicAllowed) {
        callback(null, true);
      } else {
        // In development, be more permissive
        if (process.env.NODE_ENV !== 'production') {
          console.warn(`Origin ${origin} not in allowed list, but allowing in development mode`);
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      }
    },
    credentials: true,
  }));

  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
  });
  app.use('/api', limiter);

  // Health check
  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    });
  });

  // API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/solutions', solutionRoutes);
  app.use('/api/news', newsRoutes);
  app.use('/api/navigation', navigationRoutes);
  app.use('/api/inquiries', inquiryRoutes);

  // 404 handler
  app.use(notFoundHandler);

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
};

export default createApp;
