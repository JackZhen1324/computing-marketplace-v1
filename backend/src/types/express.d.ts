import 'express';

declare module 'express' {
  interface Request {
    query: any;
  }
}
