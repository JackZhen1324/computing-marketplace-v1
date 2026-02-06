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

  // Security middleware
  app.use(helmet());

  // CORS
  app.use(cors(authConfig.cors));

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
