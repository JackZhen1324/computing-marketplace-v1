// Extend Express types without overriding
import 'express';

declare global {
  namespace Express {
    interface Request {
      query: any;
      body: any;
      params: any;
    }
  }
}

export {};
